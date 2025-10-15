<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetPeralatanKomunikasi extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_peralatan_komunikasi';
    protected $fillable = [
        'inventaris_id',
        'merk',
        'frekuensi',
        'serial_number',
        'jenis_peralatan',
        'tahun_perolehan'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}