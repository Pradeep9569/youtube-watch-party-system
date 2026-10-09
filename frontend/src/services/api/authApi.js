import axios from "axios";

const API = axios.create({
    baseURL: "https://youtube-watch-party-system-l5s1.onrender.com/api/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;