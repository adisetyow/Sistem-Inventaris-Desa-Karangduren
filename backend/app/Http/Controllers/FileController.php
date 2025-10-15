<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function downloadBukti(Request $request)
    {
        // 1. Validasi input: pastikan 'path' ada di request
        $validated = $request->validate([
            'path' => 'required|string',
        ]);

        $filePath = $validated['path'];

        // 2. Keamanan: Pastikan path hanya mengakses folder yang diizinkan
        //    dan tidak bisa keluar dari folder storage (mencegah ../../.env)
        if (!Str::startsWith($filePath, ['file_pendukung_status/', 'berita_acara/'])) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        // 3. Cek apakah file ada di storage 'public'
        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json(['message' => 'File tidak ditemukan.'], 404);
        }

        // 4. Download file
        return response()->download(storage_path('app/public/' . $filePath));
    }
}