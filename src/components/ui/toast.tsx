import { Toaster } from "react-hot-toast";

export function ToastComponent() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        // Estilos base
        duration: 3000,
        style: {
          background: "#ffffff", // blanco puro
          color: "#111111", // texto oscuro
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb", // gris claro (Tailwind gray-200)
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        },

        // Animación por defecto
        className:
          "transition-all duration-300 ease-in-out transform",

        // Success
        success: {
          style: {
            border: "1px solid #22c55e", // verde (Tailwind green-500)
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
        },

        // Error
        error: {
          duration: 4000,
          style: {
            border: "1px solid #ef4444", // rojo (Tailwind red-500)
            color: "#ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },

        // Loading
        loading: {
          style: {
            border: "1px solid #e5e7eb",
          },
          iconTheme: {
            primary: "#9ca3af", // gris Tailwind gray-400
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
