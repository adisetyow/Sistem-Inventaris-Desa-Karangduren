<?php

namespace App\Http\Requests;

class AsetInfrastrukturRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'jenis_infrastruktur' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'panjang' => 'nullable|numeric|min:0',
            'lebar' => 'nullable|numeric|min:0',
            'tahun_bangun' => 'nullable|integer|min:1900|max:' . date('Y'),
            'status_kepemilikan' => 'nullable|string|max:255',
            'kondisi_fisik' => 'nullable|string|max:255',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'jenis_infrastruktur.max' => 'Jenis infrastruktur maksimal 255 karakter',
            'lokasi.max' => 'Lokasi maksimal 255 karakter',
            'panjang.numeric' => 'Panjang harus berupa angka',
            'panjang.min' => 'Panjang tidak boleh negatif',
            'lebar.numeric' => 'Lebar harus berupa angka',
            'lebar.min' => 'Lebar tidak boleh negatif',
            'tahun_bangun.integer' => 'Tahun bangun harus berupa angka',
            'tahun_bangun.min' => 'Tahun bangun tidak valid',
            'tahun_bangun.max' => 'Tahun bangun tidak boleh lebih dari tahun sekarang',
            'status_kepemilikan.max' => 'Status kepemilikan maksimal 255 karakter',
            'kondisi_fisik.max' => 'Kondisi fisik maksimal 255 karakter',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'jenis_infrastruktur' => 'jenis infrastruktur',
            'lokasi' => 'lokasi',
            'panjang' => 'panjang',
            'lebar' => 'lebar',
            'tahun_bangun' => 'tahun bangun',
            'status_kepemilikan' => 'status kepemilikan',
            'kondisi_fisik' => 'kondisi fisik',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}