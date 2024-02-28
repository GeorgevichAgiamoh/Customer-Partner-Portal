import React, { useEffect, useRef, useState } from "react";
import { CircularProgress, IconButton, InputAdornment, SvgIconTypeMap, TextField } from "@mui/material";
import { Close, CopyAllOutlined, Done, Visibility, VisibilityOff } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from "date-fns";
import { AxiosResponse } from "axios";
import { useLocation } from "react-router-dom";
import PieDonutChart from "@garvae/react-pie-donut-chart";
import { defVal } from "../components/classes/models";

//----------colors
class myCols{
    black:string;
    white:string;
    primarycol:string;
    secondarycol:string;
    hs_blue:string;
    hint:string;
    imghint:string;
    imghintr2:string;
    red:string;
    green:string;
    transparent:string;
    bordercolor:string;
    btnstrip:string;
    btnstripx2:string;
    btnstrip5:string;
    btnstripbk:string;
    redstrip:string;
    greenstrip:string;
    sldredstrip:string;
    sldgreenstrip:string;
    bkg:string;
    orange:string;
    vDim:string;
    
    constructor(isNgt:boolean){
        this.black = isNgt?"#FFFFFF":"#333333";
        this.white = isNgt?"#000000":"#ffffff";
        this.primarycol = isNgt?"#FAE20E":"#2A62D3";
        this.secondarycol = isNgt?"#FAE20E":"#CCC670";
        this.hs_blue = isNgt?"#0000FF":"#0066CC";
        this.hint = isNgt?"rgba(255,255,255,0.9)":"#333333";
        this.imghint = isNgt?"rgba(255,255,255,0.5)":"#00000080";
        this.imghintr2 = isNgt?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.05)";
        this.red = "#ff0000";
        this.green = "#009900";
        this.transparent = "#00000000"
        this.bordercolor = "#cccccc"
        this.btnstrip = isNgt?"rgba(255,255,0,0.1)":"rgba(4,153,81,0.1)"
        this.btnstripx2 = isNgt?"rgba(255,255,0,0.7)":"rgba(4,153,81,0.7)"
        this.btnstrip5 = isNgt?"rgba(255,255,0,0.07)":"rgba(4,153,81,0.05)"
        this.btnstripbk = "#D8DAE9"
        this.redstrip = "#D600001A"
        this.greenstrip = "#63DE161A"
        this.sldredstrip = "#EED8D8"
        this.sldgreenstrip = "#D8E8CE"
        this.bkg = isNgt?"#373535":"#ffffff"
        this.orange = "#FFA500"
        this.vDim = isNgt?"rgba(255,255,0,0.15)":"rgba(0,0,0,0.15)"
    }
}

export const ROOTDB = 'BIZ/MND'

export function getCT():string{
    return Date.now().toString();
  }

export function MyCols(isNgt?:boolean){
    return new myCols(isNgt?true:false);
}
//-----------
  

export function Line(prop:{len?:number,col?:string,vertical?:boolean,height?:number,broken?:boolean}){
    return <div style={{
        width:prop.vertical?0:'100%',
        height: prop.vertical?(prop.height||100):0,
        border:`${prop.len || 1}px ${prop.broken?'dashed':'solid'} ${prop.col || new myCols(false).imghintr2}`
    }}></div>
}

export function Mgin(prop:{top?:number, right?:number, maxOut?:boolean}){
    return (
        <div style={{margin:(prop.maxOut?(prop.top || prop.right)!:(prop.top || 0)).toString()+"px 0 0 "+(prop.right || 0).toString()+"px", height:0, width:prop.maxOut?'100%':0}}></div>
    )
}

export function CloseBtn(prop:{onClick:()=>void}){
    return <div className="ctr" style={{
        width:45,
        height:45
    }} onClick={prop.onClick}>
        <Close className="icn" />
    </div>
}

