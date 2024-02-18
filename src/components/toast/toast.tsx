import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { TextBox } from "../../helper/general";

export default function Toast(prop:{isNgt:boolean,msg:string,action: number,visible:boolean,canc:()=>void}){
    var color = "blue"
    var bkg = "#D8DAE9"
    if(prop.action===1){
        color = "green"
        bkg = "#D8E8CE"
    }
    if(prop.action===0){
        color = "red"
        bkg = "#EED8D8"
    }

    return (
        <div className="notilay" style={{backgroundColor: bkg, display:prop.visible?"flex":"none"}}>
            <div style={{flex:1}}>
                <TextBox isNgt={prop.isNgt} text={prop.msg} size={14} wrapit={true} color={"black"}/>
            </div>
            <IconButton onClick={prop.canc}><Close style={{color:color}} /></IconButton>
        </div>
    )
}