<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsetLainnya extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'aset_lainnya';
    protected $fillable = [
        'inventaris_id',
        'nama_aset',
        'merk',
        'tahun_perolehan',
        'deskripsi'
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }
}