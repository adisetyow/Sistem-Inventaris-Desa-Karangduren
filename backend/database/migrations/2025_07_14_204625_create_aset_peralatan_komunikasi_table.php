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
        Schema::create('aset_peralatan_komunikasi', function (Blueprint $table) {
            $table->id('inventaris_id');
            $table->string('merk')->nullable();
            $table->string('frekuensi')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('jenis_peralatan')->nullable();
            $table->integer('tahun_perolehan')->nullable();
            $table->foreign('inventaris_id')->references('id')->on('inventaris')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aset_peralatan_komunikasi');
    }
};
