// file: src/pages/Inventaris/InventarisAktif.jsx
import InventarisLayout from "./InventarisLayout";

export default function InventarisAktif() {
  return (
    <InventarisLayout
      pageTitle="Data Inventaris Aktif"
      apiEndpoint="/inventaris"
      statusFilter="aktif"
      description="Daftar aset desa yang masih aktif dan digunakan dalam operasional."
    />
  );
}
