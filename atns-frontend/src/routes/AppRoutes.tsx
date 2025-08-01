import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/LoginPage'; // <-- Update this if your file is named LoginPage.tsx
import Register from '../pages/RegisterPage';
import SkillList from '../pages/SkillList';
import SkillForm from '../pages/SkillForm';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/skills" element={<SkillList />} />
            <Route path="/skills/new" element={<SkillForm />} />
            <Route path="/skills/edit/:id" element={<SkillForm />} />
        </Routes>
    );
}
