import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { Btn, DatePicky, EditTextFilled, IconBtn, Line, LoadLay, LrText, Mgin, appName, icony, myEles, setTitle } from "../../../../helper/general"
import { format } from "date-fns"
import { CircularProgress } from "@mui/material"
import { partnerBasicinfo, partnerGeneralinfo, schoolBasicinfo } from "../../../classes/models"
import { PartnerCustomersList } from "./customersList"



export function PartnerCustomers(mainprop:{pbi:partnerBasicinfo}){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[customer, setCustomer] = useState<schoolBasicinfo>()
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`My Customers - ${appName}`)
    },[])


    if(stage == -1){
        return <PartnerCustomersList actiony={(action,customer)=>{ // The `customer` must have been prepared (gen and prop) on click
            setCustomer(customer)
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

