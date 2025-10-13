import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PrivateRoute = ({ children, roles = [] }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("message")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!localStorage.getItem("message")) return null;

  const fetchedRole = localStorage.getItem("message").split(" ")[3];
  localStorage.setItem("role", fetchedRole);
  
  if (roles.length > 0 && !roles.includes(fetchedRole)) {
    navigate("/", { replace: true });
  }

  return children;
};

export default PrivateRoute;
