import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PrivateRoute = ({ children, roles = [] }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!localStorage.getItem("token")) return null;

  const fetchedRole = localStorage.getItem("role");
  

  if (roles.length > 0 && !roles.includes(fetchedRole)) {
    navigate("/", { replace: true });
  }

  return children;
};

export default PrivateRoute;
