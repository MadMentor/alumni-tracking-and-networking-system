import React from "react";
import type { Profile } from "../types/profile";

interface ProfileFormProps {
    formData: Profile;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProfileForm({ formData, onChange, onSubmit }: ProfileFormProps) {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="middleName">Middle Name</label>
                    <input
                        id="middleName"
                        name="middleName"
                        value={formData.middleName || ""}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio || ""}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                <div>
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="batchYear">Batch Year</label>
                    <input
                        id="batchYear"
                        type="number"
                        name="batchYear"
                        value={formData.batchYear}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="faculty">Faculty</label>
                    <input
                        id="faculty"
                        name="faculty"
                        value={formData.faculty}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="currentPosition">Current Position</label>
                    <input
                        id="currentPosition"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={onChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save Profile
                </button>
            </form>
        </div>
    );
}
