"use client";

import { useState, useEffect } from "react";
import { ComponentInfo } from "@/lib/component-scanner";
import {
  parsePropsFromContent,
  generateInitialProps,
  getControlType,
  PropDefinition,
} from "@/lib/component-renderer";
import { LiveComponentPreview } from "./live-component-preview";

interface ComponentPreviewProps {
  component: ComponentInfo;
  fileContent: string;
}

export function ComponentPreview({
  component,
  fileContent,
}: ComponentPreviewProps) {
  const [props, setProps] = useState<PropDefinition[]>([]);
  const [componentProps, setComponentProps] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [showProps, setShowProps] = useState(true);

  useEffect(() => {
    try {
      const parsedProps = parsePropsFromContent(fileContent);
      setProps(parsedProps);
      setComponentProps(generateInitialProps(parsedProps));
      setError(null);
    } catch (err) {
      console.error("[ComponentPreview] Error parsing props:", err);
      setError(err instanceof Error ? err.message : "Failed to parse props");
    }
  }, [fileContent]);

  const updateProp = (name: string, value: any) => {
    setComponentProps((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderControl = (prop: PropDefinition) => {
    const control = getControlType(prop.type);
    const value = componentProps[prop.name];

    const baseClasses =
      "w-full px-3 py-2 bg-black/60 border border-purple-500/30 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none";

    switch (control.type) {
      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateProp(prop.name, e.target.checked)}
              className="w-4 h-4 rounded border-purple-500/30 bg-black/60 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-sm text-purple-300">
              {value ? "true" : "false"}
            </span>
          </label>
        );

      case "number":
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => updateProp(prop.name, Number(e.target.value))}
            className={baseClasses}
          />
        );

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => updateProp(prop.name, e.target.value)}
            className={baseClasses}
          >
            <option value="">Select...</option>
            {control.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => updateProp(prop.name, e.target.value)}
            className={`${baseClasses} min-h-[80px]`}
            placeholder="Enter text or HTML..."
          />
        );

      case "color":
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => updateProp(prop.name, e.target.value)}
              className="h-10 w-20 rounded border border-purple-500/30 bg-black/60 cursor-pointer"
            />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => updateProp(prop.name, e.target.value)}
              className={baseClasses}
              placeholder="#000000"
            />
          </div>
        );

      case "text":
      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => updateProp(prop.name, e.target.value)}
            className={baseClasses}
            placeholder="Enter value..."
          />
        );
    }
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
        <p className="text-red-400 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <div className="bg-black/40 border border-purple-500/30 rounded-lg p-8">
        <LiveComponentPreview
          component={component}
          fileContent={fileContent}
          componentProps={componentProps}
        />
      </div>

      {/* Props Controls */}
      {props.length > 0 && (
        <div className="bg-black/40 border border-purple-500/30 rounded-lg">
          <button
            onClick={() => setShowProps(!showProps)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-purple-500/5 transition-colors"
          >
            <span className="text-purple-300 font-medium">
              Props Controls ({props.length})
            </span>
            <svg
              className={`w-5 h-5 text-purple-400 transition-transform ${
                showProps ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showProps && (
            <div className="p-4 space-y-4 border-t border-purple-500/20">
              {props.map((prop) => (
                <div key={prop.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-purple-300">
                      {prop.name}
                    </label>
                    {prop.required && (
                      <span className="text-xs text-red-400">*</span>
                    )}
                    <span className="text-xs text-purple-400/60 font-mono">
                      {prop.type}
                    </span>
                  </div>
                  {renderControl(prop)}
                </div>
              ))}

              {/* Reset Button */}
              <button
                onClick={() =>
                  setComponentProps(generateInitialProps(props))
                }
                className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-sm text-purple-300 hover:bg-purple-500/30 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          )}
        </div>
      )}

      {/* Props JSON */}
      <details className="bg-black/40 border border-purple-500/30 rounded-lg">
        <summary className="px-4 py-3 cursor-pointer text-purple-300 hover:bg-purple-500/5 transition-colors">
          View Props JSON
        </summary>
        <div className="p-4 border-t border-purple-500/20">
          <pre className="text-xs text-purple-200 bg-black/60 p-4 rounded overflow-x-auto">
            {JSON.stringify(componentProps, null, 2)}
          </pre>
        </div>
      </details>

      {/* Usage Example */}
      <details className="bg-black/40 border border-purple-500/30 rounded-lg">
        <summary className="px-4 py-3 cursor-pointer text-purple-300 hover:bg-purple-500/5 transition-colors">
          Usage Example
        </summary>
        <div className="p-4 border-t border-purple-500/20">
          <pre className="text-xs text-purple-200 bg-black/60 p-4 rounded overflow-x-auto">
            {`import { ${component.name} } from '@/components${component.directory}/${component.name.toLowerCase()}';

<${component.name}${
              Object.keys(componentProps).length > 0
                ? "\n" +
                  Object.entries(componentProps)
                    .map(([key, value]) => {
                      if (typeof value === "string") {
                        return `  ${key}="${value}"`;
                      }
                      return `  ${key}={${JSON.stringify(value)}}`;
                    })
                    .join("\n") +
                  "\n"
                : " "
            }/>`}
          </pre>
        </div>
      </details>
    </div>
  );
}

