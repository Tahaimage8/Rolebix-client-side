import React from 'react';
import CompanyProfile from './CompanyProfile';
import { getUserSession } from '@/lib/core/session';

const CompanyPage = async() => {
    const recruiter = await getUserSession();
    // console.log('Recruiter:', recruiter);
    return (
        <div>
            <CompanyProfile recruiter={recruiter} />
        </div>
    );
};

export default CompanyPage;