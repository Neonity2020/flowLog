import React from 'react';

const LogDisplay = ({ logs }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">日志显示</h2>
      <ul className="space-y-1">
        {logs.map((log, index) => (
          <li key={index} className="text-sm text-gray-700">{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogDisplay;
