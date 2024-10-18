import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

interface ConfigEditorProps {
  config: any;
  onReset: () => void;
  onSave: (newConfig: any) => void;
  onError: (error: any) => void;
}

export default function ConfigEditor({ config, onReset, onSave, onError  }: ConfigEditorProps) {
  const [editedConfig, setEditedConfig] = useState(JSON.stringify(config, null, 2));

  useEffect(() => {
    setEditedConfig(JSON.stringify(config, null, 2));
  }, [config]);

  const handleChange = (newValue: string) => {
    setEditedConfig(newValue);
  };

  const handleSave = () => {
    try {
      const parsedConfig = JSON.parse(editedConfig);
      onSave(parsedConfig);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow h-[300px]">
        <AceEditor
          mode="json"
          theme="github"
          onChange={handleChange}
          value={editedConfig}
          name="config-editor"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            useWorker: false,
            showPrintMargin: false,
          }}
          width="100%"
          height="100%"
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white border border-red-700 rounded-full hover:bg-red-600 transition-colors duration-200"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white border border-green-700 rounded-full hover:bg-green-600 transition-colors duration-200"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
