import { FileItem } from "@/lib/mockData";
import { FileCard } from "./FileCard";
import { Folder } from "lucide-react";

interface FileGridProps {
  items: FileItem[];
  onNavigate: (id: string) => void;
  onModify: (item: FileItem, action: 'rename' | 'trash' | 'restore') => void;
  searchQuery: string;
}

export function FileGrid({ items, onNavigate, onModify, searchQuery }: FileGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500">
        <Folder className="w-16 h-16 mb-4 text-zinc-200 dark:text-zinc-800" />
        <h2 className="text-xl font-semibold mb-2">No files here</h2>
        {searchQuery ? (
          <p>We couldn't find anything matching "{searchQuery}".</p>
        ) : (
          <p>Upload files or create folders to get started.</p>
        )}
      </div>
    );
  }

  // Separate folders and files
  const folders = items.filter(i => i.type === 'folder');
  const files = items.filter(i => i.type !== 'folder');

  return (
    <div className="flex flex-col gap-8 pb-12">
      {folders.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-1">Folders</h2>
          <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 shadow-sm">
            {folders.map(folder => (
              <FileCard 
                key={folder.id} 
                item={folder} 
                onNavigate={onNavigate} 
                onModify={onModify}
                layout="list"
              />
            ))}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-1">Files</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {files.map(file => (
              <FileCard 
                key={file.id} 
                item={file} 
                onModify={onModify}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
