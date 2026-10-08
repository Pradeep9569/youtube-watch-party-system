import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api/authApi";
import { AuthContext } from "../components/context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    // Clear form whenever Login page/component loads
    useEffect(() => {
        setForm({
            email: "",
            password: "",
        });
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/login", form);

            // Save login information through AuthContext
            login(res.data.token, res.data.user);

            // Clear form after successful login
            setForm({
                email: "",
                password: "",
            });

            alert("Login Successful");

            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg,#667eea,#764ba2)",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <div
                style={{
                    width: "380px",
                    background: "#fff",
                    padding: "35px",
                    borderRadius: "15px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "10px",
                        color: "#333",
                    }}
                >
                    Welcome Back 👋
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "25px",
                    }}
                >
                    Login to your Watch Party account
                </p>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <label
                        style={{
                            fontWeight: "bold",
                            color: "#444",
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                            boxSizing: "border-box",
                        }}
                    />

                    <label
                        style={{
                            fontWeight: "bold",
                            color: "#444",
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            marginBottom: "25px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                            boxSizing: "border-box",
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#667eea",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "17px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Login
                    </button>
                </form>

                <p
                    style={{
                        marginTop: "20px",
                        textAlign: "center",
                        color: "#555",
                    }}
                >
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        style={{
                            color: "#667eea",
                            fontWeight: "bold",
                            textDecoration: "none",
                        }}
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;