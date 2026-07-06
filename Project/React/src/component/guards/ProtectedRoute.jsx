
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { loadingUser } = useAuth();
  const token = sessionStorage.getItem("token");


  if (loadingUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;

    // Token expired
    if (decoded.exp < currentTime) {
      sessionStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      const redirectPath =
        decoded.role === "ADMIN"
          ? "/overview"
          : "/dashboard";

      return <Navigate to={redirectPath} replace />;
    }

    // ✅ THIS IS THE FIX
    return <Outlet />;

  } catch (error) {
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;