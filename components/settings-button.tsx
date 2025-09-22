"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SettingsButton() {
  return (
    <Link href="/settings">
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-sm border-gray-300/50 text-gray-800 hover:bg-white hover:text-gray-900 dark:bg-gray-800/90 dark:backdrop-blur-sm dark:border-gray-600/50 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition-all duration-200"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </Link>
  )
}
