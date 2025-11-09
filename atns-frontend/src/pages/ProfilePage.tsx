import React, { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import type { Profile } from "../types/profile";
import { fetchProfile, updateProfile, createProfile } from "../api/profileApi";
import Toast from "../components/ui/Toast";
import type { ToastType } from "../components/ui/Toast";
import { useAuthStore } from "../store/authStore.ts";

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
        profileImageUrl: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // for image
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await fetchProfile();
                if (data) {
                    setProfile(data);
                    setFormData({
                        ...formData,
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
                        profileImageUrl: data.profileImageUrl || "",
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

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return; // no file selected

        const file = fileList[0];
        setSelectedFile(file);
        setFormData(prev => ({
            ...prev,
            profileImageUrl: URL.createObjectURL(file), // preview
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Create FormData that matches backend expectations
        const formPayload = new FormData();

        // Create a ProfileDto object that matches your backend structure
        const profileDto = {
            id: profile?.id, // Include ID for updates
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName || "",
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            bio: formData.bio || "",
            dateOfBirth: formData.dateOfBirth,
            batchYear: formData.batchYear,
            faculty: formData.faculty,
            currentPosition: formData.currentPosition,
            profileImageUrl: formData.profileImageUrl, // Keep existing image URL if no new file
            // userId: profile?.userId, // Include if needed by backend
            skills: profile?.skills || [] // Include existing skills
        };

        // Append as "profile" part (JSON) - this is what your backend expects
        formPayload.append("profile", new Blob([JSON.stringify(profileDto)], {
            type: "application/json"
        }));

        // Append image if a new file is selected
        if (selectedFile) {
            formPayload.append("image", selectedFile);
        }

        // Debug: Log what's being sent
        console.log("Sending profile DTO:", profileDto);
        console.log("Selected file:", selectedFile?.name);

        // Check if user is authenticated
        const token = useAuthStore.getState().token;
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
                const updatedProfile = await updateProfile(profile.id, formPayload);
                setProfile(updatedProfile);
                setToast({ message: "Profile updated successfully!", type: "success" });

                // Refresh the form data with updated profile
                setFormData({
                    ...formData,
                    ...updatedProfile
                });
            } else {
                const createdProfile = await createProfile(formPayload);
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
            <ProfileForm formData={formData} onChange={handleChange} onFileChange={handleFileChange} onSubmit={handleSubmit} />
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
