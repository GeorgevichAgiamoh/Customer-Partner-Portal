import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { Btn, DatePicky, EditTextFilled, IconBtn, Line, LoadLay, LrText, Mgin, appName, icony, myEles, setTitle } from "../../../../helper/general"
import { format } from "date-fns"
import { AdminDirList } from "./dirList"
import {  AdminDirViewPartner, AdminDirViewSchool } from "./dirView"
import { CircularProgress } from "@mui/material"
import { adminUserEle } from "../../../classes/models"



export function AdminDirectory(mainprop:{me:adminUserEle}){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[user, setUser] = useState<any>()
    const[isSchool, setIsSchool] = useState(false)
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`Directory - ${appName}`)
    },[])


    if(stage == -1){
        return <AdminDirList me={mainprop.me} actiony={(action,user, isSchool)=>{ // The `user` must have been prepared (gen and fin) on click
            setUser(user)
            setIsSchool(isSchool)
            setStage(action)
            console.log(action)
        }} />
    }
    if((stage == 0 || stage == 2) && user){
        if(isSchool){
            return <AdminDirViewSchool me={mainprop.me} school={user} backy={(action)=>{
                setStage(action)
            }}/>
        }else{
            return <AdminDirViewPartner me={mainprop.me} partner={user} backy={(action)=>{
                setStage(action)
            }}/>
        }
    }
    // if(stage == 1 && user){
    //     return <AdminDirEdit user={user} backy={()=>{
    //         setStage(-1)
    //     }}/>
    // }
    return LoadLay()
}

