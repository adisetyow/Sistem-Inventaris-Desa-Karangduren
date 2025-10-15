<?php

namespace App\Http\Requests;

class AsetTanahRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'luas' => 'nullable|numeric|min:0',
            'alamat' => 'nullable|string|max:255',
            'nomor_sertifikat' => 'nullable|string|max:255',
            'status_sertifikat' => 'nullable|string|max:255',
            'tahun_diperoleh' => 'nullable|integer|min:1900|max:' . date('Y'),
            'penggunaan_saat_ini' => 'nullable|string|max:255',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'luas.numeric' => 'Luas harus berupa angka',
            'luas.min' => 'Luas tidak boleh negatif',
            'alamat.max' => 'Alamat maksimal 255 karakter',
            'nomor_sertifikat.max' => 'Nomor sertifikat maksimal 255 karakter',
            'status_sertifikat.max' => 'Status sertifikat maksimal 255 karakter',
            'tahun_diperoleh.integer' => 'Tahun diperoleh harus berupa angka',
            'tahun_diperoleh.min' => 'Tahun diperoleh tidak valid',
            'tahun_diperoleh.max' => 'Tahun diperoleh tidak boleh lebih dari tahun sekarang',
            'penggunaan_saat_ini.max' => 'Penggunaan saat ini maksimal 255 karakter',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'luas' => 'luas',
            'alamat' => 'alamat',
            'nomor_sertifikat' => 'nomor sertifikat',
            'status_sertifikat' => 'status sertifikat',
            'tahun_diperoleh' => 'tahun diperoleh',
            'penggunaan_saat_ini' => 'penggunaan saat ini',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}