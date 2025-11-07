import {Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/ProfilePage";
import ExplorePage from "../pages/ExplorePage";
import EventList from "../pages/EventList";
import SkillList from "../pages/SkillList";
import SkillForm from "../components/SkillForm";
import EventForm from "../components/EventForm";
import RecommendedEventsPage from "../pages/RecommendedEventsPage.tsx";
import RecommendedUsersPage from "../pages/RecommendedUsersPage.tsx";
import ChangePassword from "../pages/settings/ChangePassword";
import ChangeEmail from "../pages/settings/ChangeEmail";
import ProfileDetailsPage from "../pages/ProfileDetailsPage.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/events" element={<EventList/>}/>
            <Route path="/events/new" element={<EventForm/>}/>
            <Route path="/events/edit/:id" element={<EventForm/>}/>
            <Route path="/skills" element={<SkillList/>}/>
            <Route path="/skills/new" element={<SkillForm/>}/>
            <Route path="/skills/:id/edit" element={<SkillForm/>}/>
            <Route path="/events/recommended" element={<RecommendedEventsPage/>}/>
            <Route path="/users/recommended" element={<RecommendedUsersPage />}/>
            <Route path="/settings/password" element={<ChangePassword/>}/>
            <Route path="/settings/email" element={<ChangeEmail/>}/>
            <Route path="/explore" element={<ExplorePage/>}/>
            <Route path="/profiledetails/:id" element={<ProfileDetailsPage/>}/>
        </Routes>
    );
}
