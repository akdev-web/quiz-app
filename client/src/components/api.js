import axios from "axios";
const newRequestURl = (path) =>{
  if(!path){path=''}
  // return `http://localhost:3000/api/${path}`;
  return `${import.meta.env.VITE_API_URL}/api/${path}`;

}
const api = axios.create({
    baseURL:newRequestURl(),
    withCredentials:true,
    headers:{
        'Content-type': 'application/json',
        'x-Client-path':location.pathname,
    }
})

export default api;

export const auth = axios.create({
    baseURL: newRequestURl('auth'),
    withCredentials:true,
    headers:{
        'Content-type': 'application/json',
    }
})

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('access_Token');
        if(token){
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            }
        }
        return config;
    },
    (error)=>{return Promise.reject(error)}
)


// A flag to avoid infinite loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Check if token expired and refresh is requested
    if (error.response?.status === 401 && error.response.data?.refreshClient && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest).catch(err=>{reject(normalizeError(err))}));
            },
            reject: (err) => {
              reject(normalizeError(err));
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const headers = {Authorization:`Bearer ${localStorage.getItem('access_Token')}`};
        const response = await axios.get(newRequestURl('auth/refresh'),{withCredentials:true,headers:headers});
  
        const refreshed = response.data?.refreshed;


        processQueue(null);
        return api(originalRequest).catch(err=>{Promise.reject(normalizeError(err))});
      } catch (err) {
        processQueue(err);
        return Promise.reject(normalizeError(err));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

export function normalizeError(error) {
  // Axios timeout or network unreachable
  if (error.code === "ECONNABORTED") {
    return {
      type: "timeout",
      status: 0,
      message: "Request timed out. Please try again.",
    };
  }

  if (!error.response) {
    return {
      type: "network",
      status: 0,
      message: "Network error: Please check your internet connection.",
    };
  }

  const { status, data } = error.response;

  // Handle specific status codes
  let err_response = {status,data};
  switch (status) {
    case 400:
      return {
        ...err_response,
        type: "bad_request",
        message: data?.err || "Bad Request.",
      };

    case 401:
      return {
        ...err_response,
        type: "unauthorized",
        message: data?.err || "Unauthorized request !",
      };

    case 403:
      return {
        ...err_response,
        type: "forbidden",
        message: data?.err || "You don't have permission to perform this action.",
      };

    case 404:
      return {
        ...err_response,
        type: "not_found",
        message: data?.err || "Resource not found.",
      };

    case 422:
      return {
        ...err_response,
        type: "validation",
        message: "Validation failed.",
        errors: data?.err || null,
      };

    case 429:
      return {
        ...err_response,
        type: "rate_limit",
        message: data?.err || "Too many requests. Please slow down.",
      };

    case 500:
      return {
        ...err_response,
        type: "server_error",
        message:
          data?.err || "Server error. Please try again later.",
      };

    default:
      return {
        ...err_response,
        type: "unknown",
        message: data?.err || "Unexpected error occurred.",
      };
  }
}
