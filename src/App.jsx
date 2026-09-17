import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Scores from "./pages/Scores";
import Teams from "./pages/Teams";
import Standings from "./pages/Standings";
import Players from "./pages/Players";

import { FavouriteTeamsProvider } from "./context/FavouriteTeamsContext";

function App() {
  return (
    <FavouriteTeamsProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/players" element={<Players />} />
        </Routes>
      </BrowserRouter>
    </FavouriteTeamsProvider>
  );
}

export default App;
