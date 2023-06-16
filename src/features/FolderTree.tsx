import React, { useState } from 'react';

interface File {
  name: string;
  // Other file properties
}

interface Folder {
  name: string;
  children: Folder[];
  leafs: File[];
}

interface FolderTreeProps {
  rootFolders: Folder[];
}

const FolderTree: React.FC<FolderTreeProps> = ({ rootFolders }) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prevExpandedFolders) => {
      if (prevExpandedFolders.includes(folderName)) {
        return prevExpandedFolders.filter((name) => name !== folderName);
      } else {
        return [...prevExpandedFolders, folderName];
      }
    });
  };

  const renderFolder = (folder: Folder, indent: number) => {
    const isExpanded = expandedFolders.includes(folder.name);

    return (
      <div key={folder.name} style={{ marginLeft: `${indent * 16}px` }}>
        <div
          className="cursor-pointer"
          onClick={() => toggleFolder(folder.name)}
        >
          {isExpanded ? '-' : '+'} {folder.name}
        </div>
        {isExpanded && (
          <>
            {folder.children
              .sort((a, b) => compareChildren(a, b))
              .map((child) => {
                if (child.children.length > 0 || child.leafs.length > 0) {
                  return renderFolder(child, indent + 1);
                } else {
                  return (
                    <div
                      key={child.name}
                      style={{ marginLeft: `${(indent + 1) * 16}px` }}
                    >
                      {child.name}
                    </div>
                  );
                }
              })}
            {folder.leafs.map((file) => (
              <div
                key={file.name}
                style={{ marginLeft: `${(indent + 1) * 16}px` }}
              >
                {file.name}
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  const compareChildren = (a: Folder, b: Folder) => {
    if (a.children.length > 0 && b.children.length === 0) {
      return -1;
    } else if (a.children.length === 0 && b.children.length > 0) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  };

  return (
    <div className="text-left"> {/* Add the text-left class */}
      {rootFolders.map((rootFolder) => renderFolder(rootFolder, 0))}
    </div>
  );
};

export default FolderTree;
