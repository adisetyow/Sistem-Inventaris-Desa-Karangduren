<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetKesehatanPosyandu extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_kesehatan_posyandu';
    protected $fillable = [
        'inventaris_id',
        'nama_alat',
        'merk',
        'tahun_perolehan',
        'jumlah',
        'lokasi_penempatan',
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}