export function TextBox(prop:{isNgt:boolean,text:string, size?: number, color?: string,onClick?:()=>void,maxLines?:number, wrapit?:boolean, center?:boolean,hideOverflow?:boolean}){
    var ln = 100;
    if(prop.maxLines){
      ln = prop.maxLines;
    }
    return (
        <p className={prop.maxLines?'limitedTV3':undefined} style={{margin:"1px",fontSize: prop.size!==undefined?prop.size:14,color: prop.color||MyCols(prop.isNgt).black,
        cursor:prop.onClick!==undefined?"pointer":"default", maxLines:ln,whiteSpace:prop.wrapit?"normal":"nowrap",textDecoration:prop.onClick!=undefined?'underline':undefined,
         textAlign:prop.center?"center":"start", overflow: prop.hideOverflow?'hidden':undefined}}
        onClick={prop.onClick}>{prop.text}</p>
    )
}


export function BoldText(prop:{maxLines?:number,isNgt:boolean,text:string, size: number, color?: string,wrapit?:boolean, center?:boolean,onClick?:()=>void}){
    var ln = 100;
    if(prop.maxLines){
      ln = prop.maxLines;
    }
    return (
        <p onClick={prop.onClick} style={{margin:"1px",fontSize: prop.size,color: prop.color||MyCols(prop.isNgt).black, fontWeight: "bold",
        cursor:prop.onClick!==undefined?"pointer":"default",
        maxLines:ln,whiteSpace:prop.wrapit?"normal":"nowrap", textAlign:prop.center?"center":"start"}}>{prop.text}</p>
    )
}

export function HeadText(prop:{isNgt:boolean,text:string,color?:string,size?: number,}){
    return (
        <p className="headtext" style={{margin:"1px",fontSize: prop.size??24,color: prop.color!==undefined?prop.color:MyCols(prop.isNgt).primarycol, fontWeight: "bold"}}>{prop.text}</p>
    )
}

export function Btn(prop:{txt:string,onClick?:()=>void,round?:boolean,smallie?:boolean,transparent?:boolean,width?:number,outlined?:boolean,bkg?:string,tcol?:string,strip?:boolean}){
    const mye = new myEles(false)
    let bkgCol = prop.bkg||((prop.transparent)?'transparent':undefined)
    let tCol = prop.tcol || (prop.transparent?new myCols(false).primarycol:undefined)
    if(prop.strip){
        bkgCol = mye.mycol.btnstrip
        tCol = mye.mycol.primarycol
    }
    return (
        <button className={prop.outlined?'btnoln':'btn'} id="max_width" onClick={prop.onClick} style={{
            borderRadius:prop.round?'30px':'10px',
            height:prop.smallie?'35px':'45px',
            width:prop.width,
            fontSize:prop.smallie?'12px':'16px',
            backgroundColor:bkgCol,
            color: tCol
        }}>{prop.txt}</button>
    )
}

export function StripBtn(prop:{txt:string,onClick?:()=>void,icon?:JSX.Element,tabbish?:boolean,lessBold?:boolean,smallie?:boolean,width?:number}){
    const mcol = new myCols(false)
    return (
        <div style={{display:"flex"}}>
            <button className="btnstrip"onClick={prop.onClick} style={{
            borderRadius:prop.tabbish?'10px 5px 5px 10px':'10px',
            backgroundColor:prop.lessBold?mcol.primarycol:mcol.primarycol,
            height:prop.smallie?'35px':'45px',
            fontSize:prop.smallie?'12px':'13px',
            width:prop.width?prop.width.toString()+'px':'100%'
        }}>{prop.txt}</button>
            {prop.icon!==undefined?<div style={{
                position:"absolute",
                alignSelf:"center",
                marginLeft:20,
                color:"#0411A7"
            }}>
                {prop.icon}
            </div>:<Mgin/>}
        </div>
    )
}

