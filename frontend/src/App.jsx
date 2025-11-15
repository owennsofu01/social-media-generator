// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";

import Home from "./components/Pages/Home";
import PostGenerator from "./components/Post/PostGenerator";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Contact from "./components/Pages/Contact";
import Pricing from "./components/Pages/Pricing";
import Success from "./components/Subscribe/Success";
import Cancel from "./components/Subscribe/Cancel";
import ScheduledPostsList from "./components/Post/ScheduledPostsList";
import Profile from "./components/User/ProfilePage";
import ProfilePage from "./components/User/ProfilePage";
import { Toaster } from "react-hot-toast";
import CardPaymentForm from "./components/Pages/CardPaymentForm";

const AppLayout = ({ children }) => {
  const location = useLocation();

  // Sidebar visibility
  const hideSidebarOn = ["/", "/pricing", "/contact"];
  const showSidebar = !hideSidebarOn.includes(location.pathname);

  // Header/Footer visibility
 // Header/Footer visibility
  const hideLayoutOn = [
    "/login",
    "/register",
    "/post-generator",
    "/scheduled-posts",
    "/sidebar",
    "/profile" ,
   // <-- use leading slash
  ];
  const shouldHide = hideLayoutOn.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />} {/* Sidebar */}
      <div className="flex-1 flex flex-col">
        {!shouldHide && <Header />}
        <main className="flex-1 p-6 bg-[#EAEAEA]">{children}</main>
        {!shouldHide && <Footer />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes without layout logic: Login/Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with AppLayout */}
        <Route
          path="/*"
          element={
            <AppLayout>
               <Toaster position="top-right" /> {/* Add this here */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post-generator" element={<PostGenerator />} />
                <Route path="/scheduled-posts" element={<ScheduledPostsList />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/profile" element={<ProfilePage />} />
import CardPaymentForm from "./components/Payments/CardPaymentForm";

// Inside your Routes nested under AppLayout
<Route path="/card-payment" element={<CardPaymentForm />} />


                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
