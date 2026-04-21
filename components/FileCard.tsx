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
  onModify?: (item: FileItem, action: 'rename' | 'trash' | 'restore') => void;
  layout?: 'grid' | 'list';
}

export function FileCard({ item, onNavigate, onModify, layout = 'grid' }: FileCardProps) {
  const isFolder = item.type === 'folder';
  
  const handleClick = () => {
    if (isFolder && onNavigate) {
      onNavigate(item.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  if (layout === 'list') {
    return (
      <div 
        onClick={handleClick}
        className={`group flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer last:border-0`}
      >
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:scale-105 transition-transform shrink-0">
            {getIconForType(item.type, "w-6 h-6")}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <h3 className="font-medium text-base text-zinc-900 dark:text-zinc-100 truncate" title={item.name}>
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
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onModify(item, 'rename'); }}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-600"
                      onClick={(e) => { e.stopPropagation(); onModify(item, 'trash'); }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Move to Trash
                    </DropdownMenuItem>
                  </>
                )}
                {item.isDeleted && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onModify(item, 'restore'); }}>
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
      className={`group relative flex flex-col p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer ${isFolder ? 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:scale-105 transition-transform">
          {getIconForType(item.type, "w-8 h-8")}
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
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onModify(item, 'rename'); }}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-600"
                      onClick={(e) => { e.stopPropagation(); onModify(item, 'trash'); }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Move to Trash
                    </DropdownMenuItem>
                  </>
                )}
                {item.isDeleted && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onModify(item, 'restore'); }}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1">
        <h3 className="font-medium text-base text-zinc-900 dark:text-zinc-100 truncate" title={item.name}>
          {item.name}
        </h3>
        <div className="flex items-center gap-2 mt-auto pt-2 text-sm text-zinc-500 dark:text-zinc-400">
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
  );
}
