import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyResetCode } from "../../services/user.service";

function VerifyCode() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const verifyCodeMutation = useMutation({
    mutationFn: async () => {
      const code = digits.join("");
      await verifyResetCode({
        email,
        code: parseInt(code),
      });
    },
    onSuccess: () => {
      navigate("/reset-password", { state: { email } });
    },
    onError: () => {
      setError("Código inválido o expirado.");
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // solo un dígito numérico

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = inputsRef.current[index - 1];
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Completa los 6 dígitos.");
      return;
    }
    setError("");
    verifyCodeMutation.mutate();
  };

  // Autofocus primer input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

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
        <h2 className="text-xl font-bold text-center mb-4">Verificar Código</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el!;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center border border-gray-300 rounded text-lg font-mono focus:ring-2 focus:ring-indigo-600"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifyCodeMutation.isPending}
            className="w-full text-white py-2 rounded select-none cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30"
          >
            {verifyCodeMutation.isPending ? "Verificando..." : "Verificar"}
          </button>
        </form>
        {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
      </div>
    </section>
  );
}

export default VerifyCode;
