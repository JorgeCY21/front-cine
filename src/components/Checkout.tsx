import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie, Showtime } from '../types/cinemaTypes';

interface CheckoutProps {
  selectedSeats: number[];
  showtime: Showtime;
  movie: Movie;
}

const Checkout = ({ selectedSeats, showtime, movie }: CheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  const totalPrice = selectedSeats.length * 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/confirmation', { 
        state: { 
          movie, 
          showtime, 
          seats: selectedSeats, 
          totalPrice 
        } 
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Resumen de la compra</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Película:</span> {movie.title}</p>
          <p><span className="font-medium">Horario:</span> {new Date(showtime.start_time).toLocaleString()}</p>
          <p><span className="font-medium">Sala:</span> {showtime.room.name}</p>
          <p><span className="font-medium">Asientos:</span> {selectedSeats.length}</p>
          <p className="text-lg font-bold mt-2">Total: ${totalPrice}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Información de Pago</h3>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Método de Pago</label>
          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="credit">Tarjeta de Crédito</option>
            <option value="debit">Tarjeta de Débito</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        
        {paymentMethod === 'credit' || paymentMethod === 'debit' ? (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Número de Tarjeta</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-medium">Fecha de Expiración</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/AA"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Nombre en la Tarjeta</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </>
        ) : (
          <div className="mb-4">
            <p>Serás redirigido a PayPal para completar tu pago</p>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded font-medium text-white ${
            isProcessing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } transition-colors`}
        >
          {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;