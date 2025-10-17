import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import PostGenerator from "./components/PostGenerator";
import Login from "./components/Login";
import Register from "./components/Register";
import Pricing from "./components/Pricing";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Sidebar from "./components/Sidebar";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/post-generator" element={<PostGenerator/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
