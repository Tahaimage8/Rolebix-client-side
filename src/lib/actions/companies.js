"use server"

import { serverMutation } from "../core/server"



export const createCompany = async (newCompanyData) => {
    return serverMutation('/api/companies', newCompanyData);
}

export const updateCompany = async(id, data)=>{
    return serverMutation(`/api/companies/${id}`, data, "PATCH")
}


// const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

// export const createCompany = async (newCompanyData) => {
//     const res = await fetch(`${baseUri}/api/companies`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newCompanyData),
//     });
//     return res.json();
// }