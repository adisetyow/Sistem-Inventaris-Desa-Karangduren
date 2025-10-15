<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogStatusInventaris extends Model
{
    use HasFactory;
    protected $table = 'log_status_inventaris';
    protected $fillable = [
        'inventaris_id',
        'user_id',
        'status_sebelum',
        'status_sesudah',
        'alasan',
        'file_pendukung_path'
    ];
}