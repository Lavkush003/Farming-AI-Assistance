import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/footer.jsx";
import Home from "./components/pages/home.jsx";
import Products from "./components/pages/products.jsx";
import Cart from "./components/pages/cart.jsx";
import About from "./components/pages/about.jsx";
import Login from "./components/pages/Login.jsx";
import Register from "./components/pages/Register.jsx";
import SellerDashboard from "./components/pages/SellerDashboard.jsx";
import ForgotPassword from "./components/pages/ForgotPassword.jsx";
import Market from "./components/pages/Market.jsx";
import DiseaseDetect from "./components/pages/DiseaseDetect.jsx";
import Forum from "./components/pages/Forum.jsx";
import Schemes from "./components/pages/Schemes.jsx";
import Equipment from "./components/pages/Equipment.jsx";
import YieldPredictor from "./components/pages/YieldPredictor.jsx";
import ColdStorage from "./components/pages/ColdStorage.jsx";
import Transport from "./components/pages/Transport.jsx";
import SmartIrrigation from "./components/pages/SmartIrrigation.jsx";
import PestForecast from "./components/pages/PestForecast.jsx";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/About" element={<About />} />
        <Route path="/market" element={<Market />} />
        <Route path="/disease-detect" element={<DiseaseDetect />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/yield-predictor" element={<YieldPredictor />} />
        <Route path="/smart-irrigation" element={<SmartIrrigation />} />
        <Route path="/pest-forecast" element={<PestForecast />} />
        <Route path="/cold-storage" element={<ColdStorage />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>



      <Footer />
    </>
  );
}

export default App;
