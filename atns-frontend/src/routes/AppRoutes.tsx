import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/LoginPage';
import Register from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import SkillList from '../pages/SkillList';
import SkillForm from '../components/SkillForm.tsx';
import ProfilePage from "../pages/ProfilePage.tsx";
import ProtectedRoute from '../components/ProtectedRoute';
import EventForm from "../components/EventForm.tsx";
import React from "react";
import EventList from "../pages/EventList.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/skills" element={
                <ProtectedRoute>
                    <SkillList />
                </ProtectedRoute>
            } />
            <Route path="/skills/new" element={
                <ProtectedRoute>
                    <SkillForm />
                </ProtectedRoute>
            } />
            <Route path="/skills/edit/:id" element={
                <ProtectedRoute>
                    <SkillForm />
                </ProtectedRoute>
            } />
            <Route path="/events" element={
                <ProtectedRoute>
                    <EventList />
                </ProtectedRoute>
            } />
            <Route path="/events/new" element={
                <ProtectedRoute>
                    <EventForm />
                </ProtectedRoute>
            } />
        </Routes>
    );
}
