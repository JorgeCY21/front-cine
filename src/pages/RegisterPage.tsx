import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/user.service"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }>({});
  const navigate = useNavigate();

  const validateName = (name: string) => {
    return !/\d/.test(name);
  };

  const validateEmail = (email: string) => {
    return email.endsWith("@gmail.com");
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 6;
    return hasUpperCase && hasNumber && hasSpecial && hasMinLength;
  };

  const getPasswordValidation = (password: string) => {
    return {
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 6,
    };
  };

  const handleRegister = async () => {
    const newErrors: typeof errors = {};

    if (!validateName(firstName)) {
      newErrors.firstName = "El nombre no puede contener números";
    }

    if (!validateName(lastName)) {
      newErrors.lastName = "El apellido no puede contener números";
    }

    if (!validateEmail(email)) {
      newErrors.email = "El correo debe terminar en @gmail.com";
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "La contraseña no cumple con los requisitos";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setIsLoading(true);

      const response = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response));
      navigate("/movies");
    } catch (error) {    
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = getPasswordValidation(password);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Fondos animados */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      </div>

      {/* Decoración tipo cinta de película */}
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

      {/* Formulario principal */}
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:shadow-3xl hover:border-indigo-500/30">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              CineMax
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        <p className="text-sm text-center text-gray-300 mb-8 tracking-wider">
          Crea tu cuenta para vivir la experiencia completa
        </p>

        <div className="space-y-5">
          {/* Campo Nombres */}
          <div className="relative group">
            <input
              id="name"
              type="text"
              placeholder=" "
              value={firstName}
              onChange={(e) => {
                if (!/\d/.test(e.target.value)) {
                  setFirstName(e.target.value);
                }
              }}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-transparent peer"
            />
            <label htmlFor="name" className="absolute left-3 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm ">
              Nombres
            </label>
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>

          {/* Campo Apellidos */}
          <div className="relative group">
            <input
              id="lastName"
              type="text"
              placeholder=" "
              value={lastName}
              onChange={(e) => {
                if (!/\d/.test(e.target.value)) {
                  setLastName(e.target.value);
                }
              }}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-transparent peer"
            />
            <label htmlFor="lastName" className="absolute left-3 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm ">
              Apellidos
            </label>
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>

          {/* Campo Correo */}
          <div className="relative group">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-transparent peer"
            />
            <label htmlFor="email" className="absolute left-3 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm ">
              Correo electrónico
            </label>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Campo Contraseña con toggle de visibilidad */}
          <div className="relative group">
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-transparent peer"
              />
              <label htmlFor="password" className="absolute left-3 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-sm ">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}

            {/* Indicadores de validación de contraseña */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center">
                <span className={`inline-block w-4 h-4 mr-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-gray-600'}`}>
                  {passwordValidation.hasUpperCase && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs ${passwordValidation.hasUpperCase ? 'text-green-400' : 'text-gray-400'}`}>Al menos una mayúscula</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-4 h-4 mr-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-600'}`}>
                  {passwordValidation.hasNumber && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>Al menos un número</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-4 h-4 mr-2 rounded-full ${passwordValidation.hasSpecial ? 'bg-green-500' : 'bg-gray-600'}`}>
                  {passwordValidation.hasSpecial && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs ${passwordValidation.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>Al menos un carácter especial</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-4 h-4 mr-2 rounded-full ${passwordValidation.hasMinLength ? 'bg-green-500' : 'bg-gray-600'}`}>
                  {passwordValidation.hasMinLength && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs ${passwordValidation.hasMinLength ? 'text-green-400' : 'text-gray-400'}`}>Mínimo 6 caracteres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de registro */}
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className={`w-full mt-8 py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 select-none ${isLoading
            ? 'bg-indigo-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              REGISTRANDO...
            </div>
          ) : (
            'Registrarse'
          )}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors font-medium"
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}