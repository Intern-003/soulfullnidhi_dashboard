import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function usePost(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * execute - Call this function to perform the POST request
   * @param {object} body - Data to send in the POST request
   * @returns {Promise<object>} - Response data
   */
  const execute = async (body) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      // Handle axios error properly
      setError(err.response?.data || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
