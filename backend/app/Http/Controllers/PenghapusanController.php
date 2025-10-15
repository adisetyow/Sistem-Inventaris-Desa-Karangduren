<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\PengajuanPenghapusan;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Http\JsonResponse;


class PenghapusanController extends Controller
{

    public function ajukan(Request $request)
    {
        $validated = $request->validate([
            'inventaris_id' => 'required|exists:inventaris,id',
            'alasan_penghapusan' => 'required|string',
            'berita_acara' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $inventaris = Inventaris::findOrFail($validated['inventaris_id']);

            // Cek status, hanya barang 'aktif' yang bisa diajukan
            if ($inventaris->status !== 'aktif') {
                return response()->json(['status' => 'error', 'message' => 'Barang ini tidak dalam status aktif.'], 422);
            }

            // 1. Ubah status inventaris
            $inventaris->update(['status' => 'menunggu_persetujuan_penghapusan']);

            // 2. Simpan file berita acara
            $path = $request->file('berita_acara')->store('berita_acara', 'public');

            // 3. Buat catatan pengajuan
            PengajuanPenghapusan::create([
                'inventaris_id' => $inventaris->id,
                'admin_id' => Auth::id(),
                'alasan_penghapusan' => $validated['alasan_penghapusan'],
                'berita_acara_path' => $path,
                'status_pengajuan' => 'menunggu',
            ]);

            activity()
                ->causedBy(Auth::user())
                ->performedOn($inventaris)
                ->withProperties([
                    'alasan_penghapusan' => $request->alasan_penghapusan
                ])
                ->log("Mengajukan penghapusan dengan alasan: {$request->alasan_penghapusan}");

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Pengajuan penghapusan berhasil dikirim.'], 201);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error submitting deletion request: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan pada server.'], 500);
        }
    }

    public function daftarPengajuan(Request $request): JsonResponse
    {
        try {
            $pengajuan = PengajuanPenghapusan::with(['inventaris', 'admin'])
                ->where('status_pengajuan', 'menunggu')
                ->latest()
                ->paginate(10);

            return response()->json([
                'status' => 'success',
                'data' => $pengajuan
            ], 200);

        } catch (Exception $e) {
            Log::error('Gagal mengambil daftar pengajuan: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil data.'], 500);
        }
    }


    public function setujui(PengajuanPenghapusan $pengajuan): JsonResponse
    {
        try {
            DB::beginTransaction();

            // 1. Ambil inventaris terkait
            $inventaris = $pengajuan->inventaris;
            if (!$inventaris) {
                throw new Exception('Inventaris terkait tidak ditemukan.');
            }

            // Ubah statusnya menjadi 'dihapus'
            $inventaris->update(['status' => 'dihapus']);

            // 2. Lakukan Soft Delete pada inventaris
            $inventaris->delete();

            // 3. Update status pengajuan
            $pengajuan->update([
                'status_pengajuan' => 'disetujui',
                'superadmin_id' => Auth::id(),
                'tanggal_diproses' => now(),
            ]);

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Pengajuan berhasil disetujui. Aset telah diarsipkan.']);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Gagal menyetujui pengajuan: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses persetujuan.'], 500);
        }
    }

    /**
     * Menolak pengajuan penghapusan.
     */
    public function tolak(Request $request, PengajuanPenghapusan $pengajuan): JsonResponse
    {
        $validated = $request->validate([
            'catatan_penolakan' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // 1. Ambil inventaris terkait
            $inventaris = $pengajuan->inventaris;
            if (!$inventaris) {
                throw new Exception('Inventaris terkait tidak ditemukan.');
            }

            // 2. Kembalikan status inventaris menjadi 'aktif'
            $inventaris->update(['status' => 'aktif']);

            // 3. Update status pengajuan
            $pengajuan->update([
                'status_pengajuan' => 'ditolak',
                'superadmin_id' => Auth::id(),
                'tanggal_diproses' => now(),
                'catatan_penolakan' => $validated['catatan_penolakan'],
            ]);

            activity()
                ->causedBy(Auth::user())
                ->performedOn($inventaris)
                ->withProperties(['catatan' => $request->catatan_penolakan]) // Info tambahan
                ->log("Menolak penghapusan dengan catatan: {$request->catatan_penolakan}");

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Pengajuan berhasil ditolak. Aset telah diaktifkan kembali.']);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Gagal menolak pengajuan: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses penolakan.'], 500);
        }
    }

    public function countPengajuan(): JsonResponse
    {
        try {
            $count = PengajuanPenghapusan::where('status_pengajuan', 'menunggu')->count();
            return response()->json(['status' => 'success', 'data' => ['count' => $count]]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghitung data.'], 500);
        }
    }
}