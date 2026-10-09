import axios from "axios";

const API = axios.create({
    baseURL: "https://youtube-watch-party-system-1-y992.onrender.com/api/auth",
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;