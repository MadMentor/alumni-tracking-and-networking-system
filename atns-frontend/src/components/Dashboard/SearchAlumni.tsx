// @ts-ignore
import React, { useState } from "react";
import Card from "../ui/Card";
import { Search } from "lucide-react";

export default function SearchAlumni() {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (!query.trim()) return;
        // Replace alert with actual search logic or redirect
        alert(`Searching for: ${query}`);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Card title="Search Alumni" icon={<Search className="w-5 h-5 text-blue-600" />}>
            <input
                type="text"
                placeholder="Name, batch, company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full p-2 border rounded mb-3"
            />
            <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Search
            </button>
        </Card>
    );
}
