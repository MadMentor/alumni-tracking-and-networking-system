// @ts-ignore
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from "./components/Navbar/PublicNavbar.tsx";

function App() {
    return (
        <div className="App">
            <Navbar />
            <AppRoutes />
        </div>
    );
}

export default App;
