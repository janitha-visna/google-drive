import { FileItem } from "@/lib/mockData";
import { FileCard } from "./FileCard";
import { Folder } from "lucide-react";

interface FileGridProps {
  items: FileItem[];
  onNavigate: (id: string) => void;
  onModify: (item: FileItem, action: "rename" | "trash" | "restore") => void;
  searchQuery: string;
}

export function FileGrid({
  items,
  onNavigate,
  onModify,
  searchQuery,
}: FileGridProps) {
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

  const folders = items.filter((i) => i.type === "folder");
  const files = items.filter((i) => i.type !== "folder");

  return (
    <div className="flex flex-col gap-6 pb-12">
      {folders.length > 0 && (
        <section>
          <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Folders
          </h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {folders.map((folder) => (
              <FileCard
                key={folder.id}
                item={folder}
                onNavigate={onNavigate}
                onModify={onModify}
              />
            ))}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section>
          <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Files
          </h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file) => (
              <FileCard key={file.id} item={file} onModify={onModify} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
