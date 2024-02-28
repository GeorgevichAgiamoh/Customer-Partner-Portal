import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { LoadLay, appName, myEles, setTitle } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import { CircularProgress } from "@mui/material"
import { msgThread, partnerBasicinfo,  } from "../../../classes/models"
import { PartnerMessagesList } from "./messageList"
import { PartnerMessageThread } from "./messageThread"


export function PartnerMessages(mainprop:{pbi:partnerBasicinfo}){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[stage, setStage] = useState(-1)
    const[thread, setThread] = useState<msgThread>()

    useEffect(()=>{
        setTitle(`Messages - ${appName}`)
    },[])


    if(stage == -1){
        return <PartnerMessagesList pbi={mainprop.pbi} actiony={(thread,action)=>{
            setStage(action)
            setThread(thread)
        }} backy={()=>{
            setStage(-1)
        }} />
    }
    if(stage == 1 && thread){
        return <PartnerMessageThread pbi={mainprop.pbi} backy={()=>{
            setStage(-1)
        }} thread={thread} />
    }
    return LoadLay()
}

