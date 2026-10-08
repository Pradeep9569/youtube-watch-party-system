import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import WatchRoom from "./pages/WatchRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default page → Login */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Authentication */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Home */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Create Room */}
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <CreateRoom />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Join Room */}
                <Route
                    path="/join"
                    element={
                        <ProtectedRoute>
                            <JoinRoom />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Watch Room */}
                <Route
                    path="/room/:roomCode"
                    element={
                        <ProtectedRoute>
                            <WatchRoom />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown URL → Login */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;