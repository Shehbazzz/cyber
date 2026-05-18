import Editor from '@monaco-editor/react';

const MonacoEditor = ({ value, onChange, language }) => {
  return (
    <Editor
      height="calc(100vh - 160px)"
      language={language === 'js' ? 'javascript' : language === 'css' ? 'css' : 'html'}
      theme="vs-dark"
      value={value}
      onChange={onChange}
      options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'Fira Code' }}
    />
  );
};

export default MonacoEditor;