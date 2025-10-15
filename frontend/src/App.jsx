import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000, // Notifikasi hilang setelah 4 detik
          success: {
            style: {
              background: "#ECFDF5", // bg-emerald-50
              color: "#065F46", // text-emerald-800
              border: "1px solid #A7F3D0", // border-emerald-200
            },
            iconTheme: {
              primary: "#10B981", // text-emerald-500
              secondary: "white",
            },
          },
          error: {
            style: {
              background: "#FEF2F2", // bg-red-50
              color: "#991B1B", // text-red-800
              border: "1px solid #FECACA", // border-red-200
            },
            iconTheme: {
              primary: "#EF4444", // text-red-500
              secondary: "white",
            },
          },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
