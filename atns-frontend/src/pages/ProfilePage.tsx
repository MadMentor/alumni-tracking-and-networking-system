import React, { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import type { Profile } from "../types/profile";
import { fetchProfile, updateProfile, createProfile } from "../api/profileApi";
import Toast from "../components/ui/Toast";
import type { ToastType } from "../components/ui/Toast";

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
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

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
        
        // Check if user is authenticated
        const token = localStorage.getItem("token");
        if (!token) {
            setToast({ message: "You must be logged in to save your profile. Please log in first.", type: "error" });
            return;
        }
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'dateOfBirth', 'batchYear', 'faculty', 'currentPosition'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof Profile]);
        
        if (missingFields.length > 0) {
            setToast({ message: `Please fill in all required fields: ${missingFields.join(', ')}`, type: "error" });
            return;
        }
        
        // Validate date format
        if (formData.dateOfBirth) {
            const date = new Date(formData.dateOfBirth);
            if (isNaN(date.getTime())) {
                setToast({ message: "Please enter a valid date of birth", type: "error" });
                return;
            }
        }
        
        try {
            if (profile && profile.id) {
                const updatedFormData = { ...formData, id: profile.id };
                const updatedProfile = await updateProfile(profile.id, updatedFormData);
                setProfile(updatedProfile);
                setToast({ message: "Profile updated successfully!", type: "success" });
            } else {
                const createdProfile = await createProfile(formData);
                setProfile(createdProfile);
                setToast({ message: "Profile created successfully!", type: "success" });
            }
        } catch (err: unknown) {
            console.error("Error saving profile:", err);
            
            let errorMessage = "Error saving profile";
            
            if (err && typeof err === 'object' && 'response' in err) {
                const errorResponse = err as { response?: { status?: number; data?: { message?: string } } };
                console.error("Error response:", errorResponse.response);
                console.error("Error status:", errorResponse.response?.status);
                console.error("Error data:", errorResponse.response?.data);
                
                if (errorResponse.response?.status === 401) {
                    errorMessage = "Authentication failed. Please log in again.";
                } else if (errorResponse.response?.status === 400) {
                    errorMessage = errorResponse.response?.data?.message || "Invalid data provided";
                } else if (errorResponse.response?.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                }
            } else if (err && typeof err === 'object' && 'message' in err) {
                errorMessage = (err as { message: string }).message;
            }
            
            setToast({ message: `Error: ${errorMessage}`, type: "error" });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading profile...</div>
        </div>;
    }

    return (
        <>
            <ProfileForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
            {toast && (
                <Toast
                    title={toast.type === "success" ? "Success" : "Error"}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
