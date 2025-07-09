import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../services/user.service";
import { Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      await resetPassword({
        email,
        newPassword,
      });
    },
    onSuccess: () => {
      alert("Contraseña restablecida correctamente.");
      navigate("/login");
    },
    onError: () => {
      setError("Error al restablecer la contraseña.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    resetPasswordMutation.mutate();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#05222d] px-4 py-10 relative">
      {/* Fondo animado */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      </div>

      {/* Formulario */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-center mb-4">Nueva Contraseña</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo de nueva contraseña */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border px-4 py-2 rounded pr-10"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Campo de confirmar contraseña */}
          <div className="relative mb-4">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border px-4 py-2 rounded pr-10"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full text-white py-2 rounded select-none cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30"
          >
            {resetPasswordMutation.isPending ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>
        {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
      </div>
    </section>
  );
}

export default ResetPassword;
