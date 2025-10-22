{{-- resources/views/pdf/header.blade.php --}}
<table class="kop-surat-table">
    <tr>
        <td style="width: 15%; text-align: center;">
            @php
                // Menggunakan logo Base64 agar pasti muncul di PDF DomPDF
                $logoPath = public_path('img/logo.JPG');
                if (file_exists($logoPath)) {
                    $logoType = pathinfo($logoPath, PATHINFO_EXTENSION);
                    $logoData = file_get_contents($logoPath);
                    $logoBase64 = 'data:image/' . $logoType . ';base64,' . base64_encode($logoData);
                } else {
                    $logoBase64 = '';
                }
            @endphp

            @if ($logoBase64)
                <img src="{{ $logoBase64 }}" alt="Logo Desa" class="logo">
            @else
                <div style="font-size: 8px; color: red;">Logo tidak ditemukan</div>
            @endif
        </td>

        <td style="width: 85%; text-align: center;" class="kop-surat-text">
            <div class="pemkab">PEMERINTAH KABUPATEN SEMARANG</div>
            <div class="kecamatan">KECAMATAN TENGARAN</div>
            <div class="desa">DESA KARANGDUREN</div>
            <div class="alamat">Alamat : Jln Gemah Ripah 48 Karangduren 50775</div>
        </td>
    </tr>
</table>

<style>
    .kop-surat-table {
        width: 100%;
        border-collapse: collapse;
        border: none;
        border-bottom: 3px double #000;
        padding-bottom: 10px;
    }

    .kop-surat-table td {
        border: none;
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
</style>