export function StripBtnRnd(prop:{isNgt:boolean,txt:string,onClick?:()=>void,icon:any}){
  return (
      <div id="hov" className="no-wrap" style={{display:"flex",alignItems:"center",padding:"7px 12px"
      ,borderRadius:25,}} onClick={prop.onClick}>
          {prop.icon}
          <Mgin right={5}/>
          <TextBox color={MyCols(prop.isNgt).primarycol} text={prop.txt} size={12} isNgt={prop.isNgt}/>
      </div>
  )
}

export function BtnIcn(prop:{icon:icony, ocl:()=>void, color?:string}){
    return <div className="ctr" id="clk" style={{
        width:50,
        height:50
    }} onClick={prop.ocl}>
        <prop.icon style={{
            color: prop.color ?? new myCols(false).primarycol
        }} />
    </div>
}

export function StripBtnImg(prop:{txt:string,onClick?:()=>void,img?:string}){
    return (
        <div style={{display:"flex"}}>
            <button className="btnstrip" id="max_width" onClick={prop.onClick}>{prop.txt}</button>
            {prop.img!==undefined?<img src={prop.img} style={{
                width: 30,
                height: 30,
                position:"absolute",
                alignSelf:"center",
                marginLeft:20
            }} alt="icon"></img>:<Mgin/>}
        </div>
    )
}


export function EditText(prop:{isNgt:boolean, hint: string,min?: number, max?: number,eml?: boolean,pwd?: boolean,digi?: boolean
    ,singleLine?: boolean, noSpace?: boolean, icon?: any,value?:string,recv?:(val:string)=>void}){

        const [error, setError] = useState<{stat:boolean, msg?:string}>({stat: false,msg: undefined})
        
    var _min = prop.min ?? 0
    var _max = prop.max ?? 300
    var _eml = prop.eml ?? false
    var _pwd = prop.pwd ?? false
    var _digi = prop.digi ?? false
    var _singleLine = prop.singleLine ?? true
    var _noSpace = prop.noSpace ?? false
    return (
        <TextField className="edittext"
            defaultValue={prop.value}
            autoFocus={true}
            label = {prop.hint}
            fullWidth={true}
            sx ={{
                input:{color:MyCols(prop.isNgt).black},
                label:{color:MyCols(prop.isNgt).hint}
            }}
            onChange ={(e)=>{
                setError({stat: false, msg:undefined})
                var inp = e.target.value.trim();
                var ok = true;
                if(inp.length<_min){
                    ok = false;
                    setError({stat: true, msg: "Minimum of "+_min.toString()+" characters"})
                }else if(_eml){
                    if(!isEmlValid(inp)){
                        ok = false;
                        setError({stat: true, msg: "Invalid email address"})
                    }
                }
                if(prop.recv!=null){
                    prop.recv(ok?inp:"");
                }
            }}
            onKeyDown = {(_noSpace||_eml)?(event)=>{
                if(event.code==='Space'){
                    event.preventDefault()
                }
            }:undefined}
            error = {error.stat}
            helperText = {error.msg}
            inputProps = {{maxLength:_max}}
            type= {_eml?"email":_pwd?"password":_digi?"number":"text"}
            multiline= {!_singleLine}
            InputProps= {prop.icon!==undefined?{startAdornment:(
                <InputAdornment position="start">
                    {prop.icon}
                </InputAdornment>
            )}:undefined}
        />
    )
}

export function isPhoneNigOk(phn:string){
    if(phn.startsWith('+')){
        phn = phn.substring(1)
    }
    if(phn.startsWith('234')){
        phn = '0'+phn.substring(3)
    }
    return phn.length == 11 && /^[0-9]+$/.test(phn) && (phn.startsWith('070') || phn.startsWith('071') || phn.startsWith('080') || phn.startsWith('081') || phn.startsWith('090') || phn.startsWith('091') )
}

export function isEmlValid(eml:string){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return eml.length>0 && re.test(eml);
}


