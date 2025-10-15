<?php

namespace App\Http\Requests;

class AsetKendaraanRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'jenis_kendaraan' => 'nullable|string|max:255',
            'merk_tipe' => 'nullable|string|max:255',
            'nomor_polisi' => 'nullable|string|max:255',
            'nomor_rangka' => 'nullable|string|max:255',
            'nomor_mesin' => 'nullable|string|max:255',
            'tahun_perolehan' => 'nullable|integer|min:1900|max:' . date('Y'),
            'warna' => 'nullable|string|max:255',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'jenis_kendaraan.max' => 'Jenis kendaraan maksimal 255 karakter',
            'merk_tipe.max' => 'Merk/tipe maksimal 255 karakter',
            'nomor_polisi.max' => 'Nomor polisi maksimal 255 karakter',
            'nomor_rangka.max' => 'Nomor rangka maksimal 255 karakter',
            'nomor_mesin.max' => 'Nomor mesin maksimal 255 karakter',
            'tahun_perolehan.integer' => 'Tahun perolehan harus berupa angka',
            'tahun_perolehan.min' => 'Tahun perolehan tidak valid',
            'tahun_perolehan.max' => 'Tahun perolehan tidak boleh lebih dari tahun sekarang',
            'warna.max' => 'Warna maksimal 255 karakter',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'jenis_kendaraan' => 'jenis kendaraan',
            'merk_tipe' => 'merk/tipe',
            'nomor_polisi' => 'nomor polisi',
            'nomor_rangka' => 'nomor rangka',
            'nomor_mesin' => 'nomor mesin',
            'tahun_perolehan' => 'tahun perolehan',
            'warna' => 'warna',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}