// file: src/pages/Inventaris/InventarisTidakAktif.jsx
import InventarisLayout from "./InventarisLayout";

export default function InventarisTidakAktif() {
  return (
    <InventarisLayout
      pageTitle="Data Inventaris Tidak Aktif"
      apiEndpoint="/inventaris"
      statusFilter="tidak_aktif"
      description="Daftar aset desa yang sudah tidak aktif digunakan."
    />
  );
}
