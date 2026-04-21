"use client";

import { useState, useMemo } from "react";
import { FileItem, initialData } from "@/lib/mockData";
import { Header } from "./Header";
import { FileGrid } from "./FileGrid";

export function FileManager() {
  const [items, setItems] = useState<FileItem[]>(initialData);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // History tracking for back/forward navigation
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Helpers
  const currentFolder = useMemo(() => 
    items.find(i => i.id === currentFolderId) || null
  , [items, currentFolderId]);

  const breadcrumbPath = useMemo(() => {
    const path: FileItem[] = [];
    let current = currentFolder;
    while (current) {
      path.unshift(current);
      current = items.find(i => i.id === current?.parentId) || null;
    }
    return path;
  }, [items, currentFolder]);

  // Derived state for display
  const displayedItems = useMemo(() => {
    let filtered = items.filter(i => !i.isDeleted); // By default don't show deleted here
    
    // If we are searching, ignore folder constraints and just search by name
    if (searchQuery.trim() !== '') {
      return filtered.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Otherwise show items in current folder
    return filtered.filter(i => i.parentId === currentFolderId);
  }, [items, currentFolderId, searchQuery]);

  // Actions
  const handleNavigate = (id: string | null) => {
    // If navigating to the same directory, do nothing
    if (id === currentFolderId) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(id);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setCurrentFolderId(id);
    // Only clear search if we were deeply searching and decided to navigate
    setSearchQuery(""); 
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentFolderId(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentFolderId(history[newIndex]);
    }
  };

  const handleModify = (targetItem: FileItem, action: 'rename' | 'trash' | 'restore') => {
    if (action === 'trash') {
      setItems(prev => prev.map(i => i.id === targetItem.id ? { ...i, isDeleted: true } : i));
    } else if (action === 'restore') {
      setItems(prev => prev.map(i => i.id === targetItem.id ? { ...i, isDeleted: false } : i));
    } else if (action === 'rename') {
      const newName = window.prompt("Enter new name:", targetItem.name);
      if (newName && newName.trim() !== '') {
        setItems(prev => prev.map(i => i.id === targetItem.id ? { ...i, name: newName.trim() } : i));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        path={breadcrumbPath}
        currentFolder={currentFolder}
        folders={items}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
      />
      
      <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        {searchQuery ? (
          <div className="mb-6">
            <h1 className="text-xl font-medium">Search results for "{searchQuery}"</h1>
            <p className="text-zinc-500 text-sm">Showing matching files and folders</p>
          </div>
        ) : (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {currentFolder ? currentFolder.name : "Home"}
            </h1>
          </div>
        )}

        <FileGrid 
          items={displayedItems} 
          onNavigate={handleNavigate}
          onModify={handleModify}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
}
