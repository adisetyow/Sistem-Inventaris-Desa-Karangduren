<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penghapusan_inventaris', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inventaris_id_lama')->nullable();
            $table->string('kode_inventaris');
            $table->string('nama_barang');
            // $table->foreignId('inventaris_id')->constrained('inventaris')->onDelete('cascade');

            $table->date('tanggal_penghapusan');
            $table->text('alasan_penghapusan');
            $table->string('nomor_berita_acara')->unique();
            $table->string('file_berita_acara');
            $table->foreignId('dihapus_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penghapusan_inventaris');
    }
};
