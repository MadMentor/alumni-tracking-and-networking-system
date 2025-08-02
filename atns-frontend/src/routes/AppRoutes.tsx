import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/LoginPage'; // <-- Update this if your file is named LoginPage.tsx
import Register from '../pages/RegisterPage';
import SkillList from '../pages/SkillList';
import SkillForm from '../pages/SkillForm';
import Dashboard from "../pages/Dashboard.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/skills" element={<SkillList />} />
            <Route path="/skills/new" element={<SkillForm />} />
            <Route path="/skills/edit/:id" element={<SkillForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
    );
}
