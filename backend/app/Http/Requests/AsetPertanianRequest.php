<?php

namespace App\Http\Requests;

class AsetPertanianRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'jenis_alat' => 'nullable|string|max:255',
            'merk' => 'nullable|string|max:255',
            'tahun_perolehan' => 'nullable|integer|min:1900|max:' . date('Y'),
            'lokasi_penyimpanan' => 'nullable|string|max:255',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'jenis_alat.max' => 'Jenis alat maksimal 255 karakter',
            'merk.max' => 'Merk maksimal 255 karakter',
            'tahun_perolehan.integer' => 'Tahun perolehan harus berupa angka',
            'tahun_perolehan.min' => 'Tahun perolehan tidak valid',
            'tahun_perolehan.max' => 'Tahun perolehan tidak boleh lebih dari tahun sekarang',
            'lokasi_penyimpanan.max' => 'Lokasi penyimpanan maksimal 255 karakter',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'jenis_alat' => 'jenis alat',
            'merk' => 'merk',
            'tahun_perolehan' => 'tahun perolehan',
            'lokasi_penyimpanan' => 'lokasi penyimpanan',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}