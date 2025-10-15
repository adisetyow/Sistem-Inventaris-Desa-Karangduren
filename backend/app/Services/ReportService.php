<?php

namespace App\Services;

use App\Models\Inventaris;
use App\Models\KategoriInventaris;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;

class ReportService
{

    public function getFilteredInventaris(Request $request)
    {
        $query = Inventaris::with(['kategori'])
            ->aktif()
            ->filter(request(['search', 'kategori_id', 'kondisi', 'lokasi']));

        if ($request->has('tanggal_dari') && $request->has('tanggal_sampai')) {
            $query->whereBetween('tanggal_masuk', [
                $request->input('tanggal_dari'),
                $request->input('tanggal_sampai')
            ]);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function generateReportStats($inventaris)
    {
        $totalNilai = $inventaris->sum(function ($item) {
            return $item->total_nilai;
        });

        return [
            'totalInventaris' => $inventaris->count(),
            'totalNilai' => $totalNilai,
            'kondisiStats' => $inventaris->groupBy('kondisi')->map->count(),
            'kategoriStats' => $inventaris->groupBy('kategori.nama_kategori')->map->count(),
        ];
    }

    public function getFilterInfo(Request $request)
    {
        $filterInfo = [];

        if ($request->filled('kategori_id')) {
            $kategori = KategoriInventaris::find($request->input('kategori_id'));
            $filterInfo['kategori'] = $kategori->nama_kategori ?? '-';
        }

        if ($request->filled('kondisi')) {
            $filterInfo['kondisi'] = $request->input('kondisi');
        }

        if ($request->filled('lokasi')) {
            $filterInfo['lokasi'] = $request->input('lokasi');
        }

        if ($request->filled('search')) {
            $filterInfo['pencarian'] = $request->input('search');
        }

        if ($request->filled('tanggal_dari') && $request->filled('tanggal_sampai')) {
            $filterInfo['periode'] = $request->input('tanggal_dari') . ' s/d ' . $request->input('tanggal_sampai');
        }

        return $filterInfo;
    }

    public function exportCsv(Request $request)
    {
        $inventaris = $this->getFilteredInventaris($request);
        $filename = 'inventaris_' . date('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($inventaris) {
            $file = fopen('php://output', 'w');

            // Header CSV
            fputcsv($file, [
                'Kode Inventaris',
                'Nama Barang',
                'Kategori',
                'Jumlah',
                'Kondisi',
                'Lokasi',
                'Tanggal Masuk',
                'Sumber Dana',
                'Harga Satuan',
                'Total Nilai Aset',
                'Masa Pakai (Tahun)'
            ]);

            // Data
            foreach ($inventaris as $item) {
                fputcsv($file, [
                    $item->kode_inventaris,
                    $item->nama_barang,
                    $item->kategori->nama_kategori ?? '-',
                    $item->jumlah,
                    $item->kondisi,
                    $item->lokasi_penempatan,
                    $item->tanggal_masuk,
                    $item->sumber_dana,
                    number_format((float) $item->harga_perolehan, 2),
                    number_format((float) $item->total_nilai, 2),
                ]);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function exportPdf(Request $request)
    {
        $inventaris = $this->getFilteredInventaris($request);
        $filterInfo = $this->getFilterInfo($request);
        $stats = $this->generateReportStats($inventaris);

        $data = [
            'inventaris' => $inventaris->map(function ($item) {
                return [
                    'kode_inventaris' => $item->kode_inventaris,
                    'nama_barang' => $item->nama_barang,
                    'kategori' => $item->kategori ? $item->kategori->nama_kategori : '-',
                    'jumlah' => $item->jumlah,
                    'kondisi' => $item->kondisi,
                    'lokasi_penempatan' => $item->lokasi_penempatan,
                    'tanggal_masuk' => $item->tanggal_masuk,
                    'sumber_dana' => $item->sumber_dana,
                    'harga_perolehan' => $item->harga_perolehan,

                ];
            }),
            'filterInfo' => $filterInfo,
            'totalInventaris' => $stats['totalInventaris'],
            'totalNilai' => number_format($stats['totalNilai'], 2),
            'kondisiStats' => $stats['kondisiStats'],
            'kategoriStats' => $stats['kategoriStats'],
            'tanggalCetak' => now()->format('d/m/Y H:i:s')
        ];

        $pdf = Pdf::loadView('laporan.pdf', $data);
        $pdf->setPaper('A4', 'landscape');

        $filename = 'laporan_inventaris_' . date('Ymd_His') . '.pdf';

        return $pdf->download($filename);
    }
}