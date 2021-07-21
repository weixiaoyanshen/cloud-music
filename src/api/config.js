import axios from 'axios';

export const baseUrl = 'http://192.168.102.13:5400';

const axiosInstance = axios.create({
  baseURL: baseUrl
})

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, '网络错误');
    return Promise.reject(err)
  }
)

export {
  axiosInstance
}