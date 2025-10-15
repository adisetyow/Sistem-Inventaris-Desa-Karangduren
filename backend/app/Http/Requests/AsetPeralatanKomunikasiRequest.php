<?php

namespace App\Http\Requests;

class AsetPeralatanKomunikasiRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Ambil rules dari parent class (BaseInventarisRequest)
        $rules = parent::rules();

        // Tambahkan rules khusus untuk Peralatan Komunikasi
        $specificRules = [
            'merk' => 'nullable|string|max:255',
            'frekuensi' => 'nullable|string|max:100',
            'serial_number' => 'nullable|string|max:255',
            'jenis_peralatan' => 'nullable|string|max:255',
            'tahun_perolehan' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
        ];

        // Gabungkan rules
        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        // Ambil messages dari parent class
        $messages = parent::messages();

        // Tambahkan messages khusus
        $specificMessages = [
            'merk.max' => 'Merk tidak boleh lebih dari 255 karakter',
            'frekuensi.max' => 'Frekuensi tidak boleh lebih dari 100 karakter',
            'serial_number.max' => 'Serial number tidak boleh lebih dari 255 karakter',
            'jenis_peralatan.max' => 'Jenis peralatan tidak boleh lebih dari 255 karakter',
            'tahun_perolehan.integer' => 'Tahun perolehan harus berupa angka',
            'tahun_perolehan.min' => 'Tahun perolehan tidak boleh kurang dari 1900',
            'tahun_perolehan.max' => 'Tahun perolehan tidak boleh lebih dari tahun depan',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        // Ambil attributes dari parent class
        $attributes = parent::attributes();

        // Tambahkan attributes khusus
        $specificAttributes = [
            'merk' => 'merk',
            'frekuensi' => 'frekuensi',
            'serial_number' => 'serial number',
            'jenis_peralatan' => 'jenis peralatan',
            'tahun_perolehan' => 'tahun perolehan',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}