import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Convert from './pages/Convert';
import VideoView from './pages/VideoView';
import ShortView from './pages/ShortView';
import TopNav from './components/TopNav';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/v/:id?" element={<VideoView />} />
        <Route path="/s/:id?" element={<ShortView />} />
      </Routes>
    </Router>
  );
}

export default App;
