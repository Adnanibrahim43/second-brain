"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, X } from "lucide-react"; 
import { motion } from "framer-motion";
import { toast } from "sonner"; 

export default function NewNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!content) return;
    setLoading(true);

    try {
      await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
      
      toast.success("Thought captured!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save thought.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // 1. CONTAINER: Adapts to background color (White vs Black)
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 relative transition-colors">
      
      {/* Background click to cancel */}
      <Link href="/" className="absolute inset-0 z-0 cursor-default" aria-label="Cancel" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg z-10"
      >
        {/* 2. CARD: White card in Light Mode, Dark Zinc in Dark Mode */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xl relative overflow-hidden transition-colors">
          
          {/* Close Button */}
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full h-8 w-8 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </Button>
          </Link>

          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <CardTitle>Capture Thought</CardTitle>
            </div>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              AI will automatically tag and summarize this for you.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase ml-1">Title</label>
              {/* 3. INPUTS: Light Gray in Light Mode, Dark Black in Dark Mode */}
              <Input
                placeholder="e.g. React Hooks vs Context"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase ml-1">Content</label>
              <Textarea
                placeholder="Jot down your raw thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-indigo-500 transition-colors resize-none font-light"
              />
            </div>
          </CardContent>
          
          <CardFooter className="grid grid-cols-2 gap-4">
            <Link href="/" className="w-full block">
              <Button 
                variant="outline" 
                type="button" 
                className="w-full border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
            </Link>
            
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !content} 
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processing...
                </>
              ) : (
                "Save to Brain"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}