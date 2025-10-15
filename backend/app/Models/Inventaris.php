<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Inventaris extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'inventaris';

    protected $fillable = [
        'kategori_id',
        'nama_barang',
        'kode_inventaris',
        'jumlah',
        'kondisi',
        'status',
        'lokasi_penempatan',
        'tanggal_masuk',
        'sumber_dana',
        'harga_perolehan',
        'catatan',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'nama_barang',
                'kondisi',
                'lokasi_penempatan',
                'harga_perolehan',
                'catatan',
                'status'
            ])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Data inventaris '{$this->nama_barang}' telah di-{$eventName}");
    }


    protected $casts = [
        'tanggal_masuk' => 'date',
        'tanggal_dihapus' => 'date',
        'harga_perolehan' => 'decimal:2',
    ];

    protected $appends = ['total_harga'];

    // Relationships
    public function kategori()
    {
        return $this->belongsTo(KategoriInventaris::class, 'kategori_id');
    }

    public function asetPeralatanKantor()
    {
        return $this->hasOne(AsetPeralatanKantor::class, 'inventaris_id');
    }

    public function asetPeralatanKomunikasi()
    {
        return $this->hasOne(AsetPeralatanKomunikasi::class, 'inventaris_id');
    }

    public function asetBangunan()
    {
        return $this->hasOne(AsetBangunan::class, 'inventaris_id');
    }

    public function asetKendaraan()
    {
        return $this->hasOne(AsetKendaraan::class, 'inventaris_id');
    }

    public function asetKesehatanPosyandu()
    {
        return $this->hasOne(AsetKesehatanPosyandu::class, 'inventaris_id');
    }

    public function asetTanah()
    {
        return $this->hasOne(AsetTanah::class, 'inventaris_id');
    }

    public function asetInfrastruktur()
    {
        return $this->hasOne(AsetInfrastruktur::class, 'inventaris_id');
    }

    public function asetPertanian()
    {
        return $this->hasOne(AsetPertanian::class, 'inventaris_id');
    }

    public function asetLainnya()
    {
        return $this->hasOne(AsetLainnya::class, 'inventaris_id');
    }

    public function logStatus()
    {
        return $this->hasMany(LogStatusInventaris::class);
    }

    // Relasi untuk mendapatkan log status TERAKHIR
    public function logStatusTerakhir()
    {
        // Mengambil satu log terakhir berdasarkan waktu pembuatannya
        return $this->hasOne(LogStatusInventaris::class)->latestOfMany();
    }

    // Accessor
    protected function totalHarga(): Attribute
    {
        return Attribute::make(
            get: function ($value, $attributes) {
                if (isset($attributes['jumlah']) && isset($attributes['harga_perolehan'])) {
                    return $attributes['jumlah'] * $attributes['harga_perolehan'];
                }
                return 0;
            }
        );
    }

    public function penghapusanInventaris()
    {
        return $this->hasMany(PenghapusanInventaris::class, 'inventaris_id_lama');
    }

    public function penghapusanTerakhir()
    {
        return $this->hasOne(PenghapusanInventaris::class, 'inventaris_id_lama')->latest();
    }

    public function riwayatPenghapusan()
    {
        // memuat data superadmin yang menyetujui
        return $this->hasOne(PengajuanPenghapusan::class, 'inventaris_id')
            ->where('status_pengajuan', 'disetujui')
            ->with('superadmin.roles', 'admin.roles');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }


    public function scopeTidakAktif($query)
    {
        return $query->where('status', 'tidak_aktif');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('nama_barang', 'like', '%' . $search . '%')
                    ->orWhere('kode_inventaris', 'like', '%' . $search . '%');
            });
        });

        $query->when($filters['kategori_id'] ?? false, function ($query, $kategoriId) {
            return $query->where('kategori_id', $kategoriId);
        });

        $query->when($filters['kondisi'] ?? false, function ($query, $kondisi) {
            return $query->where('kondisi', $kondisi);
        });

        $query->when($filters['lokasi'] ?? false, function ($query, $lokasi) {
            return $query->where('lokasi_penempatan', 'like', '%' . $lokasi . '%');
        });
        $query->when($filters['priceRange'] ?? false, function ($query, $priceRange) {
            // Memecah string "min-max" menjadi array [min, max]
            $range = explode('-', $priceRange);
            $minPrice = $range[0];
            $maxPrice = $range[1];

            // Menerapkan filter whereBetween ke kolom harga_perolehan
            return $query->whereBetween('harga_perolehan', [$minPrice, $maxPrice]);
        });
    }

    // Helper method untuk mendapatkan detail aset sesuai kategori
    public function getDetailAset()
    {
        if (!$this->relationLoaded('kategori') || !$this->kategori) {
            return null;
        }

        // Normalize nama_kategori: lowercase and trim
        $namaKategori = trim(strtolower($this->kategori->nama_kategori));

        switch ($namaKategori) {
            case 'peralatan kantor':
                return $this->asetPeralatanKantor;
            case 'peralatan komunikasi':
                return $this->asetPeralatanKomunikasi;
            case 'bangunan':
                return $this->asetBangunan;
            case 'kendaraan':
                return $this->asetKendaraan;
            case 'kesehatan posyandu':
                return $this->asetKesehatanPosyandu;
            case 'tanah':
                return $this->asetTanah;
            case 'infrastruktur':
                return $this->asetInfrastruktur;
            case 'pertanian':
                return $this->asetPertanian;
            default:
                return $this->asetLainnya;
        }
    }


}