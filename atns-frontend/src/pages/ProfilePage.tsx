import React, { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import type { Profile } from "../types/profile";
import { fetchProfile, updateProfile, createProfile } from "../api/profileApi";

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [formData, setFormData] = useState<Profile>({
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        bio: "",
        dateOfBirth: "",
        batchYear: new Date().getFullYear(),
        faculty: "",
        currentPosition: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await fetchProfile();
                if (data) {
                    setProfile(data);
                    setFormData({
                        firstName: data.firstName || "",
                        middleName: data.middleName || "",
                        lastName: data.lastName || "",
                        phoneNumber: data.phoneNumber || "",
                        address: data.address || "",
                        bio: data.bio || "",
                        dateOfBirth: data.dateOfBirth || "",
                        batchYear: data.batchYear || new Date().getFullYear(),
                        faculty: data.faculty || "",
                        currentPosition: data.currentPosition || "",
                    });
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        }
        loadProfile().catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting:", formData);
        try {
            if (profile && profile.id) {
                await updateProfile(profile.id, formData);
                alert("Profile updated!");
            } else {
                await createProfile(formData);
                alert("Profile created!");
            }
        } catch (err) {
            alert("Error saving profile");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ProfileForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
    );
}
