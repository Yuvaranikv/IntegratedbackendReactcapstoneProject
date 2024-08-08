import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
      return response; // Return successful response
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized errors (e.g., token expired)
        // Optionally redirect to login or notify user
      }
      return Promise.reject(error); // Propagate the error
    }
  );

export default apiClient;