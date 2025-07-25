import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationToast from '../UI/NotificationToast';

const Layout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <NotificationToast />
    </div>
  );
};

export default Layout;