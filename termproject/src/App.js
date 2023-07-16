import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import LandingPage from './LandingPage';
import RegisterPage from './registerPage';
import ProfilePage from './profilePage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/profilePage' element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>);
}

export default App;
