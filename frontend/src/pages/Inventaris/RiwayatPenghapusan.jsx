// file: src/pages/Inventaris/RiwayatPenghapusan.jsx
import InventarisLayout from "./InventarisLayout";

export default function RiwayatPenghapusan() {
  return (
    <InventarisLayout
      pageTitle="Riwayat Penghapusan Aset"
      apiEndpoint="/inventaris/riwayat-penghapusan"
      isHistoryPage={true}
    />
  );
}
