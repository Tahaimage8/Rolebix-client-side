"use server"

import { serverMutation } from "../core/server"



export const CreateApplication = async (Application) => {
    return serverMutation('/api/applications', Application);
}