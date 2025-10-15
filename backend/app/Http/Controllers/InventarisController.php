<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\KategoriInventaris;
use App\Models\LogAktivitas;
use App\Models\LogStatusInventaris;
use App\Services\AsetHandlerService;
use App\Services\KodeInventarisService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class InventarisController extends Controller
{
    protected $asetHandlerService;
    protected $kodeInventarisService;

    public function __construct(AsetHandlerService $asetHandlerService, KodeInventarisService $kodeInventarisService)
    {
        $this->asetHandlerService = $asetHandlerService;
        $this->kodeInventarisService = $kodeInventarisService;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 25);

        $query = Inventaris::with(['kategori'])
            ->filter($request->only(['search', 'kategori_id', 'kondisi', 'lokasi', 'priceRange']));

        $query->when($request->status, function ($q, $status) {
            if (in_array($status, ['aktif', 'tidak_aktif'])) {
                // JIKA STATUS TIDAK AKTIF, MUAT RELASI LOG TERAKHIR
                if ($status === 'tidak_aktif') {
                    $q->with('logStatusTerakhir');
                }
                return $q->where('status', $status);
            }
            return $q;
        });
        $inventaris = $query->latest()->paginate($perPage)->appends($request->query());

        return response()->json(['status' => 'success', 'data' => ['inventaris' => $inventaris]]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $validated = $request->all();

            $inventarisFillable = (new Inventaris)->getFillable();
            $inventarisData = array_intersect_key($validated, array_flip($inventarisFillable));

            $inventaris = Inventaris::create($inventarisData);

            $inventaris->load('kategori');

            $this->asetHandlerService->storeDetailAset($validated, $inventaris);

            DB::commit();

            return response()->json(['status' => 'success', 'data' => $inventaris], 201);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }


    public function show(Inventaris $inventaris): JsonResponse
    {
        try {
            // Eager load relasi kategori DAN semua kemungkinan relasi detail aset
            $inventaris->load([
                'kategori',
                'logStatusTerakhir',
                'asetPeralatanKantor',
                'asetPeralatanKomunikasi',
                'asetBangunan',
                'asetKendaraan',
                'asetKesehatanPosyandu',
                'asetTanah',
                'asetInfrastruktur',
                'asetPertanian',
                'asetLainnya',
                'riwayatPenghapusan'
            ]);

            $inventarisData = $inventaris->toArray();

            $detailAset = $inventaris->getDetailAset();
            $detailAsetData = $detailAset ? $detailAset->toArray() : [];

            unset(
                $inventarisData['aset_peralatan_kantor'],
                $inventarisData['aset_peralatan_komunikasi'],
                $inventarisData['aset_bangunan'],
                $inventarisData['aset_kendaraan'],
                $inventarisData['aset_kesehatan_posyandu'],
                $inventarisData['aset_tanah'],
                $inventarisData['aset_infrastruktur'],
                $inventarisData['aset_pertanian'],
                $inventarisData['aset_lainnya']
            );

            // Gabungkan data dasar dengan data detail yang relevan menjadi satu level (flat)
            $mergedData = array_merge($inventarisData, $detailAsetData);

            return response()->json([
                'status' => 'success',
                'message' => 'Detail inventaris berhasil diambil.',
                'data' => $mergedData
            ], 200);

        } catch (Exception $e) {
            Log::error('Error fetching inventaris detail: ' . $e->getMessage() . ' for Inventaris ID: ' . $inventaris->id);
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil detail inventaris.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Inventaris $inventaris): JsonResponse
    {
        try {
            DB::beginTransaction();
            $validated = $request->all();

            $inventarisFillable = (new Inventaris)->getFillable();
            $inventarisData = array_intersect_key($validated, array_flip($inventarisFillable));

            $inventaris->update($inventarisData);
            $this->asetHandlerService->updateDetailAset($validated, $inventaris);

            DB::commit();

            return response()->json(['status' => 'success', 'data' => $inventaris->fresh()]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating inventaris: ' . $e->getMessage());

            // UBAH BAGIAN RETURN INI UNTUK DEBUGGING
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(), // <-- Tampilkan pesan error asli
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function destroy(Inventaris $inventaris): JsonResponse
    {
        try {
            $inventaris->delete();
            return response()->json(['status' => 'success', 'message' => 'Data diarsipkan.']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengarsipkan data.'], 500);
        }
    }

    public function generateKode(KategoriInventaris $kategori): JsonResponse
    {
        $kode = $this->kodeInventarisService->generateKode($kategori->id);
        return response()->json(['status' => 'success', 'kode' => $kode]);
    }

    public function getKategoriDetail($id): JsonResponse
    {
        $kategori = KategoriInventaris::findOrFail($id);
        $fields = $this->asetHandlerService->getFieldsForCategory($kategori->nama_kategori);
        return response()->json(['status' => 'success', 'data' => ['fields' => $fields]]);
    }

    public function riwayatPenghapusan(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 25);


            $query = Inventaris::onlyTrashed()->with(['kategori']);

            $query->filter($request->only(['search', 'kategori_id', 'kondisi', 'priceRange']));

            $inventaris = $query->latest('deleted_at')
                ->paginate($perPage)
                ->withQueryString();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'inventaris' => $inventaris,
                ]
            ], 200);

        } catch (Exception $e) {
            Log::error('Error fetching trashed inventaris: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data riwayat penghapusan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function restore(Inventaris $inventaris): JsonResponse
    {
        try {
            $inventaris->restore();

            activity()
                ->causedBy(Auth::user())
                ->performedOn($inventaris)
                ->log("Mengembalikan aset dari arsip");

            return response()->json([
                'status' => 'success',
                'message' => 'Inventaris berhasil dikembalikan.'
            ], 200);
        } catch (Exception $e) {
            Log::error('Error restoring inventaris: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengembalikan inventaris.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function setTidakAktif(Request $request, Inventaris $inventaris): JsonResponse
    {
        $validated = $request->validate([
            'alasan' => 'required|string|max:1000',
            'file_pendukung' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $path = null;
            if ($request->hasFile('file_pendukung')) {
                $path = $request->file('file_pendukung')->store('file_pendukung_status', 'public');
            }

            LogStatusInventaris::create([
                'inventaris_id' => $inventaris->id,
                'user_id' => Auth::id(),
                'status_sebelum' => 'aktif',
                'status_sesudah' => 'tidak_aktif',
                'alasan' => $validated['alasan'],
                'file_pendukung_path' => $path,
            ]);

            activity()->withProperty('alasan', $validated['alasan']);

            $inventaris->status = 'tidak_aktif';
            $inventaris->save();

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Inventaris berhasil dinonaktifkan.']);
        } catch (Exception $e) {
            Log::error('Error setting inventaris to inactive: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal menonaktifkan inventaris.'], 500);
        }
    }

    public function setAktif(Request $request, Inventaris $inventaris): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Buat log perubahan status
            LogStatusInventaris::create([
                'inventaris_id' => $inventaris->id,
                'user_id' => Auth::id(),
                'status_sebelum' => 'tidak_aktif',
                'status_sesudah' => 'aktif',
                'alasan' => 'Aset diaktifkan kembali.',
            ]);

            // Update status inventaris
            $inventaris->status = 'aktif';
            $inventaris->save();

            activity()
                ->causedBy(Auth::user())
                ->performedOn($inventaris)
                ->withProperties(['alasan' => $request->alasan])
                ->log("Mengaktifkan kembali aset dengan alasan: {$request->alasan}");

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Inventaris berhasil diaktifkan kembali.']);
        } catch (Exception $e) {
            Log::error('Error setting inventaris to active: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal mengaktifkan inventaris.'], 500);
        }
    }
}