export function EditTextFilled(prop:{hint: string,min?: number, max?: number,eml?: boolean,pwd?: boolean,digi?: boolean
    ,singleLine?: boolean, noSpace?: boolean, icon?: any,value?:string,recv?:(val:string)=>void,finise?:(val:string)=>void,disabled?:boolean}){

        const [error, setError] = useState<{stat:boolean, msg?:string}>({stat: false,msg: undefined})
        const [label, showLabel] = useState(true)
        const [inpp, setInpp] = useState("")
        const [showPassword, setShowPassword] = useState(false);
        const[key, setKey] = useState(Date.now())
        const[defDone, setDefDone] = useState(false)

        const handleTogglePassword = () => {
            setShowPassword(!showPassword);
          };

          //---
          if(prop.value==defVal && !defDone){
            if(prop.recv!=null){
                prop.recv('');
                setDefDone(true)
                setTimeout(()=>{
                    setKey(Date.now())
                },10)
            }
          }
          //---
        
    var _min = prop.min ?? 0
    var _max = prop.max ?? 300
    var _eml = prop.eml ?? false
    var _pwd = prop.pwd ?? false
    var _digi = prop.digi ?? false
    var _singleLine = prop.singleLine??true
    var _noSpace = prop.noSpace ?? false
    return (
        <TextField key={key} disabled={prop.disabled} className="edittextf"
            variant="filled"
            fullWidth={true}
            defaultValue={prop.value}
            onChange ={(e)=>{
                var inp = e.target.value.trim();
                setInpp(inp)
                showLabel(inp.length===0)
                setError({stat: false, msg:undefined})
                var ok = true;
                if(inp.length<_min){
                    ok = false;
                    setError({stat: true, msg: "Minimum of "+_min.toString()+" characters"})
                }else if(_eml){
                    if(!isEmlValid(inp)){
                        ok = false;
                        setError({stat: true, msg: "Invalid email address"})
                    }
                }
                if(prop.recv!=null){
                    prop.recv(inp); //prop.recv(ok?inp:"");
                }
            }}
            onKeyDown = {(event)=>{
                if(event.code==='Space'){
                    if((_noSpace||_eml)){
                      event.preventDefault()
                    }
                }
                if(prop.finise && event.code==='Enter'){
                  showLabel(inpp.length===0)
                  setError({stat: false, msg:undefined})
                  var ok = true;
                  if(inpp.length<_min){
                      ok = false;
                      setError({stat: true, msg: "Minimum of "+_min.toString()+" characters"})
                  }else if(_eml){
                      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                      if(!re.test(inpp)){
                          ok = false;
                          setError({stat: true, msg: "Invalid email address"})
                      }else{
                        prop.finise(ok?inpp:"");
                      }
                  }else{
                    prop.finise(ok?inpp:"");
                  }
                }
            }}
            error = {error.stat}
            helperText = {error.msg}
            inputProps = {{maxLength:_max}}
            type= {_eml?"email":(_pwd && !showPassword)?"password":_digi?"number":"text"}
            multiline= {!_singleLine}
            placeholder={prop.hint}
            hiddenLabel={true}
            
            InputProps= {{
                startAdornment:prop.icon!==undefined?(
                    <InputAdornment position="start">
                        {prop.icon}
                    </InputAdornment>
                ):undefined,disableUnderline:true,
                endAdornment: _pwd?(
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <Visibility className="icon" /> : <VisibilityOff className="icon"/>}
                      </IconButton>
                    </InputAdornment>
                  ):undefined,
            }}
            size="small"
        />
    )
}



export function ErrorCont(prop:{isNgt:boolean,visible:boolean,retry:()=>void,msg?:string}){
    return (
        <div className="errorcont" style={{display:prop.visible?"flex":"none"}}>
            <TextBox text={prop.msg??"AN ERROR OCCURRED, PLEASE RETRY"} isNgt={prop.isNgt}/>
            <Mgin top={20}/>
            <Btn txt="RETRY" onClick={()=>prop.retry()} width={200} />
        </div>
    )
}


