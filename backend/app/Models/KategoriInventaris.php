<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class KategoriInventaris extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'kategori_inventaris';
    protected $fillable = ['nama_kategori', 'deskripsi', 'icon'];
    protected $dates = ['created_at', 'updated_at'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Kategori '{$this->nama_kategori}' telah di-{$eventName}");
    }

    public function inventaris()
    {
        return $this->hasMany(Inventaris::class, 'kategori_id');
    }
}