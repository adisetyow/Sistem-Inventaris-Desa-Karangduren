<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BaseInventarisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isCreating = $this->isMethod('POST');
        // Mendapatkan ID inventaris untuk pengecualian validasi unique (jika ada)
        $inventarisId = $this->route('inventaris') ? $this->route('inventaris')->id : null;

        return [
            'kategori_id' => 'required|exists:kategori_inventaris,id',
            'nama_barang' => 'required|string|max:255',
            'kode_inventaris' => [
                Rule::requiredIf(!$isCreating),
                'string',
                'max:255',
                // Aturan unique tetap sama
                Rule::unique('inventaris', 'kode_inventaris')->ignore($this->inventaris)->whereNull('deleted_at'),
            ],
            'jumlah' => 'required|integer|min:1',
            'kondisi' => 'required|in:Baik,Rusak Ringan,Rusak Berat',
            'lokasi_penempatan' => 'required|string|max:255',
            'tanggal_masuk' => 'required|date',
            'sumber_dana' => 'required|string|max:255',
            'harga_perolehan' => 'required|numeric|min:0',
            'catatan' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'kategori_id.required' => 'Kategori harus dipilih',
            'kategori_id.exists' => 'Kategori yang dipilih tidak valid',

            'nama_barang.required' => 'Nama barang wajib diisi',
            'nama_barang.max' => 'Nama barang tidak boleh lebih dari 255 karakter',

            'kode_inventaris.required' => 'Kode inventaris wajib diisi',
            'kode_inventaris.max' => 'Kode inventaris tidak boleh lebih dari 255 karakter',
            'kode_inventaris.unique' => 'Kode inventaris sudah digunakan',

            'jumlah.required' => 'Jumlah wajib diisi',
            'jumlah.integer' => 'Jumlah harus berupa angka',
            'jumlah.min' => 'Jumlah tidak boleh kurang dari 1',

            'kondisi.required' => 'Kondisi wajib diisi',
            'kondisi.in' => 'Kondisi tidak valid',

            'lokasi_penempatan.required' => 'Lokasi penempatan wajib diisi',
            'lokasi_penempatan.max' => 'Lokasi penempatan tidak boleh lebih dari 255 karakter',

            'tanggal_masuk.required' => 'Tanggal masuk wajib diisi',
            'tanggal_masuk.date' => 'Format tanggal tidak valid',

            'sumber_dana.required' => 'Sumber dana wajib diisi',
            'sumber_dana.max' => 'Sumber dana tidak boleh lebih dari 255 karakter',

            'harga_perolehan.required' => 'Harga perolehan wajib diisi',
            'harga_perolehan.numeric' => 'Harga perolehan harus berupa angka',
            'harga_perolehan.min' => 'Harga perolehan tidak boleh kurang dari 0',


        ];
    }

    public function attributes(): array
    {
        return [
            'kategori_id' => 'kategori',
            'nama_barang' => 'nama barang',
            'kode_inventaris' => 'kode inventaris',
            'lokasi_penempatan' => 'lokasi penempatan',
            'tanggal_masuk' => 'tanggal masuk',
            'sumber_dana' => 'sumber dana',
            'harga_perolehan' => 'harga perolehan',
        ];
    }
}