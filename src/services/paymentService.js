import { api } from "./api";
const BASE_URL = import.meta.env.VITE_GLIDE_BACKEND_SERVICE_BASE_URL;

export const fetchReviewPayment = async (pgSessionId, token) => {
  return api(
    `${BASE_URL}/review-glide-widget-payments`,
    "POST",
    { session_id: pgSessionId },
    token
  );
};