<?php

namespace App\Http\Requests;

class AsetKesehatanPosyanduRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'nama_alat' => 'nullable|string|max:255',
            'merk' => 'nullable|string|max:255',
            'tahun_perolehan' => 'nullable|integer|min:1900|max:' . date('Y'),
            'jumlah' => 'nullable|integer|min:1',
            'lokasi_penempatan' => 'nullable|string|max:255',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'nama_alat.max' => 'Nama alat maksimal 255 karakter',
            'merk.max' => 'Merk maksimal 255 karakter',
            'tahun_perolehan.integer' => 'Tahun perolehan harus berupa angka',
            'tahun_perolehan.min' => 'Tahun perolehan tidak valid',
            'tahun_perolehan.max' => 'Tahun perolehan tidak boleh lebih dari tahun sekarang',
            'jumlah.integer' => 'Jumlah alat harus berupa angka',
            'jumlah.min' => 'Jumlah alat minimal 1',
            'lokasi_penempatan.max' => 'Lokasi penempatan alat maksimal 255 karakter',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'nama_alat' => 'nama alat',
            'merk' => 'merk',
            'tahun_perolehan' => 'tahun perolehan',
            'jumlah' => 'jumlah',
            'lokasi_penempatan' => 'lokasi penempatan',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}