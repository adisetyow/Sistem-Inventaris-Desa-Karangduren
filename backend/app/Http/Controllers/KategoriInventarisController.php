<?php

namespace App\Http\Controllers;

use App\Models\KategoriInventaris;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class KategoriInventarisController extends Controller
{

    /**
     * Menampilkan daftar semua kategori inventaris dengan paginasi.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Cek apakah ada parameter ?paginate=false di URL
            if ($request->input('paginate') === 'false') {
                // Jika ada, kembalikan semua data tanpa paginasi
                $kategoris = KategoriInventaris::orderBy('nama_kategori', 'asc')->get();
            } else {
                // Jika tidak, tetap gunakan paginasi seperti semula
                $kategoris = KategoriInventaris::orderBy('nama_kategori', 'asc')->paginate(10);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Data kategori inventaris berhasil diambil.',
                'data' => $kategoris
            ], 200);

        } catch (Exception $e) {
            Log::error('Error fetching kategori inventaris: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data kategori inventaris.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan data untuk form edit kategori inventaris.
     */
    public function edit(KategoriInventaris $kategori): JsonResponse
    {
        try {
            return response()->json([
                'status' => 'success',
                'message' => 'Data kategori untuk edit berhasil diambil.',
                'data' => $kategori
            ], 200);
        } catch (Exception $e) {
            Log::error('Error preparing edit form for kategori: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mempersiapkan form edit kategori.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Memperbarui deskripsi kategori inventaris.
     */
    public function update(Request $request, KategoriInventaris $kategori): JsonResponse
    {
        // Validasi hanya untuk deskripsi
        $request->validate([
            'deskripsi' => 'nullable|string|max:1000'
        ]);

        try {
            DB::beginTransaction();

            // Simpan deskripsi lama untuk log
            $deskripsiLama = $kategori->deskripsi;

            // Update hanya field deskripsi
            $kategori->deskripsi = $request->deskripsi;
            $kategori->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Deskripsi kategori berhasil diperbarui.',
                'data' => $kategori
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error updating kategori inventaris: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
}