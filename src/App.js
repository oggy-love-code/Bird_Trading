import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing, Error, Register } from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Profile,
  Order,
  Product,
  Stats,
  SharedLayout,
} from "./pages/dashboard";
import React, { Fragment } from "react";
import Login from "./pages/Login";
import CreateProduct from "./pages/CreateProduct";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route
           path="/home/*" 
           element={
           <SharedLayout />  
           }>
            <Route path="chart" element={<Stats />} />
            <Route path="product" element={<Product />} />
            <Route path="profile" element={<Profile />} />
            <Route path="order" element={<Order />} />
          </Route>
          <Route path="/" element={
            <Login />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route path="/registerStaff" element={<Register />} />
          <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}

export default App;
