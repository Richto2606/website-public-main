import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./sections/Header.jsx";
import Beranda from "./sections/Beranda.jsx";
import About from "./sections/About.jsx";
import Faq from "./sections/Faq.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import Daftar from "./sections/Daftar.jsx";
import Gallery from "./sections/Gallery.jsx";
import PendaftaranPage from "./sections/pendaftaran/Page.jsx";

// 1. Komponen Penangkap Token dari URL
const TokenCatcher = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Mengecek apakah ada tulisan "?token=..." di URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      // Simpan token ke dalam localStorage milik Vite
      localStorage.setItem('token', token);
      
      // Bersihkan URL dari token agar rapi dan aman (Kembali ke URL bersih)
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return null; // Komponen ini berjalan di latar belakang, tidak menampilkan apa-apa
};

const HalamanUtama = () => {
  return (
    <>
      <Header />
      <Beranda />
      <Daftar />
      <Gallery />
      <About />
      <Faq />
      <Contact />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      {/* 2. Pasang TokenCatcher tepat di bawah Router */}
      <TokenCatcher /> 
      
      <main className="overflow-hidden">
        <Routes>
          <Route path="/" element={<HalamanUtama />} />
          
          <Route 
            path="/pendaftaran" 
            element={
              <>
                <Header />
                <div className="pt-24 pb-10">
                  <PendaftaranPage />
                </div>
                <Footer />
              </>
            } 
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;