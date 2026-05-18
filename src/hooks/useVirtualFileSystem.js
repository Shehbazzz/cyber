import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const defaultTree = {
  name: 'root',
  type: 'folder',
  children: [
    { name: 'index.html', type: 'file', content: '<!DOCTYPE html>\n<html>\n<head><title>My App</title><link rel="stylesheet" href="style.css"></head>\n<body>\n<h1>Hello Cyber World</h1>\n<script src="js/app.js"></script>\n</body>\n</html>' },
    { name: 'style.css', type: 'file', content: 'body { background: black; color: #0f0; font-family: monospace; }' },
    { name: 'js', type: 'folder', children: [
      { name: 'app.js', type: 'file', content: 'console.log("Ready");\ndocument.body.style.background = "#0a0f0f";' }
    ] }
  ]
};

export const useVirtualFileSystem = (userId) => {
  const [fileTree, setFileTree] = useState(defaultTree);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const { data, error } = await supabase
        .from('devhub_files')
        .select('file_tree')
        .eq('user_id', userId)
        .single();
      if (!error && data?.file_tree) {
        setFileTree(data.file_tree);
      } else {
        // Save default for new user
        await supabase.from('devhub_files').upsert({ user_id: userId, file_tree: defaultTree });
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  const saveTree = async (newTree) => {
    setFileTree(newTree);
    if (userId) {
      await supabase.from('devhub_files').upsert({ user_id: userId, file_tree: newTree });
    }
  };

  return { fileTree, saveTree, loading };
};