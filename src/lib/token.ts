'use client'

import { useUser } from "@/store/UserAuthProvider"

export const GetToken=()=>{
    const {getToken}=useUser()
    const token=getToken()
    return token
}