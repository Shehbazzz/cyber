import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FileTree from '../components/FileTree';
import MonacoEditor from '../components/MonacoEditor';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const DevHub = () => {
  const { user } = useAuth();
  const [fileTree, setFileTree] = useState({ 
    name: 'root', 
    type: 'folder', 
    children: [
      { name: 'index.html', type: 'file', content: '<h1>Hello Cyber World</h1>' },
      { name: 'style.css', type: 'file', content: 'body { background: black; color: #0f0; }' },
      { name: 'js', type: 'folder', children: [{ name: 'app.js', type: 'file', content: 'console.log("Ready")' }] }
    ] 
  });
  const [activeFile, setActiveFile] = useState(null);
  const [bufferContent, setBufferContent] = useState('');

  useEffect(() => {
    if (user) loadFileTree();
  }, [user]);

  const loadFileTree = async () => {
    const { data } = await supabase.from('devhub_files').select('file_tree').eq('user_id', user.id).single();
    if (data?.file_tree) setFileTree(data.file_tree);
  };

  const saveFileTree = async (newTree) => {
    if (!user) return;
    await supabase.from('devhub_files').upsert({ user_id: user.id, file_tree: newTree });
  };

  const handleFileSelect = (fileNode) => {
    setActiveFile(fileNode);
    setBufferContent(fileNode.content || '');
  };

  const handleSaveBuffer = () => {
    if (!activeFile) return;
    const updateNode = (node) => {
      if (node.name === activeFile.name && node.type === 'file') node.content = bufferContent;
      if (node.children) node.children.forEach(updateNode);
    };
    const newTree = { ...fileTree };
    updateNode(newTree);
    setFileTree(newTree);
    saveFileTree(newTree);
    toast.success('File saved');
  };

  const launchSandbox = () => {
    // Build HTML with resolved relative paths
    const findFile = (path) => {
      const parts = path.split('/');
      let current = fileTree;
      for (let part of parts) {
        if (part === '..') continue;
        if (current.children) current = current.children.find(c => c.name === part);
        else return null;
      }
      return current;
    };
    let htmlContent = findFile('index.html')?.content || '';
    // Replace <link href="style.css"> and <script src="js/app.js"> with inline content
    const styleFile = findFile('style.css');
    if (styleFile) {
      htmlContent = htmlContent.replace(/<link[^>]*href="style\.css"[^>]*>/, `<style>${styleFile.content}</style>`);
    }
    const scriptFile = findFile('js/app.js');
    if (scriptFile) {
      htmlContent = htmlContent.replace(/<script[^>]*src="js\/app\.js"[^>]*><\/script>/, `<script>${scriptFile.content}</script>`);
    }
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-64px)]">
      <div className="col-span-1 bg-glass-bg backdrop-blur-xs border border-neon-green/30 rounded-lg p-2 overflow-auto">
        <FileTree node={fileTree} onSelect={handleFileSelect} />
        <button onClick={launchSandbox} className="mt-4 w-full bg-neon-green/20 text-neon-green border border-neon-green rounded p-2">🚀 Launch Tool</button>
      </div>
      <div className="col-span-3 bg-glass-bg backdrop-blur-xs border border-neon-green/30 rounded-lg p-2 flex flex-col">
        {activeFile && (
          <>
            <div className="flex justify-between mb-2">
              <span className="text-neon-green">{activeFile.name}</span>
              <button onClick={handleSaveBuffer} className="bg-neon-green/30 px-3 py-1 rounded">💾 Save Buffer</button>
            </div>
            <MonacoEditor value={bufferContent} onChange={setBufferContent} language={activeFile.name.split('.').pop()} />
          </>
        )}
      </div>
    </div>
  );
};

export default DevHub;