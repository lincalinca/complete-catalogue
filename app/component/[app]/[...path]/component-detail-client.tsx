"use client";

import { ComponentPreview } from "@/components/component-preview";
import { ComponentInfo } from "@/lib/component-scanner";
import Link from "next/link";

interface ComponentDetailClientProps {
  component: ComponentInfo;
  fileContent: string;
  app: string;
  relativePath: string;
  fullPath: string;
  componentName: string;
}

export function ComponentDetailClient({
  component,
  fileContent,
  app,
  relativePath,
  fullPath,
  componentName,
}: ComponentDetailClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 border-b border-purple-500/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              ← Back to Catalogue
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {componentName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded text-xs text-purple-300 font-medium">
                  {app}
                </span>
                <span className="text-purple-400 text-sm font-mono">
                  {component.directory}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Preview Area */}
          <div className="lg:col-span-2">
            <ComponentPreview component={component} fileContent={fileContent} />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {/* File Info */}
            <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                File Info
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-purple-400">App:</span>{" "}
                  <span className="text-purple-200">{app}</span>
                </div>
                <div>
                  <span className="text-purple-400">Directory:</span>{" "}
                  <span className="text-purple-200 font-mono text-xs">
                    {component.directory}
                  </span>
                </div>
                <div>
                  <span className="text-purple-400">File:</span>{" "}
                  <span className="text-purple-200 font-mono text-xs block mt-1 break-all">
                    {relativePath}
                  </span>
                </div>
                <div>
                  <span className="text-purple-400">Has Props:</span>{" "}
                  <span className="text-purple-200">
                    {component.hasProps ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(fullPath);
                  }}
                  className="w-full px-4 py-2 bg-purple-500/10 border border-purple-500/50 rounded-lg text-sm text-purple-300 hover:bg-purple-500/20 transition-colors"
                >
                  Copy Full Path
                </button>
                <button
                  onClick={() => {
                    const importPath = `@/components${component.directory}/${componentName.toLowerCase()}`;
                    navigator.clipboard.writeText(
                      `import { ${componentName} } from '${importPath}';`
                    );
                  }}
                  className="w-full px-4 py-2 bg-blue-500/10 border border-blue-500/50 rounded-lg text-sm text-blue-300 hover:bg-blue-500/20 transition-colors"
                >
                  Copy Import
                </button>
              </div>
            </div>

            {/* Source Code */}
            <details className="bg-black/40 border border-purple-500/30 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer text-white hover:bg-purple-500/5 transition-colors">
                View Source Code
              </summary>
              <div className="p-4 border-t border-purple-500/20">
                <pre className="text-xs text-purple-200 bg-black/60 p-4 rounded overflow-x-auto max-h-[500px] overflow-y-auto">
                  {fileContent}
                </pre>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

