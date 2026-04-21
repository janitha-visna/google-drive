export type ItemType = 'folder' | 'pdf' | 'spreadsheet' | 'document' | 'image' | 'video' | 'archive' | 'unknown';

export interface FileItem {
  id: string;
  name: string;
  type: ItemType;
  lastModified: string;
  size?: string;
  parentId: string | null;
  isDeleted: boolean;
}

export const initialData: FileItem[] = [
  // Root level
  { id: '1', name: 'Projects', type: 'folder', lastModified: '2026-04-01T10:00:00Z', parentId: null, isDeleted: false },
  { id: '2', name: 'Personal', type: 'folder', lastModified: '2026-03-15T08:30:00Z', parentId: null, isDeleted: false },
  { id: '3', name: 'Work', type: 'folder', lastModified: '2026-04-05T14:20:00Z', parentId: null, isDeleted: false },
  { id: '4', name: 'Getting Started.pdf', type: 'pdf', lastModified: '2026-01-10T09:00:00Z', size: '1.2 MB', parentId: null, isDeleted: false },

  // Inside Projects
  { id: '11', name: 'UI Designs', type: 'folder', lastModified: '2026-04-08T11:15:00Z', parentId: '1', isDeleted: false },
  { id: '12', name: 'Backend Docs', type: 'folder', lastModified: '2026-04-02T16:45:00Z', parentId: '1', isDeleted: false },
  
  // Inside Personal
  { id: '21', name: 'Vacation Photos', type: 'folder', lastModified: '2026-02-20T10:00:00Z', parentId: '2', isDeleted: false },
  { id: '22', name: 'Budget 2026.xlsx', type: 'spreadsheet', lastModified: '2026-01-05T12:00:00Z', size: '540 KB', parentId: '2', isDeleted: false },

  // Inside UI Designs (Project)
  { id: '111', name: 'App Mockup.png', type: 'image', lastModified: '2026-04-09T09:30:00Z', size: '2.4 MB', parentId: '11', isDeleted: false },
  { id: '112', name: 'Design System.pdf', type: 'pdf', lastModified: '2026-04-07T14:10:00Z', size: '5.1 MB', parentId: '11', isDeleted: false },
  { id: '113', name: 'Logo Ideas.zip', type: 'archive', lastModified: '2026-04-06T11:00:00Z', size: '12.8 MB', parentId: '11', isDeleted: false },

  // Inside Work
  { id: '31', name: 'Q1 Review.docx', type: 'document', lastModified: '2026-04-01T15:20:00Z', size: '800 KB', parentId: '3', isDeleted: false },
  { id: '32', name: 'Product Demo.mp4', type: 'video', lastModified: '2026-03-28T09:45:00Z', size: '145 MB', parentId: '3', isDeleted: false },
  
  // Deleted Items
  { id: '99', name: 'Old Report.pdf', type: 'pdf', lastModified: '2025-12-01T10:00:00Z', size: '900 KB', parentId: '3', isDeleted: true },
  { id: '100', name: 'Discarded Layout.png', type: 'image', lastModified: '2025-11-15T08:00:00Z', size: '1.5 MB', parentId: '11', isDeleted: true },
];
