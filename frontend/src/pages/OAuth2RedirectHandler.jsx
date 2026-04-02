import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 1. Grab the URL parameters (everything after the '?')
        const urlParams = new URLSearchParams(location.search);
        
        // 2. Extract just the token string
        const token = urlParams.get('token');

        if (token) {
            // 3. Save the token securely in the browser
            localStorage.setItem('token', token);
            
            // 4. Send the user to the Dashboard!
            navigate('/dashboard', { replace: true });
        } else {
            // If something went wrong, kick them back to login
            navigate('/login', { replace: true });
        }
    }, [navigate, location]);

    // This is what the user sees for a split second while we grab the token
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Authenticating...</h2>
                <p className="text-gray-500 mt-2">Connecting to Smart Campus Hub</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;