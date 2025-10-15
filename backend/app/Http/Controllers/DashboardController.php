<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\User;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{

    public function index(Request $request)
    {
        // 1. Data untuk Kartu Statistik
        $statistikUtama = [
            'totalAset' => Inventaris::count(),
            'totalNilaiAset' => Inventaris::sum(DB::raw('harga_perolehan * jumlah')),
            'totalPengguna' => User::count(),
        ];

        // 2. Data untuk Kartu Detail Kondisi (Bar Chart)
        $distribusiKondisi = Inventaris::whereNull('deleted_at')
            ->select('kondisi', DB::raw('count(*) as jumlah'))
            ->groupBy('kondisi')
            ->pluck('jumlah', 'kondisi');

        // 3. Data untuk Grafik Aset per Kategori (Bar Chart)
        $grafikAsetPerKategori = Inventaris::join('kategori_inventaris', 'inventaris.kategori_id', '=', 'kategori_inventaris.id')
            ->select('kategori_inventaris.nama_kategori as name', DB::raw('count(inventaris.id) as jumlah'))
            ->groupBy('name')
            ->orderBy('jumlah', 'desc')
            ->get();

        // 4. Data untuk Grafik Distribusi Status (Donut Chart)
        $grafikDistribusiStatus = Inventaris::select('status', DB::raw('count(*) as jumlah'))
            ->whereNull('deleted_at')
            ->groupBy('status')
            ->pluck('jumlah', 'status');

        // 5. Aktivitas Terbaru
        $aktivitasTerbaru = Activity::with('causer')->latest()->limit(5)->get();

        // 6. Gabungkan semua data
        $data = [
            'statistikUtama' => $statistikUtama,
            'distribusiKondisi' => [
                'baik' => $distribusiKondisi->get('Baik', 0),
                'rusakRingan' => $distribusiKondisi->get('Rusak Ringan', 0),
                'rusakBerat' => $distribusiKondisi->get('Rusak Berat', 0),
            ],
            'grafikAsetPerKategori' => $grafikAsetPerKategori,
            'grafikDistribusiStatus' => $grafikDistribusiStatus,
            'aktivitasTerbaru' => $aktivitasTerbaru,
        ];

        return response()->json(['status' => 'success', 'data' => $data]);
    }
}