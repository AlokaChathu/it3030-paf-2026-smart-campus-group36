import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import Dashboard from './pages/Dashboard'; // <-- Import your new component

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                
                {/* Point this route to your new real Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} /> 
            </Routes>
        </BrowserRouter>
    );
}

export default App;