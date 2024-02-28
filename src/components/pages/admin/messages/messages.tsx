import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { LoadLay, appName, myEles, setTitle } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import { CircularProgress } from "@mui/material"
import { adminUserEle, msgThread } from "../../../classes/models"
import { AdminMessagesList } from "./messageList"
import { AdminMessageThread } from "./messageThread"



export function AdminMessages(mainprop:{me:adminUserEle}){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[stage, setStage] = useState(-1)
    const[thread, setThread] = useState<msgThread>()

    useEffect(()=>{
        setTitle(`Messages - ${appName}`)
    },[])


    if(stage == -1){
        return <AdminMessagesList me={mainprop.me} actiony={(thread,action)=>{
            setStage(action)
            setThread(thread)
        }} backy={()=>{
            setStage(-1)
        }} />
    }
    if(stage == 1 && thread){
        return <AdminMessageThread me={mainprop.me} backy={()=>{
            setStage(-1)
        }} thread={thread} />
    }
    return LoadLay()
}

