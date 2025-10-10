import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lanyard from "./components/Lanyard";
import RiwayatPendidikan from "./components/riwayatpendidikan";
import Keahlian from "./components/keahlian";
import Kontak from "./components/Kontak";
import Portofolio from "./components/Portofolio";


function App() {
  return (
    <Router>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Routes>
          <Route path="/" element={<Lanyard />} />
          <Route path="/riwayat-pendidikan" element={<RiwayatPendidikan />} />
          <Route path="/keahlian" element={<Keahlian />} />
          <Route path="/kontak" element={<Kontak />} /> 
          <Route path="/portofolio" element={<Portofolio />} />
{/* ✅ Huruf besar */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
