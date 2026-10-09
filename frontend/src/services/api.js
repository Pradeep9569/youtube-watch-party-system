import axios from "axios";

const api = axios.create({
 baseURL:"https://youtube-watch-party-system-l5s1.onrender.com/api" ,

});

export default api;