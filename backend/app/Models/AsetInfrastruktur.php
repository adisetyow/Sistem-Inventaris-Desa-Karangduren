<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetInfrastruktur extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_infrastruktur';
    protected $fillable = [
        'inventaris_id',
        'jenis_infrastruktur',
        'lokasi',
        'panjang',
        'lebar',
        'tahun_bangun',
        'status_kepemilikan',
        'kondisi_fisik'
    ];

    protected $casts = [
        'panjang' => 'decimal:2',
        'lebar' => 'decimal:2'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}