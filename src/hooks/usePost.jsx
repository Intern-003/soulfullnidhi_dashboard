import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function usePost(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (body) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (endpoint === "/login") {
        response = await axios.post(`${BASE_URL}${endpoint}`, body, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(`${BASE_URL}${endpoint}`, body, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
      }

      setData(response.data); // store in state for UI if needed
      return response.data;   // ✅ return actual response immediately
    } catch (err) {
      const errData = err.response?.data || "Something went wrong";
      setError(errData);
      throw errData; // important to propagate the error
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute, setError };
}
