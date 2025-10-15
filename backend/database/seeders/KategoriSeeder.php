<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KategoriInventaris;

class KategoriSeeder extends Seeder
{
    /**
     * Jalankan seeder untuk tabel kategori_inventaris.
     */
    public function run(): void
    {
        $kategoris = [
            [
                'nama_kategori' => 'Peralatan Kantor',
                'deskripsi' => 'Peralatan dan perlengkapan kantor desa',
                'icon' => 'fa-desktop'
            ],
            [
                'nama_kategori' => 'Peralatan Komunikasi',
                'deskripsi' => 'Peralatan komunikasi dan elektronik',
                'icon' => 'fa-phone'
            ],
            [
                'nama_kategori' => 'Bangunan',
                'deskripsi' => 'Bangunan dan gedung milik desa',
                'icon' => 'fa-building'
            ],
            [
                'nama_kategori' => 'Kendaraan',
                'deskripsi' => 'Kendaraan operasional desa',
                'icon' => 'fa-car'
            ],
            [
                'nama_kategori' => 'Kesehatan Posyandu',
                'deskripsi' => 'Peralatan kesehatan dan posyandu',
                'icon' => 'fa-medkit'
            ],
            [
                'nama_kategori' => 'Tanah',
                'deskripsi' => 'Tanah dan lahan milik desa',
                'icon' => 'fa-map'
            ],
            [
                'nama_kategori' => 'Infrastruktur',
                'deskripsi' => 'Infrastruktur dan fasilitas umum',
                'icon' => 'fa-cogs'
            ],
            [
                'nama_kategori' => 'Pertanian',
                'deskripsi' => 'Peralatan dan sarana pertanian',
                'icon' => 'fa-leaf'
            ],
            [
                'nama_kategori' => 'Lainnya',
                'deskripsi' => 'Aset lainnya yang tidak termasuk kategori di atas',
                'icon' => 'fa-box'
            ]
        ];

        foreach ($kategoris as $kategori) {
            KategoriInventaris::create($kategori);
        }
    }
}
