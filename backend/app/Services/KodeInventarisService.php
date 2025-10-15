<?php

namespace App\Services;

use App\Models\Inventaris;
use App\Models\KategoriInventaris;

class KodeInventarisService
{
    /**
     * Generate kode inventaris unik berdasarkan kode desa + kategori.
     *
     * @param int $kategori_id
     * @return string
     */

    const KODE_WILAYAH = '33.22.02.2009';

    public function generateKode(int $kategoriId): string
    {
        $kategori = KategoriInventaris::findOrFail($kategoriId);
        $kodeKategori = $kategori->id;

        // Cari nomor urut terakhir untuk kategori ini
        $lastInventaris = Inventaris::where('kategori_id', $kategoriId)
            ->withTrashed()
            ->orderBy('id', 'desc')
            ->first();

        $nomorUrut = 1;
        if ($lastInventaris) {
            // Ambil nomor urut dari kode inventaris terakhir
            $parts = explode('.', $lastInventaris->kode_inventaris);
            $lastNomorUrut = (int) end($parts);
            $nomorUrut = $lastNomorUrut + 1;
        }

        // Format nomor urut menjadi 3 digit (e.g., 001, 012, 123)
        $nomorUrutFormatted = str_pad($nomorUrut, 3, '0', STR_PAD_LEFT);

        return self::KODE_WILAYAH . '.' . $kodeKategori . '.' . $nomorUrutFormatted;
    }
}
