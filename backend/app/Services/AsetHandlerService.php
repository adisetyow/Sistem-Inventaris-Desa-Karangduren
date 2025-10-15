<?php

namespace App\Services;

use App\Models\Inventaris;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AsetHandlerService
{

    public function storeDetailAset(array $validatedData, Inventaris $inventaris)
    {
        // Normalize nama_kategori
        $namaKategori = trim(strtolower($inventaris->kategori->nama_kategori));

        // 1. Ambil HANYA NAMA FIELD yang relevan untuk kategori ini
        $detailFieldKeys = array_keys($this->getFieldsForCategory($namaKategori));

        // 2. Filter array $validatedData agar hanya berisi field-field di atas
        $detailData = array_filter(
            $validatedData,
            fn($key) => in_array($key, $detailFieldKeys),
            ARRAY_FILTER_USE_KEY
        );

        // 3. Tambahkan inventaris_id ke data yang sudah bersih
        $dataToCreate = array_merge($detailData, ['inventaris_id' => $inventaris->id]);

        switch ($namaKategori) {
            case 'peralatan kantor':
                $inventaris->asetPeralatanKantor()->create($dataToCreate);
                break;
            case 'peralatan komunikasi':
                $inventaris->asetPeralatanKomunikasi()->create($dataToCreate);
                break;
            case 'bangunan':
                $inventaris->asetBangunan()->create($dataToCreate);
                break;
            case 'kendaraan':
                $inventaris->asetKendaraan()->create($dataToCreate);
                break;
            case 'kesehatan posyandu':
                $inventaris->asetKesehatanPosyandu()->create($dataToCreate);
                break;
            case 'tanah':
                $inventaris->asetTanah()->create($dataToCreate);
                break;
            case 'infrastruktur':
                $inventaris->asetInfrastruktur()->create($dataToCreate);
                break;
            case 'pertanian':
                $inventaris->asetPertanian()->create($dataToCreate);
                break;
            default:
                $inventaris->asetLainnya()->create($dataToCreate);
                break;
        }
    }

    public function updateDetailAset(array $validatedData, Inventaris $inventaris)
    {
        $namaKategori = trim(strtolower($inventaris->kategori->nama_kategori));
        $tableName = $this->getTableNameForCategory($namaKategori);

        if (!$tableName) {
            Log::warning('Tidak ada tabel detail untuk kategori: ' . $namaKategori);
            return;
        }

        $detailFieldKeys = array_keys($this->getFieldsForCategory($namaKategori));
        $detailData = array_filter(
            $validatedData,
            fn($key) => in_array($key, $detailFieldKeys),
            ARRAY_FILTER_USE_KEY
        );

        if (empty($detailData)) {
            Log::warning('Tidak ada data detail untuk diupdate pada kategori: ' . $namaKategori);
            return;
        }

        Log::info('Attempting to update/insert detail aset via Query Builder.', [
            'table' => $tableName,
            'data' => $detailData
        ]);

        // Gunakan Query Builder's updateOrInsert
        DB::table($tableName)->updateOrInsert(
            ['inventaris_id' => $inventaris->id],
            $detailData
        );
    }

    private function getTableNameForCategory($kategori)
    {
        $kategori = trim(strtolower($kategori));
        switch ($kategori) {
            case 'peralatan kantor':
                return 'aset_peralatan_kantor';
            case 'peralatan komunikasi':
                return 'aset_peralatan_komunikasi';
            case 'bangunan':
                return 'aset_bangunan';
            case 'kendaraan':
                return 'aset_kendaraan';
            case 'kesehatan posyandu':
                return 'aset_kesehatan_posyandu';
            case 'tanah':
                return 'aset_tanah';
            case 'infrastruktur':
                return 'aset_infrastruktur';
            case 'pertanian':
                return 'aset_pertanian';
            default:
                return 'aset_lainnya';
        }
    }

    public function getFieldsForCategory($kategori)
    {
        $kategori = trim(strtolower($kategori));
        switch ($kategori) {
            case 'peralatan kantor':
                return [
                    'merk' => ['label' => 'Merk', 'type' => 'text', 'required' => true],
                    'bahan' => ['label' => 'Bahan', 'type' => 'text', 'required' => false],
                    'tahun_perolehan' => ['label' => 'Tahun Perolehan', 'type' => 'number', 'required' => true],
                    'warna' => ['label' => 'Warna', 'type' => 'text', 'required' => false],
                    'nomor_inventaris_internal' => ['label' => 'Nomor Inventaris Internal', 'type' => 'text', 'required' => false],
                ];

            case 'peralatan komunikasi':
                return [
                    'merk' => ['label' => 'Merk', 'type' => 'text', 'required' => true],
                    'frekuensi' => ['label' => 'Frekuensi', 'type' => 'text', 'required' => false],
                    'serial_number' => ['label' => 'Serial Number', 'type' => 'text', 'required' => true],
                    'jenis_peralatan' => ['label' => 'Jenis Peralatan', 'type' => 'text', 'required' => true],
                    'tahun_perolehan' => ['label' => 'Tahun Perolehan', 'type' => 'number', 'required' => true],
                ];

            case 'bangunan':
                return [
                    'nama_bangunan' => ['label' => 'Nama Bangunan', 'type' => 'text', 'required' => true],
                    'alamat' => ['label' => 'Alamat', 'type' => 'text', 'required' => true],
                    'luas' => ['label' => 'Luas (m²)', 'type' => 'number', 'step' => '0.01', 'required' => true],
                    'tahun_bangun' => ['label' => 'Tahun Bangun', 'type' => 'number', 'required' => true],
                    'status_sertifikat' => ['label' => 'Status Sertifikat', 'type' => 'text', 'required' => false],
                    'nomor_sertifikat' => ['label' => 'Nomor Sertifikat', 'type' => 'text', 'required' => false],
                    'kondisi_fisik' => ['label' => 'Kondisi Fisik', 'type' => 'text', 'required' => false],
                ];

            case 'kendaraan':
                return [
                    'jenis_kendaraan' => ['label' => 'Jenis Kendaraan', 'type' => 'text', 'required' => true],
                    'merk_tipe' => ['label' => 'Merk/Tipe', 'type' => 'text', 'required' => true],
                    'nomor_polisi' => ['label' => 'Nomor Polisi', 'type' => 'text', 'required' => true],
                    'nomor_rangka' => ['label' => 'Nomor Rangka', 'type' => 'text', 'required' => true],
                    'nomor_mesin' => ['label' => 'Nomor Mesin', 'type' => 'text', 'required' => true],
                    'tahun_perolehan' => ['label' => 'Tahun Perolehan', 'type' => 'number', 'required' => true],
                    'warna' => ['label' => 'Warna', 'type' => 'text', 'required' => false],
                ];

            case 'kesehatan posyandu':
                return [
                    'nama_alat' => ['label' => 'Nama Alat', 'type' => 'text', 'required' => true],
                    'merk' => ['label' => 'Merk', 'type' => 'text', 'required' => true],
                    'tahun_perolehan' => ['label' => 'Tahun Perolehan', 'type' => 'number', 'required' => true],
                    'jumlah' => ['label' => 'Jumlah', 'type' => 'number', 'required' => true],
                    'lokasi_penempatan' => ['label' => 'Lokasi Penempatan', 'type' => 'text', 'required' => true],
                ];

            case 'tanah':
                return [
                    'luas' => ['label' => 'Luas (m²)', 'type' => 'number', 'step' => '0.01', 'required' => true],
                    'alamat' => ['label' => 'Alamat', 'type' => 'text', 'required' => true],
                    'nomor_sertifikat' => ['label' => 'Nomor Sertifikat', 'type' => 'text', 'required' => false],
                    'status_sertifikat' => ['label' => 'Status Sertifikat', 'type' => 'text', 'required' => false],
                    'tahun_diperoleh' => ['label' => 'Tahun Diperoleh', 'type' => 'number', 'required' => true],
                    'penggunaan_saat_ini' => ['label' => 'Penggunaan Saat Ini', 'type' => 'text', 'required' => false],
                ];

            case 'infrastruktur':
                return [
                    'jenis_infrastruktur' => ['label' => 'Jenis Infrastruktur', 'type' => 'text', 'required' => true],
                    'lokasi' => ['label' => 'Lokasi', 'type' => 'text', 'required' => true],
                    'panjang' => ['label' => 'Panjang (m)', 'type' => 'number', 'step' => '0.01', 'required' => false],
                    'lebar' => ['label' => 'Lebar (m)', 'type' => 'number', 'step' => '0.01', 'required' => false],
                    'tahun_bangun' => ['label' => 'Tahun Bangun', 'type' => 'number', 'required' => true],
                    'status_kepemilikan' => ['label' => 'Status Kepemilikan', 'type' => 'text', 'required' => false],
                    'kondisi_fisik' => ['label' => 'Kondisi Fisik', 'type' => 'text', 'required' => false],
                ];

            case 'pertanian':
                return [
                    'jenis_alat' => ['label' => 'Jenis Alat', 'type' => 'text', 'required' => true],
                    'merk' => ['label' => 'Merk', 'type' => 'text', 'required' => true],
                    'tahun_perolehan' => ['label' => 'Tahun Perolehan', 'type' => 'number', 'required' => true],
                    'lokasi_penyimpanan' => ['label' => 'Lokasi Penyimpanan', 'type' => 'text', 'required' => false],
                ];

            default:
                return [
                    'nama_aset' => ['label' => 'Nama Aset', 'type' => 'text', 'required' => true],
                    'merk' => ['label' => 'Merk', 'type' => 'text', 'required' => false],
                    'tahun_perolehan' => ['label' => 'Tahun Perolehan', 'type' => 'number', 'required' => true],
                    'deskripsi' => ['label' => 'Deskripsi', 'type' => 'textarea', 'required' => false],
                ];
        }
    }
}