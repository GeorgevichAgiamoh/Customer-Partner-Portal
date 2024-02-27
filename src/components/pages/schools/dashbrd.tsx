import { PersonOutline, VolumeUpOutlined, ArrowRightOutlined, ArrowCircleRightOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import useWindowDimensions from "../../../helper/dimension";
import { myEles, setTitle, appName, Mgin, LrText, icony, ErrorCont, hexToRgba, CopyMan, goUrl } from "../../../helper/general";
import { annEle, schoolBasicinfo, schoolGeneralinfo } from "../../classes/models";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, LinearProgress } from "@mui/material";
import Toast from "../../toast/toast";
import { makeRequest, resHandler } from "../../../helper/requesthandler";
import { PoweredBySSS, getGreeting } from "../../../helper/schoolsilo";
import tabcard from "../../../assets/tabcard.png"




export function SchoolDashboard(mainprop:{sbi:schoolBasicinfo,sgi?:schoolGeneralinfo,goto:(action:number)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const myKey = Date.now()
    const dimen = useWindowDimensions();
    const[anns,setAnns] = useState<annEle[]>([])


    useEffect(()=>{
        setTitle(`School Dashboard - ${appName}`)
        getAnns()
    },[])

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/schoolLogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function getAnns(){
        setError(false)
        makeRequest.get('getAnnouncements',{},(task)=>{
            if(task.isSuccessful()){
                const tem:annEle[] = []
                for(const key in task.getData()){
                    tem.push(new annEle(task.getData()[key]))
                }
                setAnns(tem)
            }else{
                handleError(task)
            }
        })
    }


    const[load, setLoad]=useState(false)
    const[loadMsg, setLoadMsg]=useState('Just a sec')
    const[error, setError]=useState(false)
    const[toastMeta, setToastMeta] = useState({visible: false,msg: "",action:2,invoked:0})
    const[timy, setTimy] = useState<{timer?:NodeJS.Timeout}>({timer:undefined});
    function toast(msg:string, action:number,delay?:number){
      var _delay = delay || 5000
      setToastMeta({
          action: action,
          msg: msg,
          visible:true,
          invoked: Date.now()
      })
      clearTimeout(timy.timer)
      setTimy({
          timer:setTimeout(()=>{
              if(Date.now()-toastMeta.invoked > 4000){
                  setToastMeta({
                      action:2,
                      msg:"",
                      visible:false,
                      invoked: 0
                  })
              }
          },_delay)
      });
    }


    return <div style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getAnns()
        }}/>
        <div className="prgcont" style={{display:load?"flex":"none"}}>
            <div className="hlc" style={{
                backgroundColor:mye.mycol.bkg,
                borderRadius:10,
                padding:20,
            }}>
                <CircularProgress style={{color:mye.mycol.primarycol}}/>
                <Mgin right={20} />
                <mye.Tv text={loadMsg} />
            </div>
        </div>
        <Toast isNgt={false} msg= {toastMeta.msg} action={toastMeta.action} visible={toastMeta.visible} canc={()=>{
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked:0,
                })
            }} />
        <Mgin top={20} />
        <div>
            <mye.HTv text={`Hello, ${mainprop.sbi.getSchoolName()}`} size={26} color={mye.mycol.primarycol} />
            <Mgin top={20} />
            <mye.Tv text={`Good ${getGreeting()}, welcome to your dashboard`} />
        </div>
        <Mgin top={30} />
        <div id="lshdw" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?40:20,
            boxSizing:'border-box',
            width:'100%'
        }}>
            <LrText 
            left={<div className="hlc">
                <PersonOutline style={{
                    fontSize:25,
                    color: mye.mycol.secondarycol
                }} />
                <Mgin right={10} />
                <mye.BTv text="Account Verification" size={20} color={mye.mycol.secondarycol} />
            </div>}

            right={<div style={{
                padding:'5px 10px',
                borderRadius:50,
                backgroundColor: mainprop.sbi.isVerified()?mye.mycol.greenstrip:mye.mycol.redstrip
            }}>
                <mye.Tv text={mainprop.sbi.isVerified()?'Verified':'Unverified'} color={mainprop.sbi.isVerified()?mye.mycol.green:mye.mycol.red} />
            </div>}
            />
            <Mgin top={15} />
            <div style={{
                backgroundColor: mye.mycol.imghintr2,
                borderRadius:10,
                padding:10,
                width:'100%',
                display:'flex',
                alignItems:'center'
            }}>
                <div style={{
                    flex:1
                }}>
                    <LinearProgress variant="determinate" value={(mainprop.sbi.isVerified() && mainprop.sgi)?100:(mainprop.sgi)?50:25} 
                    sx={{
                        height: 10, // Set the height of the progress bar
                        borderRadius: 5, // Set the border radius for rounded corners
                        backgroundColor: mye.mycol.imghintr2, // Set the background color
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#4caf50', // Set the progress bar color
                        },
                      }} />
                </div>
                <Mgin right={10} />
                <mye.BTv text={((mainprop.sbi.isVerified() && mainprop.sgi)?'100':(mainprop.sgi)?'50':'25')+'%'} color={mye.mycol.primarycol} size={20}  />
            </div>
            <Mgin top={15} />
            <LrText 
            left={<mye.Tv text="" />}
            right={<div id="clk" className="hlc" onClick={()=>{
                    mainprop.goto(3)
                }} >
                <mye.Tv text="Continue Verification" color={mye.mycol.primarycol}/>
                <Mgin right={5} />
                <ArrowCircleRightOutlined className="icon" />
            </div>}
            />
        </div>
        {/* <Mgin top={20} />
        <Tab1  title="Portal Link" value={`https://schoolsilo.cloud/portal/${mainprop.sbi.getSchoolID()}`} isLink color={mye.mycol.green} /> */}
        <Mgin top={40} />
        <div id="lshdw" style={{
            width:'100%',
            padding:20,
            boxSizing:'border-box',
            backgroundColor:mye.mycol.bkg,
            borderRadius:10,
        }}>
            <div className="hlc">
                <VolumeUpOutlined style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text="Announcement" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            {
                anns.map((ann,index)=>{
                    return <AnnLay ele={ann} key={index+myKey+1} />
                })
            }
             <Mgin top={20} />
             <div id="clk" className="hlc" onClick={()=>{

             }}>
                <mye.HTv text="View Announcements" color={mye.mycol.primarycol} size={12} />
                <Mgin right={10} />
                <ArrowRightOutlined className="icon" />
             </div>
        </div>
        <PoweredBySSS />
    </div>

    
    

    function AnnLay(prop:{ele:annEle}) {
        return <div style={{
            width:'100%',
            boxSizing:'border-box',
            padding:10
        }}>
            <div style={{
                width:'100%',
                display:'flex',
                alignItems:'center'
            }}>
                <div style={{
                    flex:2,
                    boxSizing:'border-box',
                    paddingRight:dimen.dsk2?100:dimen.dsk?50:20
                }}>
                    <mye.Tv text={prop.ele.getMsg()} color={mye.mycol.imghint} maxLines={2} size={12} />
                </div>
                <div style={{
                    flex:1,
                }}>
                    <LrText 
                    left={<mye.Tv text={prop.ele.getTime()} size={12} color={mye.mycol.primarycol} />}
                    right={<mye.Tv text={'View'} size={12} color={mye.mycol.primarycol} onClick={()=>{

                    }} />}
                    />
                </div>
            </div>
            <Mgin top={10} />
            <div style={{width:'100%',height:1,backgroundColor:'rgba(0,0,0,0.1)'}}></div>
        </div>
    }

    function Tab1(prop:{title:string, value:string, icon?:icony, color:string, isLink?:boolean}) {
        
        return <div id="lshdw" style={{
            width: dimen.dsk?300:'100%',
            margin: dimen.dsk?20:'10px 0px',
            height:150,
            boxSizing:'border-box',
            position:'relative',
            borderRadius:10,
            backgroundImage: `url(${tabcard})`,
            backgroundSize: 'cover',
        }}>
            <div className="ctr" style={{
                width:70,
                height:70,
                backgroundColor:hexToRgba(prop.color,0.1),
                borderRadius:'50%',
                position:'absolute',
                top:20,
                right:20
            }}>
                {prop.icon?<prop.icon style={{
                    fontSize:20,
                    color: prop.color
                }} />:<div></div>}
            </div>
            <div style={{
                position:'absolute',
                left:20,
                bottom:20
            }}>
                <mye.Tv text={prop.title} color={mye.mycol.primarycol} />
                <Mgin top={10}/>
                {prop.isLink?<div className="hlc">
                    <mye.Tv text={prop.value} color={mye.mycol.primarycol } onClick={()=>{
                        goUrl(prop.value)
                    }} />
                    <Mgin right={2} />    
                    <CopyMan text={prop.value} toast={()=>{
                        toast('Link Copied',2)
                    }}  />
                </div>:<mye.BTv text={prop.value} size={20}  />}
            </div>
        </div>
    }

}