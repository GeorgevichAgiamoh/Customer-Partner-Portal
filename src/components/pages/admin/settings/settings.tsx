import { useEffect, useState } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { Btn, DatePicky, EditTextFilled, IconBtn, Line, LrText, Mgin, appName, icony, myEles, setTitle } from "../../../../helper/general"
import { AccountBalance, Add, ArrowBack, ArrowForward, CalendarMonth, CalendarViewDayOutlined, Close, CloudDownloadOutlined, Filter1Outlined, FilterOutlined, KeyboardArrowDown, ListAltOutlined, MoreVert, PersonOutline, SearchOutlined, SortOutlined, TroubleshootRounded } from "@mui/icons-material"
import { adminUserEle, indivEle } from "../../../classes/classes"
import { format } from "date-fns"
import { CircularProgress } from "@mui/material"
import { SettingsList } from "./settingsList"



export function AdminSettings(){
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[user, setUser] = useState<adminUserEle>()
    const[stage, setStage] = useState(-1)

    useEffect(()=>{
        setTitle(`Settings - ${appName}`)
    },[])


    if(stage == -1){
        return <SettingsList  />
    }
    return <div className="ctr" style={{
        width:'100%',
        height:'100%'
    }}>
        <CircularProgress className="icon" />
    </div>
}

