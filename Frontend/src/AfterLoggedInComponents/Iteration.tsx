import { useState } from "react";
import Time from "../assets/time.gif"

interface Iteration {
  id: number;
  version: string;
  title: string;
  description: string;
  date: string;
  time: string;
  author: string;
  status: 'active' | 'archived' | 'draft';
  changes: string[];
  fileCount: number;
}

export default function Iterations() {
  const [selectedIteration, setSelectedIteration] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const iterations: Iteration[] = [
    {
      id: 1,
      version: 'v3.2.1',
      title: 'Production Release - Major UI Overhaul',
      description: 'Complete redesign of the dashboard interface with improved user experience and performance optimizations.',
      date: '2024-02-04',
      time: '3:45 PM',
      author: 'John Doe',
      status: 'active',
      changes: [
        'Redesigned main dashboard layout',
        'Added dark mode support',
        'Improved loading times by 40%',
        'Fixed navigation menu bugs'
      ],
      fileCount: 24
    },
    {
      id: 2,
      version: 'v3.2.0',
      title: 'Feature Update - Analytics Dashboard',
      description: 'Added comprehensive analytics dashboard with real-time data visualization and export capabilities.',
      date: '2024-01-28',
      time: '11:20 AM',
      author: 'Jane Smith',
      status: 'archived',
      changes: [
        'Implemented analytics module',
        'Added chart components',
        'Created data export functionality',
        'Updated API endpoints'
      ],
      fileCount: 18
    },
    {
      id: 3,
      version: 'v3.1.5',
      title: 'Bug Fix Release',
      description: 'Critical bug fixes and minor improvements to enhance system stability.',
      date: '2024-01-15',
      time: '2:15 PM',
      author: 'Mike Johnson',
      status: 'archived',
      changes: [
        'Fixed authentication issues',
        'Resolved database connection errors',
        'Updated dependency versions',
        'Improved error handling'
      ],
      fileCount: 12
    },
    {
      id: 4,
      version: 'v3.1.4',
      title: 'Performance Optimization',
      description: 'Backend optimizations to improve response times and reduce server load.',
      date: '2024-01-05',
      time: '4:30 PM',
      author: 'Sarah Williams',
      status: 'archived',
      changes: [
        'Optimized database queries',
        'Implemented caching layer',
        'Reduced API response times',
        'Added request batching'
      ],
      fileCount: 15
    },
    {
      id: 5,
      version: 'v3.1.3-beta',
      title: 'Beta Testing - New Features',
      description: 'Beta version with experimental features for testing before production release.',
      date: '2023-12-20',
      time: '10:00 AM',
      author: 'John Doe',
      status: 'draft',
      changes: [
        'Added experimental AI features',
        'Testing new UI components',
        'Evaluating user feedback',
        'Performance benchmarking'
      ],
      fileCount: 8
    },
    {
      id: 6,
      version: 'v3.1.2',
      title: 'Security Patch',
      description: 'Important security updates and vulnerability fixes.',
      date: '2023-12-10',
      time: '9:00 AM',
      author: 'Mike Johnson',
      status: 'archived',
      changes: [
        'Patched security vulnerabilities',
        'Updated authentication system',
        'Enhanced data encryption',
        'Improved access controls'
      ],
      fileCount: 10
    }
  ];

  const getStatusColor = (status: 'active' | 'archived' | 'draft'): string => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: 'active' | 'archived' | 'draft') => {
    switch(status) {
      case 'active':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'archived':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'draft':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
    }
  };

  const filteredIterations = iterations.filter(item => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Project Iterations
            </h1>
            <p className="text-white">
              View and manage all previous versions and iterations
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by version, title, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

              {/* Status Filters */}
              <div className="flex gap-2 overflow-x-auto">
                {["all", "active", "archived", "draft"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filterStatus === status
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Iterations List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIterations.length > 0 ? (
              filteredIterations.map((iteration) => (
                <div
                  key={iteration.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 cursor-pointer ${
                    selectedIteration === iteration.id
                      ? "border-indigo-500 shadow-lg"
                      : "border-transparent"
                  }`}
                  onClick={() =>
                    setSelectedIteration(
                      selectedIteration === iteration.id ? null : iteration.id,
                    )
                  }
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 text-indigo-700 rounded-lg px-3 py-1.5 font-bold text-sm">
                          {iteration.version}
                        </div>
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(iteration.status)}`}
                        >
                          {getStatusIcon(iteration.status)}
                          <span>
                            {iteration.status.charAt(0).toUpperCase() +
                              iteration.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>{iteration.fileCount} files</span>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {iteration.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {iteration.description}
                    </p>

                    {/* Changes - Only shown when selected */}
                    {selectedIteration === iteration.id && (
                      <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                          Changes:
                        </h4>
                        <ul className="space-y-1.5">
                          {iteration.changes.map((change, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <svg
                                className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {iteration.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{iteration.author}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
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
                          <span>{iteration.date}</span>
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
                          <span>{iteration.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Only shown when selected */}
                    {selectedIteration === iteration.id && (
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Restore
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white rounded-xl shadow-sm p-12 text-center">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No iterations found
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