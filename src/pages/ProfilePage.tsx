import { FiUser, FiMail, FiEdit2, FiCalendar, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", name: "", joined: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser({
      email: storedUser.email || "usuario@gmail.com",
      name: storedUser.name || "Usuario CineMax",
      joined: storedUser.joined || "2023-07-15", // Simulado
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition"
          >
            <FiArrowLeft className="mr-2" /> Volver
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
        </div>

        {/* Card de Perfil */}
        <div className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
            <div className="flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl sm:text-5xl shadow-inner">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Información */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
            <div className="flex items-center bg-gray-800/60 rounded-lg p-4">
              <FiUser className="text-indigo-400 mr-3 text-xl" />
              <div>
                <p className="text-gray-400">Nombre completo</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-800/60 rounded-lg p-4">
              <FiMail className="text-indigo-400 mr-3 text-xl" />
              <div>
                <p className="text-gray-400">Correo</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-800/60 rounded-lg p-4">
              <FiCalendar className="text-indigo-400 mr-3 text-xl" />
              <div>
                <p className="text-gray-400">Miembro desde</p>
                <p className="text-white font-medium">
                  {new Date(user.joined).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-800/60 rounded-lg p-4">
              <FiEdit2 className="text-indigo-400 mr-3 text-xl" />
              <div>
                <p className="text-gray-400">Estado</p>
                <p className="text-green-400 font-medium">Activo</p>
              </div>
            </div>
          </div>

          {/* Botón de editar (futuro) */}
          <div className="text-center pt-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition">
              Editar perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
