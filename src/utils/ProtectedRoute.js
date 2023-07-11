import { Route, Navigate,Outlet } from "react-router-dom";
import React from "react";


const useAuth = () => {
  const user=localStorage.getItem('profile');
  if(user){
    return true;  
  }
  return false;
}

const ProtectedRoute = () => {
  const auth = useAuth();
  
  return auth?<Outlet />:<Navigate to="/login"/>;
};

export default ProtectedRoute;
