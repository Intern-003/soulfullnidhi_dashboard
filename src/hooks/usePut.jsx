import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function usePut(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executePut = async (body) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${BASE_URL}${endpoint}`, body, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePut };
}
