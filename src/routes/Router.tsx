import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MoviesPage from "../pages/MoviesPage";
import ShowtimesPage from "../pages/ShowtimesPage";
import SeatsPage from "../pages/SeatsPage";
import ConfirmationPage from "../pages/ConfirmationPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección de "/" a "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
    
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/showtimes/:movieId" element={<ShowtimesPage />} />
        <Route path="/seats/:showtimeId" element={<SeatsPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
