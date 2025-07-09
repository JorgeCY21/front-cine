import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/user.service";
import QRCode from "react-qr-code";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_FRONT_URL || "http://localhost:3000";
  const qrValue = `${apiUrl}/`;

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      setIsLoading(true);
      const user = await login({ email, password });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/movies");
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Correo o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      </div>

      {/* Decoración de rollo de película */}
      <div className="absolute top-0 left-0 w-full h-8 bg-black/50 flex items-center z-10">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-6 h-6 mx-1 bg-gray-700 rounded-sm"></div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-8 bg-black/50 flex items-center z-10">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-6 h-6 mx-1 bg-gray-700 rounded-sm"></div>
        ))}
      </div>

      {/* Tarjeta principal */}
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:shadow-3xl hover:border-indigo-500/30">
        {/* Logo con animación */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              CineMax
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        <p className="text-sm text-center text-gray-300 mb-8 tracking-wider">
          Ingresa tus credenciales para disfrutar de una gran experiencia
        </p>

        {/* Campos de entrada */}
        <div className="space-y-5">
          <div className="relative group">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-transparent peer"
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm group-hover:text-indigo-300"
            >
              Correo electrónico
            </label>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-600 peer-focus:bg-indigo-500 transition-all duration-300"></div>
          </div>

          <div className="relative group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-transparent peer pr-10"
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm group-hover:text-indigo-300"
            >
              Contraseña
            </label>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-600 peer-focus:bg-indigo-500 transition-all duration-300"></div>
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-300 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Botón de login */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full mt-8 py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 select-none ${isLoading
            ? 'bg-indigo-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              INGRESANDO...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        {/* Pie de página */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            ¿No tienes una cuenta?{' '}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
            >
              Únete a CineMax
            </span>
          </p>
          <div className="text-center mb-6 text-xs">
              <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          <p className="text-xs text-gray-500 mt-2">
            © 2025 CineMax Premium Experience
          </p>
        </div>
      </div>

      {/* Widget QR para móvil - Versión grande */}
      <div className="hidden md:block absolute bottom-6 left-6 bg-gray-800/95 p-4 rounded-xl border-2 border-indigo-500/40 flex flex-col items-center z-20 shadow-xl">
        <div className="mb-3 text-sm font-medium text-center text-gray-200 max-w-[160px]">
          Escanea para ingresar desde tu móvil
        </div>
        <div className="p-3 bg-white rounded-lg shadow-inner">
          <QRCode
            value={qrValue}
            size={120}  // Tamaño aumentado de 80 a 120
            level="H"
            fgColor="#2d3748"
            bgColor="transparent"
          />
        </div>                
        <div className="mt-3 text-xs text-gray-300 text-center font-mono bg-gray-900/50 px-2 py-1 rounded">
          {apiUrl.replace(/^https?:\/\//, '')}
        </div>
      </div>

      {/* Decoración de cine */}
      <div className="absolute bottom-4 right-4 text-gray-500 text-xs flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-8h1V5h-1v2zm1 4h-1v2h1V9zm-2 0h1v2h-1V9zm-1 2h-1v2h1v-2zm-2-4h1v2H9V7zm-1 4h1v2H8v-2zm-1 0H6v2h1v-2z" clipRule="evenodd"></path>
        </svg>
        PREMIUM CINEMA EXPERIENCE
      </div>

      {/* Estilos CSS para las animaciones */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}