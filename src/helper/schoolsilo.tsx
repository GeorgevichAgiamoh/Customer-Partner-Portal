//Incudes components specific to SCHOOLSILO 

import { ChangeEvent, useRef, useState } from "react";
import { Mgin, icony, myEles } from "./general";
import { Close } from "@mui/icons-material";
import useWindowDimensions from "./dimension";

export function MsgAlert(prop:{mye:myEles,icon:icony,msg:string,isError?:boolean}){
    const[show,setShow] = useState(true)
    const bkgCol = prop.isError?'rgba(255, 0, 0,0.1)':'rgba(57, 144, 229,0.1)',
     col = prop.isError?'rgb(255, 0, 0)':'rgb(57, 144, 229)'

    return <div style={{
        padding:'10px 20px',
        display:show?'flex':'none',
        width:'100%',
        boxSizing:'border-box',
        backgroundColor:bkgCol,
        borderRadius:10,
        alignItems:'center',
        
    }}>
        <prop.icon style={{
            color: col
        }}/>
        <Mgin right={10} />
        <div style={{
            flex:1
        }}>
            <prop.mye.Tv text={prop.isError?'Error: ':'Information: '+prop.msg} color={col} />
        </div>
        <Close id='clk' style={{
            color:prop.mye.mycol.black
        }} onClick={()=>{
            setShow(false)
        }} />
    </div>

}

export function PoweredBySSS(prop:{floaatIt?:boolean, noPadding?:boolean}){
    const mye = new myEles(false)
    const dimen = useWindowDimensions()
    return <div className="ctr" style={!prop.floaatIt?{
        marginTop:50
    }:{
        position:'fixed',
        width:'100%',
        bottom:10,
        left:(dimen.dsk && !prop.noPadding)?150:0
    }}>
        <div id="lshdw" className="hlc" style={{
            padding:5,
            backgroundColor:mye.mycol.bkg,
            borderRadius:10
        }}>
            <mye.Tv text="POWERED BY "  size={12}/>
            <mye.BTv text="STABLE SHIELD SOLUTIONS" color={mye.mycol.primarycol} size={12} onClick={()=>{
                const newTab = window.open('https://stableshield.com', '_blank');
                newTab?.focus(); 
            }}/>
        </div>
    </div>
}


export function PincodeLay(prop:{mye:myEles, ocl:(val:string)=>void}){
    const [pin, setPin] = useState(['', '', '', '']);
    const pinInputRefs = [useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null)];

    const handlePinChange = (index: number, value: string) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Move focus to the next input, if available
        if (value !== '' && pinInputRefs[index + 1].current) {
            if(index < 3){
                pinInputRefs[index + 1].current?.focus();
            }else{
                prop.ocl(pin[0]+pin[1]+pin[2]+pin[3]);
            }
        }
    };

    const handleBackspace = (index: number, value: string) => {
        if (value === '' && index > 0 && pinInputRefs[index - 1].current) {
        pinInputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div>
        {pin.map((digit, index) => (
            <input className="pincode"
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                    handleBackspace(index, pin[index]);
                    }
                }}
                ref={pinInputRefs[index]}
            />
        ))}
        </div>
    );
}


export function getGreeting(){
    const currentHour = new Date().getHours();
  
    if (currentHour >= 5 && currentHour < 12) {
      return 'morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  };

/*
export function CustomCountryTip(){
    const mye = new myEles(false)
    return <div style={{
        width:'100%',
        marginLeft:20
    }}>
        <mye.Tv text="If your state is not on the list, leave it at 'Let me input manually' and continue" size={12} color={mye.mycol.primarycol}/>
    </div>
}*/

export function PaystackExplanation(){
    const mye = new myEles(false)
    return <div>
        <Mgin top={5}/>
        <mye.Tv text="You will be paying to our payment partner - STABLE SHIELD SOLUTIONS, " size={12} color={mye.mycol.hint} />
        <Mgin top={5}/>
    </div>
}








