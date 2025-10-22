<?php

namespace App\Exports;

use App\Models\Inventaris;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Carbon\Carbon;

class InventarisExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $filters;
    protected $kolom;

    public function __construct(array $filters = [], array $kolom = ['kode_inventaris', 'nama_barang'])
    {
        $this->filters = $filters;
        $this->kolom = $kolom;
    }

    public function query(): Builder
    {
        $query = Inventaris::query()->with('kategori');

        $f = $this->filters;

        if (!empty($f['tanggal_mulai'])) {
            $query->whereDate('tanggal_masuk', '>=', $f['tanggal_mulai']);
        }

        if (!empty($f['tanggal_selesai'])) {
            $query->whereDate('tanggal_masuk', '<=', $f['tanggal_selesai']);
        }

        if (!empty($f['kategori_id'])) {
            $query->where('kategori_id', $f['kategori_id']);
        }

        if (!empty($f['status'])) {
            $query->where('status', $f['status']);
        }

        if (!empty($f['kondisi'])) {
            $query->where('kondisi', $f['kondisi']);
        }

        if (!empty($f['sumber_dana'])) {
            $query->where('sumber_dana', 'like', "%{$f['sumber_dana']}%");
        }

        if (!empty($f['lokasi'])) {
            $query->where('lokasi_penempatan', 'like', "%{$f['lokasi']}%");
        }

        return $query->latest();
    }

    public function headings(): array
    {
        return array_map(fn($k) => ucwords(str_replace('_', ' ', $k)), $this->kolom);
    }

    public function map($inventaris): array
    {
        $row = [];

        foreach ($this->kolom as $k) {
            switch ($k) {
                case 'kategori':
                    $row[] = $inventaris->kategori->nama_kategori ?? '-';
                    break;

                case 'tanggal_masuk':
                    $row[] = $inventaris->tanggal_masuk
                        ? Carbon::parse($inventaris->tanggal_masuk)->format('d M Y')
                        : '-';
                    break;

                case 'total_harga':
                case 'harga_perolehan':
                    $row[] = $inventaris->$k
                        ? 'Rp ' . number_format($inventaris->$k, 0, ',', '.')
                        : 'Rp 0';
                    break;

                default:
                    $row[] = $inventaris->$k ?? '-';
                    break;
            }
        }

        return $row;
    }
}
