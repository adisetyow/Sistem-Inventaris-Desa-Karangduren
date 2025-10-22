<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Laporan Inventaris Desa Karangduren</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            margin: 25px;
            font-size: 10px;
        }

        header {
            position: fixed;
            top: -60px;
            left: 0;
            right: 0;
            height: 80px;
        }

        @page {
            margin: 100px 40px 80px 40px;
        }

        /* --- Kop Surat --- */
        @font-face {
            font-family: 'Bookman Old Style';
            src: url('{{ public_path("fonts/bookman-old-style.ttf") }}');
        }

        .kop-surat-table {
            width: 100%;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }

        .logo {
            width: 80px;
        }

        .kop-surat-text {
            text-align: center;
            line-height: 1.2;
        }

        .kop-surat-text .pemkab {
            font-family: 'Bookman Old Style', 'Times New Roman', serif;
            font-size: 14pt;
            font-weight: bold;
        }

        .kop-surat-text .kecamatan {
            font-family: 'Bookman Old Style', 'Times New Roman', serif;
            font-size: 16pt;
            font-weight: bold;
        }

        .kop-surat-text .desa {
            font-family: 'Bookman Old Style', 'Times New Roman', serif;
            font-size: 18pt;
            font-weight: bold;
        }

        .kop-surat-text .alamat {
            font-family: 'Bookman Old Style', 'Times New Roman', serif;
            font-size: 8pt;
            font-weight: bold;
        }

        /* --- Judul Laporan --- */
        .report-title {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .report-title h2 {
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .report-title p {
            margin: 2px 0 0;
            font-size: 11px;
            text-transform: uppercase;
        }

        /* --- Tabel --- */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
            font-size: 9px;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }

        .text-center {
            text-align: center;
        }

        .text-end {
            text-align: right;
        }

        /* --- Footer & Signature --- */
        footer {
            position: fixed;
            bottom: -40px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #555;
        }

        .signature-section {
            margin-top: 40px;
            width: 100%;
        }

        .signature-box {
            width: 30%;
            float: right;
            text-align: center;
            font-size: 11px;
        }

        .signature-space {
            height: 60px;
        }

        .text-end {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }
    </style>
</head>

<body>
    @include('pdf.header')

    {{-- === JUDUL LAPORAN === --}}
    <div class="report-title">
        <h2>Laporan Data Inventaris Aset</h2>
        {{-- Logika filter Anda di sini sudah benar --}}
    </div>

{{-- === TABEL DATA === --}}
<table>
    <thead>
        <tr>
            <th style="width: 5%;">No</th>
            @foreach ($kolom as $key)
                @switch($key)
                    @case('kode_inventaris')
                        <th>Kode</th>
                        @break
                    @case('nama_barang')
                        <th>Nama Barang</th>
                        @break
                    @case('kategori')
                        <th>Kategori</th>
                        @break
                    @case('jumlah')
                        <th class="text-center">Jumlah</th>
                        @break
                    @case('kondisi')
                        <th>Kondisi</th>
                        @break
                    @case('status')
                        <th>Status</th>
                        @break
                    @case('lokasi_penempatan')
                        <th>Lokasi</th>
                        @break
                    @case('tanggal_masuk')
                        <th class="text-center">Tgl Masuk</th>
                        @break
                    @case('sumber_dana')
                        <th>Sumber Dana</th>
                        @break
                    @case('harga_perolehan')
                        <th class="text-end">Harga Satuan</th>
                        @break
                    @case('total_harga')
                    @case('total_nilai')
                        <th class="text-end">Total Nilai</th>
                        @break
                @endswitch
            @endforeach
        </tr>
    </thead>
    <tbody>
        @forelse ($inventaris as $item)
            <tr>
                <td class="text-center">{{ $loop->iteration }}</td>

                @foreach ($kolom as $key)
                    @switch($key)
                        @case('kode_inventaris')
                            <td>{{ $item->kode_inventaris }}</td>
                            @break

                        @case('nama_barang')
                            <td>{{ $item->nama_barang }}</td>
                            @break

                        @case('kategori')
                            <td>{{ $item->kategori->nama_kategori ?? '-' }}</td>
                            @break

                        @case('jumlah')
                            <td class="text-center">{{ $item->jumlah }}</td>
                            @break

                        @case('kondisi')
                            <td>{{ $item->kondisi }}</td>
                            @break

                        @case('status')
                            <td>{{ ucfirst($item->status) }}</td>
                            @break

                        @case('lokasi_penempatan')
                            <td>{{ $item->lokasi_penempatan }}</td>
                            @break

                        @case('tanggal_masuk')
                            <td class="text-center">
                                {{ \Carbon\Carbon::parse($item->tanggal_masuk)->format('d-m-Y') }}
                            </td>
                            @break

                        @case('sumber_dana')
                            <td>{{ $item->sumber_dana }}</td>
                            @break

                        @case('harga_perolehan')
                            <td class="text-end">
                                Rp {{ number_format($item->harga_perolehan, 0, ',', '.') }}
                            </td>
                            @break

                        @case('total_harga')
                        @case('total_nilai')
                            <td class="text-end">
                                Rp {{ number_format($item->total_nilai, 0, ',', '.') }}
                            </td>
                            @break
                    @endswitch
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ count($kolom) + 1 }}" class="text-center">
                    Tidak ada data untuk ditampilkan.
                </td>
            </tr>
        @endforelse
    </tbody>
    <tfoot>
        <tr>
            <th colspan="{{ count($kolom) }}" class="text-end">Total Keseluruhan Nilai Aset:</th>
            <th class="text-end">Rp {{ number_format($totalNilaiAset, 0, ',', '.') }}</th>
        </tr>
    </tfoot>
</table>


    {{-- === TANDA TANGAN === --}}
    <div class="signature-section">
        <div class="signature-box">
            {{-- Variabel diubah menjadi $date agar cocok dengan controller --}}
            <div>Karangduren, {{ $date->translatedFormat('d F Y') }}</div>
            <div>Petugas Pencatatan</div>
            <div class="signature-space"></div>
            <div>(___________________)</div>
        </div>
    </div>

    <footer>
        Dicetak pada: {{ $tanggalCetak }}
    </footer>

</body>

</html>