"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";

interface FolderItem {
  Prefix: string;
}

interface FileItem {
  Key: string;
}

interface FilesResponse {
  folders: FolderItem[];
  files: FileItem[];
}

type ExplorerItem =
  | {
      type: "folder";
      name: string;
      key: string;
      raw: FolderItem;
    }
  | {
      type: "file";
      name: string;
      key: string;
      raw: FileItem;
    };

export default function FileExplorerPage() {
  const [path, setPath] = useState<string>("");
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [newFolder, setNewFolder] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [creatingFolder, setCreatingFolder] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const fetchFiles = async (): Promise<void> => {
    try {
      setLoading(true);

      const res = await axios.get<FilesResponse>(
        "http://localhost:5000/files",
        {
          params: { prefix: path },
        }
      );

      setFolders(res.data.folders || []);
      setFiles(res.data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [path]);

  const openFolder = (folder: FolderItem): void => {
    setPath(folder.Prefix);
  };

  const goBack = (): void => {
    const parts = path.split("/").filter(Boolean);
    parts.pop();
    setPath(parts.length ? `${parts.join("/")}/` : "");
  };

  const createFolder = async (): Promise<void> => {
    if (!newFolder.trim()) return;

    try {
      setCreatingFolder(true);

      await axios.post("http://localhost:5000/create-folder", {
        folderName: newFolder.trim(),
        parent: path,
      });

      setNewFolder("");
      fetchFiles();
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    } finally {
      setCreatingFolder(false);
    }
  };

  const deleteItem = async (key: string, isFolder: boolean): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${isFolder ? "folder" : "file"}?`
    );

    if (!confirmed) return;

    try {
      setDeletingKey(key);

      await axios.post("http://localhost:5000/delete", {
        key,
        isFolder,
      });

      fetchFiles();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed");
    } finally {
      setDeletingKey(null);
    }
  };

  const uploadFiles = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      formData.append(
        "files",
        file,
        (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
          file.name
      );
    }

    formData.append("parent", path);

    try {
      setUploading(true);

      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      e.target.value = "";
      fetchFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openFile = async (key: string) => {
    try {
      const res = await axios.get("http://localhost:5000/view-file", {
        params: { key },
      });

      const url = res.data.url;

      window.open(url, "_blank"); // open in new tab
    } catch (error) {
      console.error("Failed to open file:", error);
      alert("Cannot open file");
    }
  };

  const items = useMemo<ExplorerItem[]>(() => {
    const folderItems: ExplorerItem[] = folders.map((folder) => ({
      type: "folder",
      name: folder.Prefix.replace(path, ""),
      key: folder.Prefix,
      raw: folder,
    }));

    const fileItems: ExplorerItem[] = files
      .filter((file) => file.Key !== path)
      .map((file) => ({
        type: "file",
        name: file.Key.replace(path, ""),
        key: file.Key,
        raw: file,
      }));

    return [...folderItems, ...fileItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [folders, files, path]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const breadcrumbParts = path.split("/").filter(Boolean);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px 20px",
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                File Explorer
              </h1>
              <p
                style={{
                  margin: "6px 0 0 0",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Browse, create, upload, and manage your files
              </p>
            </div>

            <button
              onClick={goBack}
              disabled={!path}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: path ? "#ffffff" : "#f1f5f9",
                color: path ? "#0f172a" : "#94a3b8",
                cursor: path ? "pointer" : "not-allowed",
                fontWeight: 600,
              }}
            >
              ← Back
            </button>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "12px 14px",
              marginBottom: "20px",
              color: "#334155",
              fontSize: "14px",
              wordBreak: "break-word",
            }}
          >
            <strong>Current path:</strong>{" "}
            {breadcrumbParts.length === 0
              ? "root"
              : `root / ${breadcrumbParts.join(" / ")}`}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="New folder name"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createFolder();
                }}
                style={{
                  flex: "1 1 240px",
                  minWidth: "220px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <button
                onClick={createFolder}
                disabled={creatingFolder || !newFolder.trim()}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    creatingFolder || !newFolder.trim() ? "#93c5fd" : "#2563eb",
                  color: "#ffffff",
                  cursor:
                    creatingFolder || !newFolder.trim()
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 600,
                }}
              >
                {creatingFolder ? "Creating..." : "Create Folder"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  border: "1px dashed #60a5fa",
                  color: "#1d4ed8",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {uploading ? "Uploading..." : "Upload files / folder"}
                <input
                  type="file"
                  multiple
                  onChange={uploadFiles}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.xls,.xlsx,.ppt,.pptx"
                />
              </label>

              <input
                type="text"
                placeholder="Search files and folders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: "1 1 280px",
                  minWidth: "220px",
                  maxWidth: "360px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                color: "#0f172a",
              }}
            >
              All Items
            </h2>

            <span
              style={{
                fontSize: "13px",
                color: "#64748b",
                background: "#f1f5f9",
                padding: "6px 10px",
                borderRadius: "999px",
              }}
            >
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "26px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Loading...
              </div>
            ) : filteredItems.length === 0 ? (
              <div
                style={{
                  padding: "32px 20px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                {search ? "No matching items found" : "No items found"}
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <div
                  key={`${item.type}-${item.key}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderBottom:
                      index !== filteredItems.length - 1
                        ? "1px solid #e2e8f0"
                        : "none",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <div
                    onDoubleClick={() => {
                      if (item.type === "folder") {
                        openFolder(item.raw);
                      } else {
                        openFile(item.key);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                      minWidth: 0,
                      cursor: item.type === "folder" ? "pointer" : "default",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          item.type === "folder" ? "#eff6ff" : "#f8fafc",
                        fontSize: "20px",
                      }}
                    >
                      {item.type === "folder" ? "📁" : "📄"}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          color: item.type === "folder" ? "#1d4ed8" : "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          marginTop: "4px",
                        }}
                      >
                        {item.type === "folder" ? "Folder" : "File"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.key, item.type === "folder")}
                    disabled={deletingKey === item.key}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid #fecaca",
                      background: "#fff5f5",
                      color: "#dc2626",
                      cursor:
                        deletingKey === item.key ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {deletingKey === item.key ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