export function LrText(prop:{left:any,right:any,wrap?:boolean}){//TODO use wrap if wrappy fails
    return (
        <div className="lrtext" style={{
            flexWrap:prop.wrap?'wrap':undefined,
        }}>
            <div><div id="wrappy">{prop.left}</div></div>
            {prop.wrap?<div
            style={{
                width:'100%',
                height:15
            }}
            ></div>:<div></div>}
            <div>{prop.right}</div>
        </div>
    )
}


export function Tablet(prop:{mye:myEles,txt:string, sel:boolean, ocl:()=>void}){
    return (
        <div  style={{
            padding:3,
            borderRadius:5,
            backgroundColor:prop.sel?prop.mye.mycol.primarycol:prop.mye.mycol.btnstrip
        }} onClick={prop.ocl}>
            <prop.mye.Tv text={prop.txt} color={prop.sel?prop.mye.mycol.white:prop.mye.mycol.primarycol} />
        </div>
    )
}
export function NotiLay(prop:{isNgt:boolean,icon:any,count:string,wht?:boolean,onClick?:()=>void}){
    return (
      <div onClick={prop.onClick} id="hovvy" style={{
            paddingTop:3,
            paddingBottom:3,
            paddingLeft:6,
            paddingRight:6,
            borderRadius:30,
            display:"flex",
            alignItems:"center",
            backgroundColor:(prop.wht?MyCols(prop.isNgt).bkg:MyCols(prop.isNgt).btnstrip5)
        }} >
          {prop.icon}
          <div style={{
                paddingTop:0,
                paddingBottom:0,
                paddingLeft:4,
                paddingRight:4,
                backgroundColor:MyCols(prop.isNgt).btnstrip5,
                borderRadius:15,
                marginLeft:5
            }}>
                <TextBox isNgt={prop.isNgt} text={prop.count} size={13}/>
            </div>
          </div>
    )
}















