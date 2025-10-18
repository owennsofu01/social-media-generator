import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import PostGenerator from "./components/PostGenerator";
import Login from "./components/Login";
import Register from "./components/Register";
import Pricing from "./components/Pricing";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Sidebar from "./components/Sidebar";
import Success from "./components/Success";
import Cancel from "./components/Cancel";

const Layout = ({ children }) => {
  const location = useLocation();

  // ✅ Pages where Header and Footer should not appear
  const hideLayoutOn = ["/login", "/register"];

  const shouldHide = hideLayoutOn.includes(location.pathname);

  return (
    <>
      {!shouldHide && <Header />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post-generator" element={<PostGenerator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
