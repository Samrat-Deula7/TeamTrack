import { useState } from "react";
import Time from "../assets/time.gif"
interface HistoryItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "conversation" | "project" | "tutorial";
  tags: string[];
}

interface FilterOption {
  value: string;
  label: string;
}

export default function Timeline() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sample history data
  const historyData: HistoryItem[] = [
    {
      id: 1,
      title: "React Component Design Patterns",
      description:
        "Discussed best practices for building reusable React components",
      date: "2024-02-04",
      time: "2:30 PM",
      type: "conversation",
      tags: ["React", "Design Patterns"],
    },
    {
      id: 2,
      title: "API Integration Guide",
      description: "Built a REST API integration with authentication",
      date: "2024-02-03",
      time: "10:15 AM",
      type: "project",
      tags: ["API", "Backend"],
    },
    {
      id: 3,
      title: "CSS Grid Layout Tutorial",
      description: "Created responsive layouts using CSS Grid",
      date: "2024-02-02",
      time: "4:45 PM",
      type: "tutorial",
      tags: ["CSS", "Layout"],
    },
    {
      id: 4,
      title: "Database Schema Design",
      description: "Designed relational database schema for e-commerce",
      date: "2024-02-01",
      time: "11:20 AM",
      type: "project",
      tags: ["Database", "SQL"],
    },
    {
      id: 5,
      title: "JavaScript Array Methods",
      description: "Explored map, filter, reduce and other array operations",
      date: "2024-01-31",
      time: "3:00 PM",
      type: "conversation",
      tags: ["JavaScript", "Arrays"],
    },
    {
      id: 6,
      title: "Tailwind CSS Setup",
      description: "Configured Tailwind CSS in a new project",
      date: "2024-01-30",
      time: "9:30 AM",
      type: "tutorial",
      tags: ["Tailwind", "Setup"],
    },
  ];

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All" },
    { value: "conversation", label: "Conversations" },
    { value: "project", label: "Projects" },
    { value: "tutorial", label: "Tutorials" },
  ];

  const filteredHistory = historyData.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (
    type: "conversation" | "project" | "tutorial",
  ): string => {
    switch (type) {
      case "conversation":
        return "bg-blue-100 text-blue-700";
      case "project":
        return "bg-green-100 text-green-700";
      case "tutorial":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
        <div className="relative w-60 h-20 bg-green-500 font-bold text-white rounded-2xl transition-transform animate-bounce px-4 py-4">
          Feature Under work
          <span className="font-extrabold">!!</span>
          <img
            src={Time}
            alt="time_icon"
            className="absolute left-40 -bottom-10 w-[80px] h-[80px] rounded-full"
          />
        </div>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              History
            </h1>
            <p className="text-white">
              Browse your past conversations and projects
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 overflow-x-auto">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filter === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History Items */}
          <div className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 cursor-pointer border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}
                            >
                              {item.type.charAt(0).toUpperCase() +
                                item.type.slice(1)}
                            </span>
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No history found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
