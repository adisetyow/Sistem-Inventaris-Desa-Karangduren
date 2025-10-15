<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth; // Pastikan Facade ini di-import

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna.
     */
    public function index(): JsonResponse
    {
        // Ambil semua user beserta roles mereka
        $users = User::with('roles')->latest()->paginate(10);
        return response()->json(['status' => 'success', 'data' => $users]);
    }

    /**
     * Menyimpan pengguna baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['super-admin', 'admin', 'viewer'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengguna berhasil dibuat.',
            'data' => $user
        ], 201); // 201 Created
    }

    /**
     * Menampilkan detail satu pengguna.
     */
    public function show(User $user): JsonResponse
    {
        $user->load('roles'); // Memuat relasi roles
        return response()->json(['status' => 'success', 'data' => $user]);
    }

    /**
     * Memperbarui data pengguna.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['super-admin', 'admin', 'viewer'])],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // GANTI auth()->id() MENJADI Auth::id()
        if ($user->hasRole('super-admin') && $user->id === Auth::id() && $validated['role'] !== 'super-admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak dapat menurunkan role Anda sendiri sebagai super-admin.',
            ], 403);
        }
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $user->update([
                'password' => Hash::make($validated['password'])
            ]);
        }

        // GANTI auth()->id() MENJADI Auth::id()
        if (!$user->hasRole('super-admin') || $user->id !== Auth::id()) {
            $user->syncRoles([$validated['role']]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pengguna berhasil diperbarui.',
            'data' => $user->load('roles')
        ]);
    }

    /**
     * Menghapus pengguna.
     */
    public function destroy(User $user): JsonResponse
    {
        // Tambahkan proteksi agar super-admin tidak bisa menghapus dirinya sendiri
        // GANTI auth()->id() MENJADI Auth::id()
        if ($user->id === Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengguna berhasil dihapus.'
        ], 200);
    }

    /**
     * Mereset password pengguna.
     */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Password untuk pengguna {$user->name} berhasil direset."
        ]);
    }
}
