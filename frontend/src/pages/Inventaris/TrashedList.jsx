// src/pages/Inventaris/TrashedList.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";

export default function TrashedList() {
  const [trashedItems, setTrashedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrashedItems();
  }, []);

  const fetchTrashedItems = () => {
    setLoading(true);
    axiosClient
      .get("/inventaris-trashed")
      .then(({ data }) => {
        // Sesuaikan dengan struktur respons API Anda
        setTrashedItems(data.data.inventaris.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data arsip:", err);
        setLoading(false);
      });
  };

  const handleRestore = (itemId) => {
    if (!window.confirm("Apakah Anda yakin ingin memulihkan item ini?")) {
      return;
    }

    axiosClient
      .post(`/inventaris-restore/${itemId}`)
      .then(() => {
        alert("Item berhasil dipulihkan.");
        fetchTrashedItems(); // Refresh daftar
      })
      .catch((err) => {
        console.error(err);
        alert("Gagal memulihkan item.");
      });
  };

  // Fungsi untuk Hapus Permanen (bisa ditambahkan nanti)
  const handleForceDelete = (itemId) => {
    if (
      !window.confirm(
        "PERINGATAN: Aksi ini tidak dapat dibatalkan. Hapus permanen item ini?"
      )
    ) {
      return;
    }
    // axiosClient.delete(`/inventaris-force-delete/${itemId}`).then(...)
    alert("Fungsi hapus permanen belum diimplementasikan.");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Inventaris Diarsipkan</h2>
        <Link to="/inventaris">Kembali ke Daftar Inventaris</Link>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Kode Inventaris</th>
              <th>Tanggal Dihapus</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {trashedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.nama_barang}</td>
                <td>{item.kode_inventaris}</td>
                <td>{new Date(item.deleted_at).toLocaleDateString("id-ID")}</td>
                <td>
                  <button onClick={() => handleRestore(item.id)}>
                    Pulihkan
                  </button>
                  &nbsp;
                  <button
                    onClick={() => handleForceDelete(item.id)}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Hapus Permanen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
