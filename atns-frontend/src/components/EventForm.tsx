import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, updateEvent, fetchEventById } from "../api/eventApi";
import type { Event, EventLocation } from "../types/event";

const emptyLocation: EventLocation = {
    address: "",
    onlineLink: "",
    roomNumber: "",
};

const EventForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState<Event>({
        eventName: "",
        eventDescription: "",
        startTime: new Date().toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm for datetime-local input
        endTime: "",
        location: emptyLocation,
        category: "",
        active: true,
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && id) {
            setFetching(true);
            setError(null);
            fetchEventById(parseInt(id))
                .then((data) => {
                    // Convert dates to input-friendly format
                    setFormData({
                        ...data,
                        startTime: data.startTime ? data.startTime.slice(0, 16) : "",
                        endTime: data.endTime ? data.endTime.slice(0, 16) : "",
                        location: data.location || emptyLocation,
                    });
                })
                .catch(() => setError("Failed to load event data"))
                .finally(() => setFetching(false));
        }
    }, [id, isEdit]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            location: { ...formData.location, [e.target.name]: e.target.value },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.eventName.trim()) {
            setError("Event name is required.");
            setLoading(false);
            return;
        }

        if (!formData.startTime) {
            setError("Start time is required.");
            setLoading(false);
            return;
        }

        // Convert date-time local string to ISO string for backend
        const payload = {
            ...formData,
            organizerProfileId: parseInt(localStorage.getItem("profileId")!),
            startTime: new Date(formData.startTime).toISOString(),
            endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null,
        };

        try {
            if (isEdit && id) {
                await updateEvent(parseInt(id), payload);
            } else {
                await createEvent(payload);
            }
            navigate("/events");
        } catch {
            setError("Failed to save event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center p-4">Loading event...</div>;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md mt-8 font-sans">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEdit ? "Edit Event" : "Add Event"}
            </h2>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="eventName" className="block mb-1 font-semibold text-gray-700">
                        Event Name
                    </label>
                    <input
                        id="eventName"
                        name="eventName"
                        type="text"
                        value={formData.eventName}
                        onChange={handleChange}
                        maxLength={200}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="eventDescription" className="block mb-1 font-semibold text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="eventDescription"
                        name="eventDescription"
                        value={formData.eventDescription}
                        onChange={handleChange}
                        maxLength={2000}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="startTime" className="block mb-1 font-semibold text-gray-700">
                        Start Time
                    </label>
                    <input
                        id="startTime"
                        name="startTime"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="endTime" className="block mb-1 font-semibold text-gray-700">
                        End Time
                    </label>
                    <input
                        id="endTime"
                        name="endTime"
                        type="datetime-local"
                        value={formData.endTime || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                <fieldset className="border p-4 rounded">
                    <legend className="font-semibold mb-2">Location</legend>
                    <div className="mb-2">
                        <label htmlFor="address" className="block mb-1 font-semibold text-gray-700">
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.location?.address || ""}
                            onChange={handleLocationChange}
                            maxLength={500}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="onlineLink" className="block mb-1 font-semibold text-gray-700">
                            Online Link
                        </label>
                        <input
                            id="onlineLink"
                            name="onlineLink"
                            type="url"
                            value={formData.location?.onlineLink || ""}
                            onChange={handleLocationChange}
                            maxLength={500}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="roomNumber" className="block mb-1 font-semibold text-gray-700">
                            Room Number
                        </label>
                        <input
                            id="roomNumber"
                            name="roomNumber"
                            type="text"
                            value={formData.location?.roomNumber || ""}
                            onChange={handleLocationChange}
                            maxLength={30}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                </fieldset>

                <div>
                    <label htmlFor="category" className="block mb-1 font-semibold text-gray-700">
                        Category
                    </label>
                    <input
                        id="category"
                        name="category"
                        type="text"
                        value={formData.category || ""}
                        onChange={handleChange}
                        maxLength={50}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 text-white font-semibold rounded-md transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
                </button>
            </form>
        </div>
    );
};

export default EventForm;
