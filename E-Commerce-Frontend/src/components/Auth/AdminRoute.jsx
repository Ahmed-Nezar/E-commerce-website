import { Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let isAdmin = false;

  if (token) {
    try {
      const payload = jwtDecode(token);
      isAdmin = payload.isAdmin;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return isAdmin ? children : <Navigate to="/signin" />;
};

export default AdminRoute;