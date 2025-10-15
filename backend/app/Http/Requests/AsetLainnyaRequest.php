<?php

namespace App\Http\Requests;

class AsetLainnyaRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'nama_aset' => 'nullable|string|max:255',
            'merk' => 'nullable|string|max:255',
            'tahun_perolehan' => 'nullable|integer|min:1900|max:' . date('Y'),
            'deskripsi' => 'nullable|string',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'nama_aset.max' => 'Nama aset maksimal 255 karakter',
            'merk.max' => 'Merk maksimal 255 karakter',
            'tahun_perolehan.integer' => 'Tahun perolehan harus berupa angka',
            'tahun_perolehan.min' => 'Tahun perolehan tidak valid',
            'tahun_perolehan.max' => 'Tahun perolehan tidak boleh lebih dari tahun sekarang',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'nama_aset' => 'nama aset',
            'merk' => 'merk',
            'tahun_perolehan' => 'tahun perolehan',
            'deskripsi' => 'deskripsi',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}