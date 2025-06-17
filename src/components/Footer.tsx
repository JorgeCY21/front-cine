// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">CineMax</h3>
            <p className="text-gray-400">La mejor experiencia cinematográfica</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Términos</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contacto</a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
          © 2023 CineMax Premium Experience. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
