import { FileItem } from "@/lib/mockData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { Home } from "lucide-react";

interface BreadcrumbNavProps {
  path: FileItem[];
  onNavigate: (id: string | null) => void;
}

export function BreadcrumbNav({ path, onNavigate }: BreadcrumbNavProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate(null); }}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:ml-1 text-sm font-medium">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {path.map((folder, index) => {
          const isLast = index === path.length - 1;
          
          return (
            <Fragment key={folder.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-blue-900 dark:text-blue-400">
                    {folder.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); onNavigate(folder.id); }}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
