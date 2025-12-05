"use client";

import { useEffect, useState } from "react";
import { ComponentInfo } from "@/lib/component-scanner";

interface ApiResponse {
  success: boolean;
  data?: {
    components: ComponentInfo[];
    directories: string[];
    counts: Record<string, number>;
    total: number;
  };
  error?: string;
}

export default function CataloguePage() {
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedApp, setSelectedApp] = useState<string>("all");
  const [selectedDirectory, setSelectedDirectory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchComponents();
  }, []);

  async function fetchComponents() {
    try {
      setLoading(true);
      const response = await fetch("/api/components");
      const json: ApiResponse = await response.json();

      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to load components");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch components");
    } finally {
      setLoading(false);
    }
  }

  // Filter components
  const filteredComponents = data?.components.filter((component) => {
    if (selectedApp !== "all" && component.app !== selectedApp) return false;
    if (
      selectedDirectory !== "all" &&
      component.directory !== selectedDirectory
    )
      return false;
    if (
      searchQuery &&
      !component.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Scanning components...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-red-500 text-xl font-bold mb-2">Error</h2>
          <p className="text-white">{error}</p>
          <button
            onClick={fetchComponents}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 border-b border-purple-500/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Crescender Component Catalogue
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Universal UI component reference across all apps
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                {filteredComponents?.length || 0}
              </div>
              <div className="text-xs text-purple-300">
                of {data?.total || 0} components
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(data?.counts || {}).map(([app, count]) => (
            <div
              key={app}
              className={`bg-black/40 border rounded-lg p-4 cursor-pointer transition-all ${
                selectedApp === app
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-purple-500/30 hover:border-purple-500/50"
              }`}
              onClick={() =>
                setSelectedApp(selectedApp === app ? "all" : app)
              }
            >
              <div className="text-xs font-semibold text-purple-300 uppercase mb-1">
                {app}
              </div>
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-xs text-purple-400 mt-1">
                {selectedApp === app ? "✓ Selected" : "Click to filter"}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-black/40 border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Component name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* App Filter */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                App
              </label>
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Apps</option>
                <option value="core">Core</option>
                <option value="account">Account</option>
                <option value="geargrabber">GearGrabber</option>
                <option value="clavet">Clavet</option>
              </select>
            </div>

            {/* Directory Filter */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Directory
              </label>
              <select
                value={selectedDirectory}
                onChange={(e) => setSelectedDirectory(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Directories</option>
                {data?.directories.map((dir) => (
                  <option key={dir} value={dir}>
                    {dir}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedApp !== "all" ||
            selectedDirectory !== "all" ||
            searchQuery) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedApp !== "all" && (
                <button
                  onClick={() => setSelectedApp("all")}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-sm text-purple-300 hover:bg-purple-500/30"
                >
                  App: {selectedApp} ✕
                </button>
              )}
              {selectedDirectory !== "all" && (
                <button
                  onClick={() => setSelectedDirectory("all")}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-sm text-purple-300 hover:bg-purple-500/30"
                >
                  Dir: {selectedDirectory} ✕
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-sm text-purple-300 hover:bg-purple-500/30"
                >
                  Search: {searchQuery} ✕
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedApp("all");
                  setSelectedDirectory("all");
                  setSearchQuery("");
                }}
                className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-300 hover:bg-red-500/30"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComponents?.map((component) => (
            <div
              key={`${component.app}-${component.path}`}
              className="bg-black/40 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500 transition-all"
            >
              {/* Component Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {component.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded text-xs text-purple-300 font-medium">
                      {component.app}
                    </span>
                    {component.hasProps && (
                      <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-300">
                        Props
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Component Info */}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-purple-400">Directory:</span>{" "}
                  <span className="text-purple-200 font-mono text-xs">
                    {component.directory}
                  </span>
                </div>
                <div>
                  <span className="text-purple-400">File:</span>{" "}
                  <span className="text-purple-200 font-mono text-xs truncate block">
                    {component.relativePath}
                  </span>
                </div>
              </div>

              {/* Props Interface (if exists) */}
              {component.propsInterface && (
                <details className="mt-3">
                  <summary className="text-xs text-purple-400 cursor-pointer hover:text-purple-300">
                    Show Props Interface
                  </summary>
                  <pre className="mt-2 p-2 bg-black/60 border border-purple-500/20 rounded text-xs text-purple-200 overflow-x-auto">
                    {component.propsInterface}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-col gap-2">
                <a
                  href={`/component/${component.app}/${component.relativePath}`}
                  className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-xs text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center"
                >
                  View Preview & Props →
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(component.path);
                    }}
                    className="flex-1 px-3 py-1.5 bg-purple-500/10 border border-purple-500/50 rounded text-xs text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    Copy Path
                  </button>
                  <button
                    onClick={() => {
                      const importPath = `@/components${component.directory}/${component.name}`;
                      navigator.clipboard.writeText(
                        `import { ${component.name} } from '${importPath}';`
                      );
                    }}
                    className="flex-1 px-3 py-1.5 bg-blue-500/10 border border-blue-500/50 rounded text-xs text-blue-300 hover:bg-blue-500/20 transition-colors"
                  >
                    Copy Import
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredComponents?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-purple-400 text-xl mb-2">
              No components found
            </div>
            <p className="text-purple-300/60">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
