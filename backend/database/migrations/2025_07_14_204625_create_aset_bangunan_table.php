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
        Schema::create('aset_bangunan', function (Blueprint $table) {
            $table->id('inventaris_id');
            $table->string('nama_bangunan')->nullable();
            $table->string('alamat')->nullable();
            $table->decimal('luas', 10, 2)->nullable();
            $table->integer('tahun_bangun')->nullable();
            $table->string('status_sertifikat')->nullable();
            $table->string('nomor_sertifikat')->nullable();
            $table->string('kondisi_fisik')->nullable();
            $table->foreign('inventaris_id')->references('id')->on('inventaris')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aset_bangunan');
    }
};
