import DashboardSideBar from '@/components/dashboard/DashboardSideBar';
import React from 'react';

const DashboardLayout = ({children }) => {
    return (
        <div>
          <main>
            <DashboardSideBar/>
              {children}
          </main>
        </div>
    );
};

export default DashboardLayout;