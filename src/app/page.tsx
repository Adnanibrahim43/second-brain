"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, Sparkles, Zap, Bot, Link as LinkIcon, FileText } from "lucide-react";
import { NoteModal } from "@/components/NoteModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import TypewriterTitle from "@/components/TypewriterTitle";

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      
      // SAFETY CHECK 1: Only set state if data is actually an array
      if (Array.isArray(data)) {
        setNotes(data);
        setFilteredNotes(data);
      } else {
        console.error("API did not return an array:", data);
        setNotes([]);
        setFilteredNotes([]);
      }
    } catch (error) {
      console.error("Failed to fetch notes", error);
      setNotes([]);
      setFilteredNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle Search & Filter Logic
  useEffect(() => {
    // SAFETY CHECK 2: Ensure we are filtering an array
    let result = Array.isArray(notes) ? notes : [];

    // 1. Filter by Type
    if (filter !== "ALL") {
      result = result.filter((note) => note.type === filter);
    }

    // 2. Filter by Search Text
    if (search) {
      const lowerSearch = search.toLowerCase().replace("#", "");
      
      result = result.filter((note) => {
        const titleMatch = (note.title || "").toLowerCase().includes(lowerSearch);
        const contentMatch = (note.content || "").toLowerCase().includes(lowerSearch);
        // Safely check Tags
        const tagsMatch = Array.isArray(note.tags) && note.tags.some((tag: string) => 
          tag.toLowerCase().includes(lowerSearch)
        );

        return titleMatch || contentMatch || tagsMatch;
      });
    }

    setFilteredNotes(result);
  }, [search, filter, notes]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "LINK": return <LinkIcon className="w-3 h-3 text-blue-400" />;
      case "INSIGHT": return <Sparkles className="w-3 h-3 text-yellow-400" />;
      default: return <FileText className="w-3 h-3 text-zinc-400" />;
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-[-1]" />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-zinc-800/50">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center gap-2 mb-2"
          >
            <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Second Brain
            </h1>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="mt-2 h-6"
          >
            <TypewriterTitle />
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/chat">
            <Button variant="ghost" className="hidden md:flex gap-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400">
              <Bot className="w-5 h-5" />
              Ask AI
            </Button>
          </Link>
          <Link href="/new">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-indigo-500/20">
                <Plus className="mr-2 h-4 w-4" /> Capture Idea
              </Button>
            </motion.div>
          </Link>
        </div>
      </header>

      {/* Sticky Controls Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="sticky top-4 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/50 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-sm dark:shadow-2xl items-center transition-colors"
      >
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
          <Input
            placeholder="Search thoughts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-100 dark:bg-zinc-900/50 border-transparent focus:bg-white dark:focus:bg-black focus:border-zinc-300 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 transition-all rounded-xl"
          />
        </div>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 hidden md:block mx-2 transition-colors" />

        <div className="flex gap-1 w-full md:w-auto overflow-x-auto p-1">
          {["ALL", "NOTE", "LINK", "INSIGHT"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === t 
                  ? "bg-zinc-900 dark:bg-zinc-800 text-white shadow-md" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500 mb-4" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Syncing with neural network...</p>
        </div>
      ) : !Array.isArray(filteredNotes) || filteredNotes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20 transition-colors"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 mb-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <Search className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-300">No thoughts found.</h3>
          <p className="text-zinc-500 dark:text-zinc-500 mt-2">Try adjusting your filters or capture a new idea.</p>
        </motion.div>
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {/* SAFETY CHECK 3: Ensure map is only called on arrays */}
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all shadow-sm"
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="bg-zinc-100 dark:bg-black/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] px-2 py-0.5 gap-1.5 h-6">
                    {getTypeIcon(note.type)}
                    {note.type}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mb-2 transition-colors">
                  {note.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 font-light leading-relaxed mb-4">
                  {note.summary || note.content}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                  {Array.isArray(note.tags) && note.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="text-[10px] px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800/50 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          isOpen={!!selectedNote}
          onClose={() => {
            setSelectedNote(null);
            fetchNotes();
          }}
        />
      )}
    </main>
  );
}