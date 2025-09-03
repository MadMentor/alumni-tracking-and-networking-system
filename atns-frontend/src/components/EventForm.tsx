import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, updateEvent, fetchEventById } from "../api/eventApi";
import type { Event, EventLocation } from "../types/event";
import { CalendarPlus } from "lucide-react";

const emptyLocation: EventLocation = {
    address: "",
    onlineLink: "",
    roomNumber: "",
};

const EventForm: React.FC = () => {
    const { id } = useParams();
    const eventId = id ? parseInt(id, 10) : undefined;
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
        if (isEdit && eventId != undefined) {// <-- parse here
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
        <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="card">
                    <div className="card-header">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CalendarPlus className="w-5 h-5 text-blue-600" />
                            {isEdit ? "Edit Event" : "Add Event"}
                        </h2>
                    </div>

                    {error && <div className="px-6 pt-4"><div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div></div>}

                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="eventName" className="form-label">Event Name</label>
                                <input
                                    id="eventName"
                                    name="eventName"
                                    type="text"
                                    value={formData.eventName}
                                    onChange={handleChange}
                                    maxLength={200}
                                    required
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="eventDescription" className="form-label">Description</label>
                                <textarea
                                    id="eventDescription"
                                    name="eventDescription"
                                    value={formData.eventDescription}
                                    onChange={handleChange}
                                    maxLength={2000}
                                    rows={4}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="startTime" className="form-label">Start Time</label>
                                <input
                                    id="startTime"
                                    name="startTime"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="endTime" className="form-label">End Time</label>
                                <input
                                    id="endTime"
                                    name="endTime"
                                    type="datetime-local"
                                    value={formData.endTime || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <fieldset className="border rounded-lg p-4">
                                <legend className="text-sm font-medium text-gray-700">Location</legend>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            value={formData.location?.address || ""}
                                            onChange={handleLocationChange}
                                            maxLength={500}
                                            className="form-input"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="onlineLink" className="form-label">Online Link</label>
                                        <input
                                            id="onlineLink"
                                            name="onlineLink"
                                            type="url"
                                            value={formData.location?.onlineLink || ""}
                                            onChange={handleLocationChange}
                                            maxLength={500}
                                            className="form-input"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="roomNumber" className="form-label">Room Number</label>
                                        <input
                                            id="roomNumber"
                                            name="roomNumber"
                                            type="text"
                                            value={formData.location?.roomNumber || ""}
                                            onChange={handleLocationChange}
                                            maxLength={30}
                                            className="form-input"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="category" className="form-label">Category</label>
                                <input
                                    id="category"
                                    name="category"
                                    type="text"
                                    value={formData.category || ""}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="card-footer">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EventForm;
