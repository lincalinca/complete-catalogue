/**
 * Component Detail Page
 * Shows individual component with preview and prop controls
 */

import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { ComponentDetailClient } from "./component-detail-client";

const APP_PATHS = {
  core: "/Users/linc/Dev-Work/Crescender/crescender-core/components",
  account:
    "/Users/linc/Dev-Work/Crescender/crescender-core/tmp/crescender-account/components",
  geargrabber:
    "/Users/linc/Dev-Work/Crescender/crescender-core/tmp/geargrabber/components",
  clavet: "/Users/linc/Dev-Work/Crescender/clavet/components",
};

interface PageProps {
  params: Promise<{
    app: string;
    path: string[];
  }>;
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { app, path: pathSegments } = await params;

  // Validate app
  if (!["core", "account", "geargrabber", "clavet"].includes(app)) {
    notFound();
  }

  // Reconstruct file path
  const basePath = APP_PATHS[app as keyof typeof APP_PATHS];
  const relativePath = pathSegments.join("/");
  const fullPath = path.join(basePath, relativePath);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  // Read file content
  const fileContent = fs.readFileSync(fullPath, "utf-8");

  // Extract component name from file
  const fileName = path.basename(fullPath, path.extname(fullPath));
  const componentName = fileName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const component = {
    name: componentName,
    path: fullPath,
    relativePath,
    app: app as "core" | "account" | "geargrabber" | "clavet",
    directory: "/" + path.dirname(relativePath),
    hasProps: /interface\s+\w+Props/.test(fileContent),
  };

  return (
    <ComponentDetailClient
      component={component}
      fileContent={fileContent}
      app={app}
      relativePath={relativePath}
      fullPath={fullPath}
      componentName={componentName}
    />
  );
}

