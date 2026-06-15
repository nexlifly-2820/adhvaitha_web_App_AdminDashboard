import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebsiteManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
          <span className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">🌐</span>
          Website Management
        </h2>
        <p className="text-slate-500 text-lg">
          Control website metadata, pages, layout configuration, and article postings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Workspace Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">✨</span>
              Settings Workspace
            </CardTitle>
            <CardDescription>
              Configure global website layout and themes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 dark:text-slate-400">
              This section is reserved for Website management features.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
