// src/pages/Users/UserForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function UserForm() {
  const { id } = useParams(); // Mengambil ID dari URL, misal: /users/12
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "admin", // Default role
  });

  // Cek apakah ini mode EDIT (jika ada ID di URL)
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      // Ambil data user yang akan di-edit
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          // Isi form dengan data yang ada, termasuk role-nya
          const userData = data.data;
          setUser({
            ...userData,
            role: userData.roles.length > 0 ? userData.roles[0].name : "admin",
          });
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    let payload;
    let request;
    if (isEditMode) {
      payload = {
        name: user.name,
        email: user.email,
        role: user.role,
      };
      if (user.password) {
        payload.password = user.password;
        payload.password_confirmation = user.password_confirmation;
      }

      request = axiosClient.put(`/users/${id}`, payload);
    } else {
      payload = user;
      request = axiosClient.post("/users", payload);
    }
    request
      .then(() => {
        setLoading(false);
        navigate("/users");
        alert(`Pengguna berhasil ${isEditMode ? "diperbarui" : "dibuat"}!`);
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          // Menampilkan error yang lebih umum jika bukan 422
          alert("Terjadi kesalahan. Cek console untuk detail.");
          console.error("Submit Error:", err);
        }
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>
        {isEditMode ? `Edit Pengguna: ${user.name}` : "Tambah Pengguna Baru"}
      </h2>
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          placeholder="Nama Lengkap"
          required
        />
        {errors?.name && <p style={{ color: "red" }}>{errors.name[0]}</p>}

        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        {errors?.email && <p style={{ color: "red" }}>{errors.email[0]}</p>}

        <input
          type="password"
          name="password"
          onChange={handleInputChange}
          placeholder={
            isEditMode ? "Kosongkan jika tidak ganti password" : "Password"
          }
        />
        {errors?.password && (
          <p style={{ color: "red" }}>{errors.password[0]}</p>
        )}

        <input
          type="password"
          name="password_confirmation"
          onChange={handleInputChange}
          placeholder="Konfirmasi Password"
        />

        <select
          name="role"
          value={user.role}
          onChange={handleInputChange}
          required
        >
          <option value="super-admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        {errors?.role && <p style={{ color: "red" }}>{errors.role[0]}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
