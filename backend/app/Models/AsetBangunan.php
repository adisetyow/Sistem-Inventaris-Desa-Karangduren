<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetBangunan extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_bangunan';
    protected $fillable = [
        'inventaris_id',
        'nama_bangunan',
        'alamat',
        'luas',
        'tahun_bangun',
        'status_sertifikat',
        'nomor_sertifikat',
        'kondisi_fisik'
    ];

    protected $casts = [
        'luas' => 'decimal:2'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}