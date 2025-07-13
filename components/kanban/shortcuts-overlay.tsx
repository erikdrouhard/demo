"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Keyboard } from "lucide-react";
import { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts";

interface ShortcutsOverlayProps {
  shortcuts: Record<string, KeyboardShortcut[]>;
}

function formatShortcut(shortcut: KeyboardShortcut): string {
  const keys: string[] = [];
  
  if (shortcut.metaKey) keys.push("⌘");
  if (shortcut.ctrlKey) keys.push("Ctrl");
  if (shortcut.altKey) keys.push("Alt");
  if (shortcut.shiftKey) keys.push("⇧");
  
  keys.push(shortcut.key.toUpperCase());
  
  return keys.join(" + ");
}

export function ShortcutsOverlay({ shortcuts }: ShortcutsOverlayProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border shadow-lg"
        title="Keyboard Shortcuts (? to toggle)"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {Object.entries(shortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {shortcut.description}
                      </span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {formatShortcut(shortcut)}
                      </Badge>
                    </div>
                  ))}
                </div>
                {Object.keys(shortcuts).indexOf(category) < Object.keys(shortcuts).length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Pro tip:</strong> Press <Badge variant="outline" className="font-mono mx-1">?</Badge> 
              to toggle this help overlay anytime!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}