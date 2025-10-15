<?php

namespace App\Http\Requests;

class AsetBangunanRequest extends BaseInventarisRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = parent::rules();

        $specificRules = [
            'nama_bangunan' => 'nullable|string|max:255',
            'alamat' => 'nullable|string|max:255',
            'luas' => 'nullable|numeric|min:0',
            'tahun_bangun' => 'nullable|integer|min:1900|max:' . date('Y'),
            'status_sertifikat' => 'nullable|string|max:255',
            'nomor_sertifikat' => 'nullable|string|max:255',
            'kondisi_fisik' => 'nullable|string|max:255',
        ];

        return array_merge($rules, $specificRules);
    }

    public function messages(): array
    {
        $messages = parent::messages();

        $specificMessages = [
            'nama_bangunan.max' => 'Nama bangunan maksimal 255 karakter',
            'alamat.max' => 'Alamat maksimal 255 karakter',
            'luas.numeric' => 'Luas harus berupa angka',
            'luas.min' => 'Luas tidak boleh negatif',
            'tahun_bangun.integer' => 'Tahun bangun harus berupa angka',
            'tahun_bangun.min' => 'Tahun bangun tidak valid',
            'tahun_bangun.max' => 'Tahun bangun tidak boleh lebih dari tahun sekarang',
            'status_sertifikat.max' => 'Status sertifikat maksimal 255 karakter',
            'nomor_sertifikat.max' => 'Nomor sertifikat maksimal 255 karakter',
            'kondisi_fisik.max' => 'Kondisi fisik maksimal 255 karakter',
        ];

        return array_merge($messages, $specificMessages);
    }

    public function attributes(): array
    {
        $attributes = parent::attributes();

        $specificAttributes = [
            'nama_bangunan' => 'nama bangunan',
            'alamat' => 'alamat',
            'luas' => 'luas',
            'tahun_bangun' => 'tahun bangun',
            'status_sertifikat' => 'status sertifikat',
            'nomor_sertifikat' => 'nomor sertifikat',
            'kondisi_fisik' => 'kondisi fisik',
        ];

        return array_merge($attributes, $specificAttributes);
    }
}