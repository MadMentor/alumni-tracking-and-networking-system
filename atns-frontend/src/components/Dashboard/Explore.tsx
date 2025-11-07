import { useState } from "react";
import Card from "../ui/Card";
import { Search, Users, Filter, MapPin, Building, Code } from "lucide-react";

interface ExploreProps {
    onSearch: (query: string, type: "name" | "batch" | "company" | "skill") => void;
}


export default function Explore({ onSearch }: ExploreProps) {
    const [query, setQuery] = useState("");
    const [searchType, setSearchType] = useState<"name" | "batch" | "company" | "skill">("name");

    const handleSearch = () => {
        if (!query.trim()) return;
        onSearch(query, searchType);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const searchTypes = [
        { value: "name", label: "Name", icon: <Users className="w-4 h-4" /> },
        { value: "batch", label: "Batch", icon: <Building className="w-4 h-4" /> },
        { value: "company", label: "Company", icon: <MapPin className="w-4 h-4" /> },
        { value: "skill", label: "Skill", icon: <Code className="w-4 h-4" /> },
    ];

    return (
        <Card title="Explore" icon={<Search className="w-5 h-5 text-green-600" />}>
            <div className="space-y-4">
                {/* Search Type Selector */}
                <div className="flex gap-2">
                    {searchTypes.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setSearchType(type.value as any)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                searchType === type.value
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {type.icon}
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search by ${searchType}...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={!query.trim()}
                    className="btn btn-primary w-full"
                >
                    <Search className="w-4 h-4" />
                    Search
                </button>

                {/* Quick Filters */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Filter className="w-4 h-4" />
                        Quick filters:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Recent Graduates", "Top Skills", "Same Faculty", "Location"].map((filter) => (
                            <button
                                key={filter}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
