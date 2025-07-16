import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// import other pages...

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* Add other routes like /login, /register, /dashboard */}
        </Routes>
    );
}
