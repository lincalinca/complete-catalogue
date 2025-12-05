"use client";

import { useState, useEffect, useMemo } from "react";
import { ComponentInfo } from "@/lib/component-scanner";

interface LiveComponentPreviewProps {
  component: ComponentInfo;
  fileContent: string;
  componentProps: Record<string, any>;
}

export function LiveComponentPreview({
  component,
  fileContent,
  componentProps,
}: LiveComponentPreviewProps) {
  const [error, setError] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<"mock" | "code">("mock");

  // Generate component code
  const componentCode = useMemo(() => {
    const propsString = Object.entries(componentProps)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}="${value}"`;
        }
        if (typeof value === "boolean") {
          return value ? key : "";
        }
        if (typeof value === "number") {
          return `${key}={${value}}`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(" ");

    return `<${component.name}${propsString ? " " + propsString : ""} />`;
  }, [component.name, componentProps]);

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setRenderMode("mock")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            renderMode === "mock"
              ? "bg-purple-500 text-white"
              : "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          }`}
        >
          Mock Preview
        </button>
        <button
          onClick={() => setRenderMode("code")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            renderMode === "code"
              ? "bg-purple-500 text-white"
              : "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          }`}
        >
          Code View
        </button>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-lg p-8 min-h-[300px]">
        {renderMode === "mock" ? (
          <MockComponentDisplay
            component={component}
            props={componentProps}
          />
        ) : (
          <CodeDisplay code={componentCode} />
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

function MockComponentDisplay({
  component,
  props,
}: {
  component: ComponentInfo;
  props: Record<string, any>;
}) {
  // Generate a visual representation based on component name patterns
  const componentType = component.name.toLowerCase();

  if (componentType.includes("button")) {
    return (
      <button
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg"
        disabled={props.disabled}
      >
        {props.children || props.label || "Button"}
      </button>
    );
  }

  if (componentType.includes("card")) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 shadow-sm max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {props.title || "Card Title"}
        </h3>
        <p className="text-gray-600">
          {props.description || props.children || "Card content goes here"}
        </p>
      </div>
    );
  }

  if (componentType.includes("input")) {
    return (
      <div className="max-w-md">
        {props.label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {props.label}
          </label>
        )}
        <input
          type={props.type || "text"}
          placeholder={props.placeholder || "Enter text..."}
          disabled={props.disabled}
          value={props.value || ""}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
    );
  }

  if (componentType.includes("badge")) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
        {props.children || props.label || "Badge"}
      </span>
    );
  }

  if (componentType.includes("alert")) {
    return (
      <div className="max-w-md border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-purple-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">
              {props.title || "Alert"}
            </h3>
            <div className="mt-2 text-sm text-purple-700">
              {props.description || props.children || "Alert message"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generic component display
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="text-gray-900 font-semibold text-lg mb-2">
        {component.name}
      </div>
      <div className="text-gray-600 text-sm mb-4">
        {component.app} / {component.directory}
      </div>
      {Object.keys(props).length > 0 && (
        <div className="bg-gray-100 rounded-lg p-4 text-left">
          <div className="text-xs text-gray-500 mb-2 font-medium">Props:</div>
          <pre className="text-xs text-gray-700 overflow-x-auto">
            {JSON.stringify(props, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function CodeDisplay({ code }: { code: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <pre className="text-sm text-green-400 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

