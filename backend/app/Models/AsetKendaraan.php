<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetKendaraan extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_kendaraan';
    protected $fillable = [
        'inventaris_id',
        'jenis_kendaraan',
        'merk_tipe',
        'nomor_polisi',
        'nomor_rangka',
        'nomor_mesin',
        'tahun_perolehan',
        'warna'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}