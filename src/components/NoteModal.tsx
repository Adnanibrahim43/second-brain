"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, X } from "lucide-react";
import { toast } from "sonner"; // Ensure you have this installed

interface NoteModalProps {
  note: any;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteModal({ note, isOpen, onClose }: NoteModalProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);

  // Reset state when modal opens/changes
  if (!isOpen) return null;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this thought?")) return;
    setLoading(true);
    await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    toast.success("Note deleted permanently");
    setLoading(false);
    onClose();
    router.refresh(); 
  }

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      body: JSON.stringify({ title, content }),
    });
    toast.success("Changes saved successfully");
    setLoading(false);
    setIsEditing(false);
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 1. DIALOG CONTENT: White in Light Mode, Zinc-950 in Dark Mode */}
      <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 sm:rounded-2xl transition-colors">
        
        <DialogHeader>
          <div className="flex justify-between items-center pr-8">
            {isEditing ? (
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-lg font-bold"
              />
            ) : (
              <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{title}</DialogTitle>
            )}
            
            <Badge variant="outline" className="border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 ml-2 shrink-0">
              {note.type}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* 2. AI SUMMARY: Light Gray Box in Light Mode, Dark Box in Dark Mode */}
          {!isEditing && note.summary && (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase font-semibold mb-1">AI Summary</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">{note.summary}</p>
            </div>
          )}

          {/* 3. MAIN CONTENT */}
          {isEditing ? (
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="min-h-[200px] text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
          )}

          {/* 4. TAGS */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
            {note.tags.map((tag: string) => (
              <Badge key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-transparent">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between sm:justify-between items-center gap-4">
          {/* Delete Button - Adaptive Red */}
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 border-none shadow-none"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading} className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-zinc-800 dark:hover:bg-zinc-700">
                Edit Note
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}