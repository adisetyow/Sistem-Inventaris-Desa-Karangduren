// src/pages/Users/UserManagement.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setUsers(data.data.data); // Sesuaikan dengan struktur API Anda
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = (userId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      return;
    }

    axiosClient
      .delete(`/users/${userId}`)
      .then(() => {
        // Jika berhasil, refresh daftar pengguna
        fetchUsers();
        alert("Pengguna berhasil dihapus.");
      })
      .catch((err) => {
        console.error(err);
        alert("Gagal menghapus pengguna.");
      });
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
        <h2>Manajemen Pengguna</h2>
        <Link to="/users/tambah">Tambah Pengguna</Link>
      </div>
      {loading ? (
        <p>Memuat data pengguna...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {/* Mengambil nama role dari array roles */}
                <td>{user.roles.length > 0 ? user.roles[0].name : "N/A"}</td>
                <td>
                  <Link to={`/users/edit/${user.id}`}>Edit</Link>
                  &nbsp;
                  <button onClick={() => handleDelete(user.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
