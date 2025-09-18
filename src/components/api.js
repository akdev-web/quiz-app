import axios from "axios";
const newRequestURl = (path) =>{
  if(!path){path=''}
  return `http://localhost:3000/api/${path}`;
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
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
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
        return api(originalRequest);
      } catch (err) {
        console.log(err);
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

