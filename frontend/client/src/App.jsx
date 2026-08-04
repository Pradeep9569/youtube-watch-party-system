import { BrowserRouter , Routes , Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import WatchRoom from "./pages/WatchRoom";
import YouTube from "react-youtube";

function App() {
 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/create" element={<CreateRoom />}/>

      <Route path="/join" element ={<JoinRoom/>}/>

      <Route path="/room/:roomCode" element={<WatchRoom />}/>

     
    </Routes>
    </BrowserRouter>
  )
}

export default App
