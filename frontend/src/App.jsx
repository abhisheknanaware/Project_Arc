import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AQI from './pages/AQI';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OAuthCallback from './pages/OAuthCallback';
import Intro3D from './components/Intro3D';

/* Show the intro once per browser session */
const hasSeenIntro = () => sessionStorage.getItem('arc_intro_seen') === '1';

function App() {
  const [showIntro, setShowIntro] = useState(!hasSeenIntro());

  const handleIntroComplete = () => {
    sessionStorage.setItem('arc_intro_seen', '1');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <Intro3D onComplete={handleIntroComplete} />}

      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/aqi"            element={<AQI />} />
            <Route path="/aboutus"        element={<AboutUs />} />
            <Route path="/contactus"      element={<ContactUs />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/signup"         element={<Signup />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
