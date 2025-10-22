<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use Illuminate\Http\Request;
use App\Exports\InventarisExport;
use Illuminate\Http\JsonResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function getInventarisData(Request $request): JsonResponse
    {
        // Validasi input filter
        $request->validate([
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'kategori_id' => 'nullable|integer|exists:kategori_inventaris,id',
            'status' => 'nullable|string|in:aktif,tidak_aktif',
            'kondisi' => 'nullable|string|in:Baik,Rusak Ringan,Rusak Berat',
            'sumber_dana' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
        ]);

        $query = Inventaris::with('kategori');

        // Terapkan filter secara dinamis
        $query->when($request->tanggal_mulai, function ($q) use ($request) {
            $q->whereDate('tanggal_masuk', '>=', $request->tanggal_mulai);
        });

        $query->when($request->tanggal_selesai, function ($q) use ($request) {
            $q->whereDate('tanggal_masuk', '<=', $request->tanggal_selesai);
        });

        $query->when($request->kategori_id, function ($q, $kategori_id) {
            $q->where('kategori_id', $kategori_id);
        });

        $query->when($request->status, function ($q, $status) {
            $q->where('status', $status);
        });

        $query->when($request->kondisi, function ($q, $kondisi) {
            $q->where('kondisi', $kondisi);
        });

        $query->when($request->sumber_dana, function ($q, $sumber_dana) {
            $q->where('sumber_dana', 'like', "%{$sumber_dana}%");
        });

        $query->when($request->lokasi, function ($q, $lokasi) {

            $q->where('lokasi_penempatan', 'like', "%{$lokasi}%");
        });

        $data = $query->latest()->paginate(25)->withQueryString();

        return response()->json(['status' => 'success', 'data' => $data]);
    }

    private function buildQuery(Request $request)
    {
        // Fungsi helper untuk membangun query filter
        $query = Inventaris::with('kategori');

        // Terapkan filter secara dinamis
        $query->when($request->tanggal_mulai, function ($q) use ($request) {
            $q->whereDate('tanggal_masuk', '>=', $request->tanggal_mulai);
        });
        $query->when($request->tanggal_selesai, function ($q) use ($request) {
            $q->whereDate('tanggal_masuk', '<=', $request->tanggal_selesai);
        });
        $query->when($request->kategori_id, function ($q, $kategori_id) {
            $q->where('kategori_id', $kategori_id);
        });
        $query->when($request->status, function ($q, $status) {
            $q->where('status', $status);
        });
        $query->when($request->kondisi, function ($q, $kondisi) {
            $q->where('kondisi', $kondisi);
        });
        $query->when($request->sumber_dana, function ($q, $sumber_dana) {
            $q->where('sumber_dana', 'like', "%{$sumber_dana}%");
        });
        $query->when($request->lokasi, function ($q, $lokasi) {
            $q->where('lokasi_penempatan', 'like', "%{$lokasi}%");
        });

        // PENTING: Hapus paginasi dari buildQuery
        return $query;
    }

    public function exportPdf(Request $request)
    {
        $kolom = $request->input('kolom');
        // Jika tidak ada kolom yang dipilih, gunakan set default yang aman
        if (empty($kolom)) {
            $kolom = ['kode_inventaris', 'nama_barang', 'kategori', 'jumlah', 'kondisi', 'total_nilai'];
        }

        $data = $this->buildQuery($request)->get();

        // Hitung total nilai dari data yang sudah difilter
        $totalNilaiAset = $data->sum(function ($item) {
            // Gunakan accessor 'total_nilai' yang ada di model
            return $item->total_nilai;
        });

        $filters = $request->only(['kondisi', 'lokasi', 'tahun', 'bulan']);
        $tanggalCetak = now()->setTimezone('Asia/Jakarta')->translatedFormat('d F Y H:i');
        $tanggalTtd = now()->setTimezone('Asia/Jakarta');

        // 1. Render HTML untuk header (pastikan view-nya ada)
        $headerHtml = View::make('pdf.header')->render();

        // 2. Tentukan orientasi kertas secara dinamis
        $orientasi = (count($kolom) > 6) ? 'landscape' : 'portrait';

        // 3. Muat view utama dengan SEMUA variabel yang dibutuhkan
        $pdf = Pdf::loadView('pdf.laporan_inventaris', [
            'inventaris' => $data,
            'kolom' => $kolom, // Kirim kolom yang dipilih ke view
            'totalNilaiAset' => $totalNilaiAset,
            'filters' => $filters,
            'tanggalCetak' => $tanggalCetak,
            'date' => $tanggalTtd,
        ])
            ->setPaper('a4', $orientasi)
            // 4. Gunakan 'setOption' untuk mengatur header HTML
            ->setOption('header-html', $headerHtml)
            ->setOption('margin-top', '35mm') // Beri ruang untuk header
            ->setOption('header-spacing', 10); // Jarak antara header dan konten

        return $pdf->download('laporan-inventaris-' . now()->format('Ymd') . '.pdf');
    }


    public function exportCsv(Request $request)
    {
        $kolom = $request->input('kolom', ['kode_inventaris', 'nama_barang']);
        $filters = $request->except('kolom');
        $fileName = 'laporan-inventaris-' . now()->format('Y-m-d') . '.csv';

        // GUNAKAN Excel::download() UNTUK MEMICU UNDUHAN
        return Excel::download(new InventarisExport($filters, $kolom), $fileName);
    }
}