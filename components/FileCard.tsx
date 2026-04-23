import { FileItem } from "@/lib/mockData";
import { getIconForType } from "./icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Edit2, RotateCcw, Eye } from "lucide-react";

interface FileCardProps {
  item: FileItem;
  onNavigate?: (id: string) => void;
  onModify?: (item: FileItem, action: "rename" | "trash" | "restore") => void;
  layout?: "grid" | "list";
}

export function FileCard({
  item,
  onNavigate,
  onModify,
  layout = "grid",
}: FileCardProps) {
  const isFolder = item.type === "folder";

  const handleClick = () => {
    if (isFolder && onNavigate) {
      onNavigate(item.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  if (layout === "list") {
    return (
      <div
        onClick={handleClick}
        className="group flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer last:border-0"
      >
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:scale-105 transition-transform shrink-0">
            {getIconForType(item.type, "w-6 h-6")}
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            <h3
              className="font-medium text-base text-zinc-900 dark:text-zinc-100 truncate"
              title={item.name}
            >
              {item.name}
            </h3>

            <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="truncate">{formatDate(item.lastModified)}</span>
              {item.size && (
                <>
                  <span>•</span>
                  <span>{item.size}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {onModify && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all ml-2 shrink-0">
                <MoreVertical className="w-5 h-5 text-zinc-500" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {!item.isDeleted && (
                  <>
                    {!isFolder && (
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onModify(item, "rename");
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onModify(item, "trash");
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Move to Trash
                    </DropdownMenuItem>
                  </>
                )}

                {item.isDeleted && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onModify(item, "restore");
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all cursor-pointer hover:shadow-md ${
        isFolder
          ? "p-4 min-h-[120px] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
          : "p-4 min-h-[170px]"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`rounded-xl transition-transform group-hover:scale-105 ${
            isFolder
              ? "p-2 bg-blue-50 dark:bg-blue-950/40"
              : "p-2.5 bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          {getIconForType(item.type, isFolder ? "w-9 h-9" : "w-8 h-8")}
        </div>

        {onModify && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">
                <MoreVertical className="w-5 h-5 text-zinc-500" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {!item.isDeleted && (
                  <>
                    {!isFolder && (
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onModify(item, "rename");
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onModify(item, "trash");
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Move to Trash
                    </DropdownMenuItem>
                  </>
                )}

                {item.isDeleted && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onModify(item, "restore");
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <h3
          className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2"
          title={item.name}
        >
          {item.name}
        </h3>

        <div className="mt-auto pt-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="truncate block">
            {formatDate(item.lastModified)}
          </span>
          {item.size && (
            <span className="truncate block mt-1">{item.size}</span>
          )}
        </div>
      </div>
    </div>
  );
}
