import { Search, Plus, Upload, Bell, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { FolderDropdown } from "./FolderDropdown";
import { FileItem } from "@/lib/mockData";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  path: FileItem[];
  currentFolder: FileItem | null;
  folders: FileItem[];
  onNavigate: (id: string | null) => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  path, 
  currentFolder, 
  folders, 
  onNavigate,
  onBack,
  onForward,
  canGoBack,
  canGoForward
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full flex flex-col gap-4 px-4 py-3 md:px-8 md:py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-4 w-full">
        {/* Navigation & Brand */}
        <div className="flex items-center gap-1 sm:gap-2 pr-2">
          <div className="flex items-center gap-1 mr-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onBack} disabled={!canGoBack}>
              <ArrowLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onForward} disabled={!canGoForward}>
              <ArrowRight className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </Button>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
               <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">DriveUX</span>
          </div>
        </div>

        {/* Search Bar - flexible center */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search in Drive..." 
            className="pl-10 h-10 w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus-visible:ring-1 focus-visible:border-blue-500 transition-all rounded-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Button variant="outline" className="hidden sm:flex h-10 rounded-full gap-2 border-zinc-300">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
            <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </Button>

          <Avatar className="h-9 w-9 border border-zinc-200 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
            <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Second row: Breadcrumbs and Action Toolbar */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          <BreadcrumbNav path={path} onNavigate={onNavigate} />
          <FolderDropdown currentFolder={currentFolder} folders={folders} onNavigate={onNavigate} />
        </div>
        
        {/* Mobile Upload Button */}
        <Button size="sm" className="sm:hidden h-8 rounded-full gap-1 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New</span>
        </Button>
      </div>
    </header>
  );
}
