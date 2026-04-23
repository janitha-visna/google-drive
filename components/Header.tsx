import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-200 bg-white/80 px-4 pt-5 pb-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 md:px-8">
      <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="relative flex min-h-[52px] items-start">
          <div className="hidden sm:flex items-center gap-2 pr-2">
            
            
          </div>

          <div className="absolute left-1/2 top-0 w-full max-w-2xl -translate-x-1/2 px-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search in Drive..."
                className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-100 pl-11 pr-4 transition-all focus-visible:border-blue-500 focus-visible:ring-1 dark:border-zinc-800 dark:bg-zinc-900"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <BreadcrumbNav path={path} onNavigate={onNavigate} />
            <FolderDropdown
              currentFolder={currentFolder}
              folders={folders}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
