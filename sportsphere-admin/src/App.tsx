import React from 'react';
import { AdminLayout } from './components/Admin/AdminLayout';

export const App: React.FC = () => {
  return (
    <AdminLayout
      onExitAdmin={() => {
        window.location.href = 'http://localhost:3004';
      }}
      onOpenPortal={() => {
        window.open('http://localhost:3000', '_blank');
      }}
    />
  );
};

export default App;
