import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let isAdmin = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.isAdmin;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return isAdmin ? children : <Navigate to="/signin" />;
};

export default AdminRoute;