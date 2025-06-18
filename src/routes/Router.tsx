import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MoviesPage from "../pages/MoviesPage";
import ShowtimesPage from "../pages/ShowtimesPage";
import SeatsPage from "../pages/SeatsPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import RegisterPage from "../pages/RegisterPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/showtimes/:movieId" element={<ShowtimesPage />} />
        <Route path="/seats/:showtimeId" element={<SeatsPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
