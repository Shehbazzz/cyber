import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';

const FileTreeNode = ({ node, onSelect, depth = 0 }) => {
  const [expanded, setExpanded] = useState(depth === 0);
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      onSelect(node);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center py-1 hover:bg-neon-green/10 cursor-pointer"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={handleClick}
      >
        {isFolder && (
          <span className="mr-1">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {isFolder ? <Folder size={14} className="text-yellow-400 mr-1" /> : <File size={14} className="text-neon-green mr-1" />}
        <span className="text-sm font-mono">{node.name}</span>
      </div>
      {isFolder && expanded && node.children?.map((child, idx) => (
        <FileTreeNode key={idx} node={child} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  );
};

const FileTree = ({ node, onSelect }) => {
  return <FileTreeNode node={node} onSelect={onSelect} />;
};

export default FileTree;