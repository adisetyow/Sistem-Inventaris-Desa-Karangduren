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
        Schema::create('aset_pertanian', function (Blueprint $table) {
            $table->id('inventaris_id');
            $table->string('jenis_alat')->nullable();
            $table->string('merk')->nullable();
            $table->integer('tahun_perolehan')->nullable();
            $table->string('lokasi_penyimpanan')->nullable();
            $table->foreign('inventaris_id')->references('id')->on('inventaris')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aset_pertanian');
    }
};
