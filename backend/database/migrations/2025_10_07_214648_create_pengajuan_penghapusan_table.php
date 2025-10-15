<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pengajuan_penghapusan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventaris_id')->constrained('inventaris')->onDelete('cascade');
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('superadmin_id')->nullable()->constrained('users')->onDelete('set null');

            $table->text('alasan_penghapusan');
            $table->string('berita_acara_path');
            $table->enum('status_pengajuan', ['menunggu', 'disetujui', 'ditolak'])->default('menunggu');
            $table->text('catatan_penolakan')->nullable();

            $table->timestamp('tanggal_diproses')->nullable();
            $table->timestamps(); // created_at (sebagai tanggal pengajuan) dan updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_penghapusan');
    }
};