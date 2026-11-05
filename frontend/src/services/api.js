import axios from 'axios';
const api = axios.create({baseURL: 'https://dev-task.elancoapps.com/data'});
export const myapi = axios.create({baseURL: "http://127.0.0.1:8000"})
export default api
