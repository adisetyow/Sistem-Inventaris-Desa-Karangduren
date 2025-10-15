<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetTanah extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_tanah';
    protected $fillable = [
        'inventaris_id',
        'luas',
        'alamat',
        'nomor_sertifikat',
        'status_sertifikat',
        'tahun_diperoleh',
        'penggunaan_saat_ini'
    ];

    protected $casts = [
        'luas' => 'decimal:2'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}