// @ts-ignore
import React, { useState } from "react";

export default function SearchAlumni() {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        // Implement search logic or redirect to search page with query param
        alert(`Searching for: ${query}`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Search Alumni</h3>
            <input
                type="text"
                placeholder="Name, batch, company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border rounded mb-3"
            />
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Search
            </button>
        </div>
    );
}
