import logo from './logo.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import LandingPage from './LandingPage';
import RegisterPage from './registerPage';

function App() {
  return (
  <>
  <BrowserRouter>
    <Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path='/register' element={<RegisterPage />} />
    </Routes>
  </BrowserRouter>
  </>);
}

export default App;
