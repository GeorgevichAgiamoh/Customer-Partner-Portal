import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { Btn, DatePicky, EditTextFilled, IconBtn, Line, LoadLay, LrText, Mgin, appName, icony, myEles, setTitle } from "../../../../helper/general"
import { format } from "date-fns"
import { CircularProgress } from "@mui/material"
import { partnerBasicinfo, partnerGeneralinfo, schoolBasicinfo } from "../../../classes/models"
import { AdminPaymenysList } from "./paymentsList"



export function AdminPayments(){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[school, setSchool] = useState<schoolBasicinfo>()
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`School Payments - ${appName}`)
    },[])


    if(stage == -1){
        return <AdminPaymenysList actiony={(action,school)=>{ // The `customer` must have been prepared (gen and prop) on click
            setSchool(school)
            setStage(action)
            console.log(action)
        }} />
    }
    // if((stage == 0 || stage == 2) && user){
    //     return <AdminDirView me={mainprop.me} user={user} backy={(action)=>{
    //         setStage(action)
    //     }}/>
    // }
    return LoadLay()
}

