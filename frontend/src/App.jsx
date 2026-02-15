import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Apply from "./pages/Apply";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
