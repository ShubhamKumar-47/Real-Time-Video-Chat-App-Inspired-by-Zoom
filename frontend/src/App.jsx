import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';
import HomeComponent from './pages/home';
import History from './pages/history';
import ForgotPassword from './pages/forgotPassword';
import Layout from './components/Layout';

function App() {
  return (
    <div className="App">

      <Router>

        <AuthProvider>
          <Layout>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/auth' element={<Authentication />} />
              <Route path='/home' element={<HomeComponent />} />
              <Route path='/history' element={<History />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/:url' element={<VideoMeetComponent />} />
            </Routes>
          </Layout>
        </AuthProvider>

      </Router>
    </div>
  );
}

export default App;