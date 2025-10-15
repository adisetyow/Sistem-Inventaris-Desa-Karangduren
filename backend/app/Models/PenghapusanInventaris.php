<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenghapusanInventaris extends Model
{
    use HasFactory;

    protected $table = 'penghapusan_inventaris';
    protected $fillable = [
        'inventaris_id_lama',
        'kode_inventaris',
        'nama_barang',
        'tanggal_penghapusan',
        'alasan_penghapusan',
        'nomor_berita_acara',
        'file_berita_acara',
        'dihapus_oleh'
    ];

    protected $casts = [
        'tanggal_penghapusan' => 'datetime',
    ];

    public function inventaris()
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id_lama')->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'dihapus_oleh');
    }
}