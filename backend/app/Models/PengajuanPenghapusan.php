<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengajuanPenghapusan extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terhubung dengan model.
     *
     * @var string
     */
    protected $table = 'pengajuan_penghapusan';

    /**
     * Atribut yang dapat diisi secara massal (mass assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'inventaris_id',
        'admin_id',
        'superadmin_id',
        'alasan_penghapusan',
        'berita_acara_path',
        'status_pengajuan', // 'menunggu', 'disetujui', 'ditolak'
        'catatan_penolakan',
        'tanggal_diproses',
    ];

    /**
     * Tipe data asli dari atribut (attribute casting).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_diproses' => 'datetime',
    ];

    /**
     * Mendefinisikan relasi "belongsTo" ke model Inventaris.
     * Setiap pengajuan pasti terhubung ke satu inventaris.
     */
    public function inventaris(): BelongsTo
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id')->withTrashed();
        // Menggunakan withTrashed() agar data inventaris tetap bisa diakses
        // meskipun sudah di-soft delete setelah disetujui.
    }

    /**
     * Mendefinisikan relasi "belongsTo" ke model User (sebagai Admin).
     * Setiap pengajuan dibuat oleh satu Admin.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Mendefinisikan relasi "belongsTo" ke model User (sebagai Superadmin).
     * Setiap pengajuan diproses oleh satu Superadmin.
     */
    public function superadmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'superadmin_id');
    }
}