import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { LoadLay, appName, myEles, setTitle } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import { CircularProgress } from "@mui/material"
import { SchoolMessagesList } from "./messageList"
import { msgThread, schoolBasicinfo } from "../../../classes/models"
import { SchoolMessageThread } from "./messageThread"



export function SchoolMessages(mainprop:{sbi:schoolBasicinfo}){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[stage, setStage] = useState(-1)
    const[thread, setThread] = useState<msgThread>()

    useEffect(()=>{
        setTitle(`Messages - ${appName}`)
    },[])


    if(stage == -1){
        return <SchoolMessagesList sbi={mainprop.sbi} actiony={(thread,action)=>{
            setStage(action)
            setThread(thread)
        }} backy={()=>{
            setStage(-1)
        }} />
    }
    if(stage == 1 && thread){
        return <SchoolMessageThread sbi={mainprop.sbi} backy={()=>{
            setStage(-1)
        }} thread={thread} />
    }
    return LoadLay()
}

