import React, { useState } from 'react';

interface FolderProps {
  name: string;
  children: FolderProps[];
}

const Folder: React.FC<FolderProps> = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ml-4">
      <div className="flex items-center cursor-pointer" onClick={handleToggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${isOpen ? 'text-blue-500' : 'text-gray-500'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 4a1 1 0 011-1h5a1 1 0 110 2H7a1 1 0 01-1-1zm-1 4a1 1 0 100 2h10a1 1 0 100-2H5zm-1 4a1 1 0 011-1h5a1 1 0 110 2H7a1 1 0 01-1-1zm-1 4a1 1 0 100 2h10a1 1 0 100-2H5z"
            clipRule="evenodd"
          />
        </svg>
        <span className="ml-1">{name}</span>
      </div>

      {isOpen && (
        <div className="ml-6">
          {children.map((child) => (
            <Folder key={child.name} name={child.name} children={child.children} />
          ))}
        </div>
      )}
    </div>
  );
};

interface FolderTreeProps {
  folders: FolderProps[];
}

const FolderTree: React.FC<FolderTreeProps> = ({ folders }) => {
  return (
    <div className="mt-4">
      {folders.map((folder) => (
        <Folder key={folder.name} name={folder.name} children={folder.children} />
      ))}
    </div>
  );
};

export default FolderTree;
