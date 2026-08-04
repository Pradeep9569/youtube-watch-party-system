import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "420px", margin: "60px auto", padding: "24px", textAlign: "center" }}>
      <h1>Watch Party</h1>
      <p>Create or join a watch party room with friends.</p>
      <button onClick={() => navigate("/create")}>Create Room</button>
      <button onClick={() => navigate("/join")}>Join Room</button>
    </div>
  );
}

export default Home;
