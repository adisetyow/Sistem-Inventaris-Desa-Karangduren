<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventarisController;
use App\Http\Controllers\KategoriInventarisController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PenghapusanController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\LogAktivitasController;


// Rute Publik (Tidak perlu login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Rute Terproteksi (Wajib login/autentikasi)
Route::middleware('auth:sanctum')->group(function () {


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Endpoint untuk User yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Genrate Kode Inventaris
    Route::get('/inventaris/generate-kode/{kategori}', [InventarisController::class, 'generateKode']);

    // Kategori
    Route::get('/kategori-inventaris', [KategoriInventarisController::class, 'index']);
    Route::apiResource('kategori', KategoriInventarisController::class);
    Route::get('/get-kategori-detail/{id}', [InventarisController::class, 'getKategoriDetail']);

    // CRUD Inventaris
    // Rute 'show' (untuk edit) agar bisa mengambil data terarsip
    Route::get('/inventaris/riwayat-penghapusan', [InventarisController::class, 'riwayatPenghapusan']);

    Route::get('inventaris/{inventaris}', [InventarisController::class, 'show'])->withTrashed();

    // Rute 'update' agar bisa memperbarui data terarsip
    Route::put('inventaris/{inventaris}', [InventarisController::class, 'update'])->withTrashed();

    // Sisa rute resource (index, store, destroy)
    Route::apiResource('inventaris', InventarisController::class)->except(['show', 'update']);

    // Rute untuk item yang diarsipkan (trashed)
    Route::get('/inventaris-trashed', [InventarisController::class, 'trashed']);
    Route::post('/inventaris-restore/{id}', [InventarisController::class, 'restore']);


    Route::get('/download', [FileController::class, 'downloadBukti']);

    // Route::post('/inventaris/{inventaris}/set-tidak-aktif', [InventarisController::class, 'setTidakAktif'])->middleware('role:admin|super-admin');

    // Admin & Superadmin bisa mengaktifkan kembali
    // Route::post('/inventaris/{inventaris}/set-aktif', [InventarisController::class, 'setAktif'])->middleware('role:admin|super-admin');

    Route::middleware(['role:admin|super-admin'])->group(function () {
        // Aksi Status
        Route::post('/inventaris/{inventaris}/set-tidak-aktif', [InventarisController::class, 'setTidakAktif']);
        Route::post('/inventaris/{inventaris}/set-aktif', [InventarisController::class, 'setAktif']);

        Route::post('/penghapusan/ajukan', [PenghapusanController::class, 'ajukan']);

        // Rute untuk log aktivitas
        Route::get('/log-aktivitas', [LogAktivitasController::class, 'index']);
    });


    Route::middleware(['role:super-admin'])->group(function () {
        Route::apiResource('users', UserController::class);
        Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword']);

        // Rute untuk penghapusan
        Route::get('/penghapusan/menunggu', [PenghapusanController::class, 'daftarPengajuan']);
        Route::post('/penghapusan/{pengajuan}/setujui', [PenghapusanController::class, 'setujui']);
        Route::post('/penghapusan/{pengajuan}/tolak', [PenghapusanController::class, 'tolak']);
        Route::get('/penghapusan/menunggu/count', [PenghapusanController::class, 'countPengajuan']);
    });
});