<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetPertanian extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_pertanian';
    protected $fillable = [
        'inventaris_id',
        'jenis_alat',
        'merk',
        'tahun_perolehan',
        'lokasi_penyimpanan'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}