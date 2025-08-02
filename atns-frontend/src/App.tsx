// @ts-ignore
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import PublicNavbar from "./components/Navbar/PublicNavbar.tsx";

function App() {
    return (
        <div className="App">
            <PublicNavbar />
            <AppRoutes />
        </div>
    );
}

export default App;
