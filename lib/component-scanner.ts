/**
 * Component Scanner
 * Automatically discovers all React components across the Crescender ecosystem
 */

import fs from "fs";
import path from "path";

export interface ComponentInfo {
  name: string;
  path: string;
  relativePath: string;
  app: "core" | "account" | "clavet" | "geargrabber";
  directory: string;
  hasProps: boolean;
  propsInterface?: string;
  uiCharacteristics: {
    hasTailwind: boolean;
    hasStyledComponents: boolean;
    hasCssModules: boolean;
    hasInlineStyles: boolean;
    isUiComponent: boolean; // Any of the above
  };
}

const APP_PATHS = {
  core: "/Users/linc/Dev-Work/Crescender/crescender-core/components",
  account:
    "/Users/linc/Dev-Work/Crescender/crescender-core/tmp/crescender-account/components",
  geargrabber:
    "/Users/linc/Dev-Work/Crescender/crescender-core/tmp/geargrabber/components",
  clavet: "/Users/linc/Dev-Work/Crescender/clavet/components",
};

/**
 * Check if a file is a React component
 */
function isComponentFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  if (![".tsx", ".jsx"].includes(ext)) return false;

  // Exclude certain patterns
  const fileName = path.basename(filePath);
  if (fileName.startsWith(".")) return false;
  if (fileName.includes(".test.")) return false;
  if (fileName.includes(".spec.")) return false;
  if (fileName.includes(".stories.")) return false;

  return true;
}

/**
 * Extract component name from file
 */
function getComponentName(filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));

  // Convert kebab-case or snake_case to PascalCase for display
  return fileName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Check if component has props by looking for interface/type definitions
 */
function hasPropsInterface(content: string): boolean {
  return (
    /interface\s+\w+Props/.test(content) || /type\s+\w+Props\s*=/.test(content)
  );
}

/**
 * Analyze UI characteristics of a component
 */
function analyzeUiCharacteristics(content: string) {
  // Check for Tailwind classes (className with common Tailwind patterns)
  const hasTailwind = /className=["'`][^"'`]*(bg-|text-|flex|grid|p-|m-|rounded|border|shadow|hover:|focus:)/i.test(content);
  
  // Check for styled-components
  const hasStyledComponents = /styled\.\w+/.test(content) || /import.*styled.*from.*styled-components/.test(content);
  
  // Check for CSS modules
  const hasCssModules = /import.*styles.*from.*\.module\.(css|scss|sass)/.test(content) || /styles\.\w+/.test(content);
  
  // Check for inline styles
  const hasInlineStyles = /style=\{\{/.test(content);
  
  // Determine if this is a UI component (has any styling)
  const isUiComponent = hasTailwind || hasStyledComponents || hasCssModules || hasInlineStyles;
  
  return {
    hasTailwind,
    hasStyledComponents,
    hasCssModules,
    hasInlineStyles,
    isUiComponent,
  };
}

/**
 * Extract props interface from component file
 */
function extractPropsInterface(content: string): string | undefined {
  const interfaceMatch = content.match(
    /(?:export\s+)?interface\s+(\w+Props)\s*{([^}]*)}/s
  );
  if (interfaceMatch) {
    return `interface ${interfaceMatch[1]} {${interfaceMatch[2]}}`;
  }

  const typeMatch = content.match(
    /(?:export\s+)?type\s+(\w+Props)\s*=\s*{([^}]*)}/s
  );
  if (typeMatch) {
    return `type ${typeMatch[1]} = {${typeMatch[2]}}`;
  }

  return undefined;
}

/**
 * Recursively scan directory for components
 */
function scanDirectory(
  dir: string,
  app: ComponentInfo["app"],
  basePath: string,
  components: ComponentInfo[] = []
): ComponentInfo[] {
  if (!fs.existsSync(dir)) {
    console.warn(`[Scanner] Directory not found: ${dir}`);
    return components;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (
        ["node_modules", ".next", "dist", "build", "__tests__"].includes(
          entry.name
        )
      ) {
        continue;
      }
      scanDirectory(fullPath, app, basePath, components);
    } else if (entry.isFile() && isComponentFile(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        const relativePath = path.relative(basePath, fullPath);
        const directory = path.dirname(relativePath);

        components.push({
          name: getComponentName(fullPath),
          path: fullPath,
          relativePath,
          app,
          directory: directory === "." ? "/" : `/${directory}`,
          hasProps: hasPropsInterface(content),
          propsInterface: extractPropsInterface(content),
          uiCharacteristics: analyzeUiCharacteristics(content),
        });
      } catch (error) {
        console.error(`[Scanner] Error reading ${fullPath}:`, error);
      }
    }
  }

  return components;
}

/**
 * Scan all apps for components
 */
export function scanAllComponents(): ComponentInfo[] {
  const allComponents: ComponentInfo[] = [];

  console.log("[Scanner] Starting component scan...");

  for (const [app, basePath] of Object.entries(APP_PATHS)) {
    console.log(`[Scanner] Scanning ${app}...`);
    const components = scanDirectory(
      basePath,
      app as ComponentInfo["app"],
      basePath
    );
    allComponents.push(...components);
    console.log(`[Scanner] Found ${components.length} components in ${app}`);
  }

  console.log(
    `[Scanner] Complete! Found ${allComponents.length} total components`
  );

  return allComponents.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get unique directories across all apps
 */
export function getUniqueDirectories(components: ComponentInfo[]): string[] {
  const directories = new Set(components.map((c) => c.directory));
  return Array.from(directories).sort();
}

/**
 * Get component count by app
 */
export function getComponentCountByApp(
  components: ComponentInfo[]
): Record<string, number> {
  return components.reduce(
    (acc, component) => {
      acc[component.app] = (acc[component.app] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

