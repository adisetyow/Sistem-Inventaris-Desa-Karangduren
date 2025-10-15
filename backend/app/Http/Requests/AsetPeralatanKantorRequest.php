<?php

namespace App\Http\Requests;

class AsetPeralatanKantorRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'merk' => 'nullable|string|max:255',
            'bahan' => 'nullable|string|max:255',
            'tahun_perolehan' => 'nullable|integer|min:1900|max:' . date('Y'),
            'warna' => 'nullable|string|max:255',
            'nomor_inventaris_internal' => 'nullable|string|max:255',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'merk.max' => 'Merk maksimal 255 karakter',
            'bahan.max' => 'Bahan maksimal 255 karakter',
            'tahun_perolehan.integer' => 'Tahun perolehan harus berupa angka',
            'tahun_perolehan.min' => 'Tahun perolehan tidak valid',
            'tahun_perolehan.max' => 'Tahun perolehan tidak boleh lebih dari tahun sekarang',
            'warna.max' => 'Warna maksimal 255 karakter',
            'nomor_inventaris_internal.max' => 'Nomor inventaris internal maksimal 255 karakter',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'merk' => 'merk',
            'bahan' => 'bahan',
            'tahun_perolehan' => 'tahun perolehan',
            'warna' => 'warna',
            'nomor_inventaris_internal' => 'nomor inventaris internal',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}