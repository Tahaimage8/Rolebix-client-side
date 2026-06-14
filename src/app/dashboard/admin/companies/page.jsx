import { getCompanies } from '@/lib/api/companies';

import React from 'react';

const AdminCompaniesPage = async() => {
    const companies = await getCompanies()

    console.log(companies)
    return (
        <div>
            <h2>TotalCompanies : {companies.length}</h2>
        </div>
    );
};

export default AdminCompaniesPage;