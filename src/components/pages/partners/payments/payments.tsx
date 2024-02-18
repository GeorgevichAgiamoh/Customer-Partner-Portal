import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { LoadLay, appName, myEles, setTitle } from "../../../../helper/general"
import { payTypeEle } from "../../../classes/classes"
import { CircularProgress } from "@mui/material"
import { PartnerPaymentList } from "./paymentList"



export function PartnerPayments(){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`Payments - ${appName}`)
    },[])


    if(stage == -1){
        return <PartnerPaymentList backy={()=>{
            setStage(-1)
        }} />
    }
    return LoadLay()
}

