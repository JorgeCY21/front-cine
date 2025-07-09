import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createResetPassword } from "../../services/user.service";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const requestResetCode = useMutation({
    mutationFn: async (emailToSend: string) => {
      await createResetPassword({ email: emailToSend });
    },
    onSuccess: () => {
      setMessage("Código enviado al correo. Verifica tu bandeja.");
      setTimeout(() => {
        navigate("/", { state: { email } });
      }, 1500);
    },
    onError: () => {
      setMessage("Correo no encontrado.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    requestResetCode.mutate(email);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#05222d] px-4 py-10">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-center mb-4">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded mb-4"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={requestResetCode.isPending}
            className="w-full text-white py-2 rounded select-none cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30"
          >
            {requestResetCode.isPending ? "Enviando..." : "Enviar código"}
          </button>
        </form>
        {message && <p className="text-sm text-center mt-4">{message}</p>}
      </div>
    </section>
  );
}

export default ForgotPassword;
