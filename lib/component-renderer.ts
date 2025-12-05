/**
 * Component Renderer
 * Dynamically imports and renders components from their source locations
 */

import { ComponentInfo } from "./component-scanner";

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

/**
 * Parse props interface from component file content
 */
export function parsePropsFromContent(content: string): PropDefinition[] {
  const props: PropDefinition[] = [];

  // Match interface or type definition
  const interfaceMatch = content.match(
    /(?:export\s+)?(?:interface|type)\s+\w+Props\s*=?\s*{([^}]*)}/s
  );

  if (!interfaceMatch) return props;

  const propsContent = interfaceMatch[1];
  
  // Parse individual prop definitions
  // Matches patterns like: propName?: string; or propName: number;
  const propRegex = /(\w+)(\?)?:\s*([^;]+);/g;
  let match;

  while ((match = propRegex.exec(propsContent)) !== null) {
    const [, name, optional, type] = match;
    props.push({
      name,
      type: type.trim(),
      required: !optional,
    });
  }

  return props;
}

/**
 * Generate default value for a prop type
 */
export function getDefaultValueForType(type: string): any {
  // Handle common patterns
  if (type === "string") return "";
  if (type === "number") return 0;
  if (type === "boolean") return false;
  if (type.includes("[]")) return [];
  if (type.includes("() =>")) return () => {};
  if (type.includes("ReactNode")) return null;
  if (type.includes("| undefined")) return undefined;
  if (type.includes("| null")) return null;
  
  // Try to extract union types
  if (type.includes("|")) {
    const parts = type.split("|").map((p) => p.trim());
    // Return first non-undefined/null option
    for (const part of parts) {
      if (part !== "undefined" && part !== "null") {
        // If it's a string literal
        if (part.startsWith('"') || part.startsWith("'")) {
          return part.slice(1, -1);
        }
      }
    }
  }

  return undefined;
}

/**
 * Get control type for a prop
 */
export function getControlType(type: string): {
  type: "text" | "number" | "boolean" | "select" | "textarea" | "color";
  options?: string[];
} {
  if (type === "boolean") return { type: "boolean" };
  if (type === "number") return { type: "number" };
  if (type.includes("ReactNode") || type.includes("JSX.Element")) {
    return { type: "textarea" };
  }
  if (type.includes("color") || type.includes("Color")) {
    return { type: "color" };
  }
  
  // Check for union types (enums)
  if (type.includes("|") && type.includes('"')) {
    const options = type
      .split("|")
      .map((p) => p.trim())
      .filter((p) => p.startsWith('"') || p.startsWith("'"))
      .map((p) => p.slice(1, -1));
    
    if (options.length > 0) {
      return { type: "select", options };
    }
  }

  return { type: "text" };
}

/**
 * Generate initial props state for a component
 */
export function generateInitialProps(
  props: PropDefinition[]
): Record<string, any> {
  const initialProps: Record<string, any> = {};

  for (const prop of props) {
    if (!prop.required) continue; // Skip optional props initially
    initialProps[prop.name] = getDefaultValueForType(prop.type);
  }

  return initialProps;
}

