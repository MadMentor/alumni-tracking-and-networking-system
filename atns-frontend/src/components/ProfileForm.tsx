import React from "react";
import type { Profile } from "../types/profile";

interface ProfileFormProps {
    formData: Profile;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProfileForm({ formData, onChange, onSubmit }: ProfileFormProps) {
    return (
        <div className="max-w-3xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
            <div className="card">
                <div className="card-header">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="middleName" className="form-label">Middle Name</label>
                            <input
                                id="middleName"
                                name="middleName"
                                value={formData.middleName || ""}
                                onChange={onChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="bio" className="form-label">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio || ""}
                                onChange={onChange}
                                className="form-input"
                                rows={4}
                            />
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="batchYear" className="form-label">Batch Year</label>
                            <input
                                id="batchYear"
                                type="number"
                                name="batchYear"
                                value={formData.batchYear}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="faculty" className="form-label">Faculty</label>
                            <input
                                id="faculty"
                                name="faculty"
                                value={formData.faculty}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="currentPosition" className="form-label">Current Position</label>
                            <input
                                id="currentPosition"
                                name="currentPosition"
                                value={formData.currentPosition}
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary w-full sm:w-auto">Save Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
