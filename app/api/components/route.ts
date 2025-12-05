/**
 * API Route: Get all components
 * Returns the complete list of discovered components
 */

import { NextResponse } from "next/server";
import { scanAllComponents, getUniqueDirectories, getComponentCountByApp } from "@/lib/component-scanner";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const components = scanAllComponents();
    const directories = getUniqueDirectories(components);
    const counts = getComponentCountByApp(components);

    return NextResponse.json({
      success: true,
      data: {
        components,
        directories,
        counts,
        total: components.length,
      },
    });
  } catch (error) {
    console.error("[API] Error scanning components:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to scan components",
      },
      { status: 500 }
    );
  }
}