//---------------HELPERS
export function fixedString(s:string, numDig:number){
    if (s.length==numDig) return s;
    if (s.length>numDig){
      return  s.substring(0,numDig);
    }
    var lim = s.length;
    for (var i =0; i < numDig-lim;i++){
      s="0"+s;
    }
    return s;
  }

  export function share(link:string){
    //share Logic 
  }

  export function getTimeStr(td:number){
    var date = new Date(td)
    return date.toString().split("GMT")[0];
  }

  export let offst = 60;

  export function getRawTime(td:number){
    if (td<0) return "";//Phone data not correct
    var oneYear = 31536000000;
    var oneMonth = 2592000000;
    var oneDay = 86400000;
    var oneHour = 3600000;
    var oneMinute = 60000;
    var oneSec = 1000;
    var exp;
    if (td<oneMinute){
      td = td / oneSec;
      td = Math.floor(td);
      if (td<3){
        exp="just now";
      }else {
        exp = `${td} seconds`;
      }
    }else if (td<oneHour){
      td = td / oneMinute;
      td = Math.floor(td);
      exp = `${td} minute`+(td>1?`s`:``);
    }else if (td<oneDay){
      td = td / oneHour;
      td = Math.floor(td);
      exp = `${td} hour`+(td>1?`s`:``);
    }else if (td<oneMonth){
      td =  td / oneDay;
      td = Math.floor(td);
      exp = `${td} day`+(td>1?`s`:``);
    }else if (td<oneYear){
      td = td / oneMonth;
      td = Math.floor(td);
      exp = `${td} month`+(td>1?`s`:``);
    }else {
      td = td / oneYear;
      td = Math.floor(td);
      exp = `${td} year`+(td>1?`s`:``);
    }
    return exp;
  }

  export function getPreciseTime(td:number){
    if (td<0) return "";//Phone data not correct
    var oneMinute = 60000;
    var oneSec = 1000;
    var exp;
    if (td<oneMinute){
      td = td / oneSec;
      td = Math.floor(td);
      exp = `${td} seconds`;
    }else{
      let min = Math.floor(td / oneMinute);
      let sec = Math.floor((td - min*60000)/1000)
      exp = `${min} minute${min>1?`s`:``}, ${sec} second${sec>1?`s`:``}`;
    }
    return exp;
  }

  export function goUrl(url:string){
    window.open(url,'_blank','noreferrer');
  }

  export function getTDY(){
    let am = Date.now(); //no of days
    return (am -(am % 86400000));
  }

  export class myEles{
    isNgt:boolean;
    mycol:myCols;
    constructor(isNgt:boolean){
        this.isNgt = isNgt;
        this.mycol = new myCols(isNgt)
    }

    Tv(prop:{text:string, size?: number, color?: string,onClick?:()=>void,maxLines?:number, wrapit?:boolean, center?:boolean,hideOverflow?:boolean}) {
        return <TextBox isNgt={false} text={prop.text} size={prop.size} color={prop.color} onClick={prop.onClick} maxLines={prop.maxLines} 
        wrapit={prop.wrapit!==undefined?prop.wrapit:true} center={prop.center} hideOverflow={prop.hideOverflow} />
    }

    BTv(prop:{maxLines?:number,text:string, size: number, color?: string,wrapit?:boolean, center?:boolean,onClick?:()=>void}){
        return <BoldText isNgt={false} size={prop.size} text={prop.text} center={prop.center} color={prop.color} maxLines={prop.maxLines} onClick={prop.onClick} wrapit={prop.wrapit!==undefined?prop.wrapit:true}  />
    }

    HTv(prop:{text:string,color?:string,size?: number}){
        return <HeadText isNgt={false} text={prop.text} color={prop.color} size={prop.size} />
    }

  }

  export function setTitle(title:string){
    document.title = title
  }

  export const appName = 'SCHOOLSILO'

  export type icony = OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };

  //-- school silo new

  export const hexToRgba = (hex:string, alpha:number) => {
    const hexWithoutHash = hex.replace('#', '');
    const bigint = parseInt(hexWithoutHash, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  export function MyPieChart(prop:{size:number,values:number[],colors:string[]}){

    return <PieDonutChart data={prop.values.map((v,i)=>{
        return {
            color:prop.colors[i],
            value:v
        }
    })} size={prop.size}/>;
  }

  export function LoadLay(){
    return <div className="ctr" style={{
        width:'100%',
        height:'100%'
    }}>
        <CircularProgress style={{color:new myCols(false).primarycol}} />
    </div>
  }

  export function useQuery(){
    return new URLSearchParams(useLocation().search);
  }

  export function MyCB(prop:{mye:myEles,checked:boolean,ocl:()=>void,noPadding?:boolean}) {
    return <div className="ctr" style={{
        width:prop.noPadding?undefined:50,
        height:prop.noPadding?undefined:40,
    }}>
        <span id="clk" className="ctr" style={{
            backgroundColor: prop.checked ? prop.mye.mycol.primarycol : 'transparent',
            width: '12px', // Adjust the size as needed
            height: '12px',
            border: `1px solid ${prop.mye.mycol.btnstripx2}`, // You can customize other styles as well
            borderRadius: '3px', 
        }} onClick={prop.ocl} >
            <Done style={{
                fontSize:11,
                color:prop.checked?"white":'transparent'
            }} />
        </span>
    </div>
}

  export function IconBtn(prop:{text:string,mye:myEles,icon:icony,ocl:()=>void,bkg?:string,width?:number,outld?:boolean}){
    return <div className="ctr" id="clk" style={{
        borderRadius:5,
        width:prop.width || 120,
        boxSizing:'border-box',
        padding:10,
        border:prop.outld?`${prop.mye.mycol.primarycol} solid 1px`:'none',
        backgroundColor:prop.outld?'transparent':prop.bkg || prop.mye.mycol.primarycol
    }} onClick={prop.ocl}>
        <LrText 
        left={<prop.mye.HTv text={prop.text} size={12} color={prop.outld?prop.mye.mycol.primarycol:prop.mye.mycol.white} />}
        right={<prop.icon style={{
            fontSize:18,
            color:prop.outld?prop.mye.mycol.primarycol:prop.mye.mycol.white
        }}/>}
        />
    </div>
  }

  export function DatePicky(prop:{rdy:(day:Date)=>void,closy:()=>void,fromYear?:number,toYear?:number,focusYear?:number}){
    const[focusYear, setFocusYear] = useState(prop.focusYear || 1990)
    return <div id="lshdw" className="vlc" style={{
        width:300,
        backgroundColor:new myCols(false).white,
        padding:10,
        borderRadius:10,
    }}>
        <div id="clk" style={{
            alignSelf:'flex-end',
            padding:5
        }} onClick={prop.closy}>
            <Close className="icon" />
        </div>
        <LrText 
        left={<Btn smallie  width={80} txt="< year" onClick={()=>{
            setFocusYear(focusYear-1)
        }}/>}
        right={<Btn smallie  width={80} txt="year >" onClick={()=>{
            if(focusYear < (prop.toYear || (new Date().getFullYear()))){
                setFocusYear(focusYear+1)
            }
        }}/>}
        />
        <Mgin top={10} />
        <DayPicker key={focusYear}
            mode="single"
            toYear={prop.toYear || (new Date().getFullYear())}
            fromYear={prop.fromYear || 1940}
            onSelect={(d)=>{
                if(d){
                    prop.rdy(d)
                }
            }}
            defaultMonth={new Date(focusYear,1,1)}
            />
    </div>
  }

  export function isDigit(txt:string){
    return /^[0-9]+$/.test(txt)
  }

  export function isPartnerID(txt:string){
    return txt.length>0 && isDigit(txt)
  }

  export function getPayRef(payId:string,amt:string,user_id:string,uuid?:string){
    return `schoolsilo-${payId}-${amt}-${user_id}-${(uuid || Date.now().toString())}`
  }

  export function CopyMan(prop:{text:string,toast:()=>void}){
    const mye = new myEles(false)
    const textRef = useRef<HTMLInputElement | null>(null);
    const[copied,setCopied] = useState(false)
  
    const copyToClipboard = () => {
      textRef.current?.select();
      document.execCommand('copy');
      prop.toast()
      setCopied(true)
      setTimeout(()=>{
        setCopied(false)
      },3000)
    };
  
    return (
      <div className="hlc">
        <input
          type="text"
          ref={textRef}
          defaultValue={prop.text}
          style={{ display: 'none' }}
        />
        <CopyAllOutlined id="clk" style={{
            color: mye.mycol.primarycol,
            fontSize:20
        }} onClick={copyToClipboard} />
        <Mgin right={5} />
        <div style={{
            display: copied?undefined:'none'
        }}>
            <mye.Tv text="Copied!" color={mye.mycol.green} />
        </div>
      </div>
    );
  };
  

  export const schoolsilo_recaptcha_key = '6LcSDFUpAAAAACvhXLKW9yeuh9FWvSNHzc4LAovZ'

  export const pricePerShare = 10

  export const masterID = '5' //TODO set master ID
  export const masterEmail = 'admin@schoolsilo.cloud' 

  export const spin_genders:{[key:string]:string} = {
    'M': 'Male',
    'F': 'Female'
  }

  export const spin_marital:{[key:string]:string} = {
    'M': 'Married',
    'S': 'Single',
    'D': 'Divorced',
    'W': 'Widowed',
    'P': 'Separated',
  }

  export const spin_nok:{[key:string]:string} = {
    'S': 'Spouse',
    'P': 'Parent',
    'B': 'Sibling',
    'C': 'Child',
    'R': 'Relative',
    'F': 'Friend',
    'W': 'Colleague',
  }

  export const paystackPK = 'pk_live_39b85ea0d5511afec94de96966c1bf60f4b3ad37'