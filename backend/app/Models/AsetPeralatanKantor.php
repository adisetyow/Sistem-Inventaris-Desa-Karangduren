<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetPeralatanKantor extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_peralatan_kantor';
    protected $fillable = [
        'inventaris_id',
        'merk',
        'bahan',
        'tahun_perolehan',
        'warna',
        'nomor_inventaris_internal'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}