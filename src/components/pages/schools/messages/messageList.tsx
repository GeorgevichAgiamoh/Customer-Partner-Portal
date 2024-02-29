import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown, SavingsOutlined, MessageOutlined, AddOutlined, ArrowRight } from "@mui/icons-material"
import { useState, useEffect } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, ErrorCont, hexToRgba, EditTextFilled, masterID, masterEmail } from "../../../../helper/general"
import Barcode from "react-barcode"
import { msgStat, msgThread, partnerBasicinfo, schoolBasicinfo, } from "../../../classes/models"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { getUserId, makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { PoweredBySSS } from "../../../../helper/schoolsilo"
import tabcard from "../../../../assets/tabcard.png"
import naira from "../../../../assets/naira.png"



export function SchoolMessagesList(mainprop:{sbi:schoolBasicinfo,actiony:(thread:msgThread, action:number)=>void, backy:()=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[search, setSearch] = useState('')
    const[showSearch, setShowSearch] = useState(false)
    const[showPicker, setShowPicker] = useState(false)
    const myKey = Date.now()
    const[optToShow,setOptToShow] = useState(-1)
    const[showingIndex,setShowingIndex] = useState(0)
    const[threads,setThreads] = useState<msgThread[]>([])
    const[stat,setStat] = useState<msgStat>()
    

    useEffect(()=>{
        setTitle(`My Messages - ${appName}`)
        getStats()
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

    function getStats(dontGetMsgs?:boolean){
        setLoad(true)
        setError(false)
        makeRequest.get(`getMyMessagesStat/${getUserId()}`,{},(task)=>{
            if(task.isSuccessful()){
                setStat(new msgStat(task.getData()))
                if(dontGetMsgs){
                    setLoad(false)
                }else{
                    getThreads(0)
                }
            }else{
                handleError(task)
            }
        })
    }

    function getThreads(index:number){
        setShowSearch(false)
        setError(false)
        setLoad(true)
        makeRequest.get(`getMyMessages/${getUserId()}`,{
            start:(index*20),
            count:20
        },(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:msgThread[] = []
                for(const key in task.getData()){
                    tem.push(new msgThread(task.getData()[key]))
                }
                setThreads(tem)
                setShowingIndex(index)
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
            getStats()
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
        {/* <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy()
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div> */}
        <Mgin top={20} />
        <div style={{
            width:dimen.dsk?500:'100%',
            display:'flex',
            margin: dimen.dsk?10:5,
        }}>
            <div className="hlc" id="lshdw" style={{
                flex:1,
                backgroundColor:mye.mycol.white,
                borderRadius:10,
            }}>
                <Mgin right={15} />
                <SearchOutlined style={{
                    fontSize:20,
                    color:mye.mycol.imghint
                }} />
                <Mgin right={5} />
                <input className="tinp"
                    type="text"
                    value={search}
                    placeholder="Search Message By Subject"
                    onChange={(e)=>{
                        setSearch(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchIt()
                        }
                    }}
                    style={{
                        width:'100%',
                    }}
                />
            </div>
            <Mgin right={10} />
            <div style={{
                width:100
            }}>
                <Btn txt="Search" onClick={()=>{
                    searchIt()
                }} strip={search.length < 5} />
            </div>
        </div>
        <Mgin top={30} />
        <div style={{
            display:'flex',
            width:'100%',
            flexWrap:'wrap',
            alignItems:'center'
        }}>
            <Tab1 icon={MessageOutlined} title="Total Messages" value={stat?stat.getTotalMessages():'...'} color={mye.mycol.hs_blue} />
        </div>
        <Mgin top={20} />
        <LrText wrap={!dimen.dsk}
        left={showSearch?<div style={{
            width:250,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Search Result" round onClick={()=>{
                    
                }} width={150} transparent />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Close Search" round onClick={()=>{
                    getThreads(0)
                }}  width={120}/>
            </div>
        </div>:<div style={{
            width:250,
            display:'flex'
        }}></div>}
        right={<div className="flexi">
            <IconBtn icon={AddOutlined} mye={mye} text="New Message" ocl={()=>{
                setShowPicker(true)
            }} width={140} />
        </div>}
        />
        <Mgin top={15} />
        <div className="vlc" id='lshdw' style={{
            width:'100%',
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?20:10,
            boxSizing:'border-box'
        }}>
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <MessageOutlined style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text={'Messages'} size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                <div style={{
                    width:dimen.dsk2?'100%':undefined,
                    paddingBottom:optToShow!=-1?150:0,
                }}>
                    <div className="hlc">
                        <MyCell text="Chat"  isBold/>
                        <MyCell text="Message"  isBold  special/>
                        <MyCell text="Date"  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        threads.slice((showingIndex*20),(showingIndex*20+20)).map((ele,index)=>{
                            return <div id="clk" className="hlc" key={myKey+index+showingIndex*20} onClick={()=>{
                                mainprop.actiony(ele,1)
                            }}>
                                <MyCell text={ele.amFrom()?ele.getToName():ele.getFromName()} />
                                <MyCell text={ele.getLastMsg()} special />
                                <MyCell text={ele.getLastUpdated()} />
                                <Opts index={index} thread={ele} />
                            </div>
                        })
                    }
                </div>
            </div>
            <Mgin top={20} />
            <div className="hlc">
                <ArrowBack id="clk" className="icon" onClick={()=>{
                    if(showingIndex >0){
                        const index = showingIndex-1
                        getThreads(index)
                    }
                }} />
                <Mgin right={10} />
                {
                    Array.from({length:Math.floor((stat?stat.getTotalMessages():0)/20)+1},(_,index)=>{
                        return <div id="clk" key={myKey+index+10000} className="ctr" style={{
                            width:25,
                            height:25,
                            backgroundColor:showingIndex==index?mye.mycol.black:'transparent',
                            borderRadius:'50%'
                        }} onClick={()=>{
                            getThreads(index)
                        }}>
                            <mye.BTv text={(index+1).toString()} color={showingIndex==index?mye.mycol.white:mye.mycol.black} size={16}/>
                        </div>
                    })
                }
                <Mgin right={10} />
                <ArrowForward id="clk" className="icon" onClick={()=>{
                    const len = Math.floor((stat?stat.getTotalMessages():0)/20)
                    console.log(len)
                    console.log(showingIndex)
                    if(showingIndex < len){
                        const index = showingIndex+1
                        getThreads(index)
                    }
                }} />
            </div>
        </div>
        <PoweredBySSS />
        {/* Absolutely positioned (dialog) */}
        <div className="ctr" style={{
            display:showPicker?undefined:'none',
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            boxSizing:'border-box',
            backgroundColor:'rgba(0,0,0,0.1)',
            padding: dimen.dsk?'10% 25%':0
        }}>
            <PickMsgReceiver closy={()=>{
                setShowPicker(false)
            }} rdy={(subject)=>{
                setLoad(true)
                makeRequest.post('createMsgThread',{
                    from: mainprop.sbi.getSchoolName(),
                    from_uid: mainprop.sbi.getSchoolID(),
                    to: 'Admin',
                    to_uid: masterID,
                    last_msg:'New Message',
                    subject: subject,
                    from_mail: mainprop.sbi.getEmail(),
                    to_mail:masterEmail
                },(task)=>{
                    setLoad(false)
                    if(task.isSuccessful()){
                        const thread = new msgThread(task.getData())
                        mainprop.actiony(thread,1)
                    }else{
                        toast(task.getErrorMsg(),0)
                    }
                })
            }} />
        </div>
    </div>

    function searchIt() {
        const sc = search.trim()
        if(sc.length < 5){
            toast('Enter at least 5 characters',0)
            return;
        }
        setLoad(true)
        makeRequest.get('searchMsgThread',{search:search},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                console.log(task.getData())
                const tem:msgThread[] = []
                for(const key in task.getData()){
                    const thread = new msgThread(task.getData()[key])
                    tem.push(thread)
                }
                setThreads(tem)
                setShowSearch(true)
            }else{
                toast('No Result',0)
            }
        })
    }

    

    function Opts(prop:{index:number,thread:msgThread}) {
        return <div className="ctr" style={{
            flex:(dimen.dsk2)?1:undefined,
            width:(dimen.dsk2)?undefined:100,
            height:40,
            position:'relative'
        }}>
            <div id="clk" className="ctr" style={{
                width:40,
                height:40
            }} onClick={()=>{
                setOptToShow(prop.index)
            }}>
                <MoreVert className="icon" />
            </div>
            <div className="vlc" id="lshdw" style={{
                display:optToShow==prop.index?undefined:'none',
                backgroundColor:mye.mycol.white,
                borderRadius:10,
                width:100,
                position:'absolute',
                top:30,
                left:0,
                zIndex:10
            }}>
                <Close style={{
                    margin:5,
                    fontSize:15,
                    alignSelf:'flex-end',
                    color:mye.mycol.imghint
                }} onClick={()=>{
                    setOptToShow(-1)
                }} />
                <MyCell text="View" ocl={()=>{
                    mainprop.actiony(prop.thread,1)
                }} alignStart special />
            </div>
        </div>
    }

    function MyCell(prop:{text:string,isBold?:boolean,alignStart?:boolean,ocl?:()=>void, special?:boolean, tCol?:string}) {
        return <div id={prop.special?'clk':undefined} className="ctr" style={{
            flex:(dimen.dsk2 && !prop.special)?1:undefined,
            width:(dimen.dsk2 && !prop.special)?undefined:100,
            height:40,
            padding:prop.alignStart?'0px 10px':undefined,
            boxSizing:'border-box',
            alignItems: prop.alignStart?'start':'center'
        }} onClick={()=>{
            setOptToShow(-1)
            if(prop.ocl){
                prop.ocl()
            }
        }}>
            {prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv text={prop.text} maxLines={2} size={14} color={prop.tCol||mye.mycol.imghint} hideOverflow />}
        </div>
    }

    function FiltrLay(prop:{icon:icony,text:string}) {
        return <div id="lshdw" className="hlc" style={{
            padding:10,
            width:dimen.dsk?150:100,
            margin: dimen.dsk?10:5,
            backgroundColor:mye.mycol.white,
            borderRadius:10,
        }}>
            <prop.icon style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
            <Mgin right={7} />
            <div style={{
                flex:1
            }}>
                <mye.Tv text={prop.text} color={mye.mycol.imghint} size={12}/>
            </div>
            <KeyboardArrowDown style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
        </div>
    }


    function Tab1(prop:{title:string, value:string, icon?:icony, color:string}) {
        
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
                }} />:<img src={naira} height={20} alt="." color={prop.color} />}
            </div>
            <div style={{
                position:'absolute',
                left:20,
                bottom:20
            }}>
                <mye.Tv text={prop.title} color={prop.color} />
                <Mgin top={10}/>
                <mye.BTv text={prop.value} size={20}  />
            </div>
        </div>
    }

}

function PickMsgReceiver(prop:{closy:()=>void, rdy:(subject:string)=>void} ) {
    const mye = new myEles(false)
    const myKey = Date.now()
    const[subject, setSubject] = useState('')



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
        backgroundColor:mye.mycol.bkg,
        borderRadius:10,
        padding:20,
        display:'flex',
        flexDirection:'column'
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
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
        <div className="vlc">
            <div id="clk" style={{
                alignSelf:'flex-end'
            }} onClick={()=>{
                prop.closy()
            }}>
                <Close className="icon" />
            </div>
        </div>
        <Mgin top={20} />
        <mye.Tv text="Message Subject" size={14} />
        <Mgin top={10} />
        <EditTextFilled hint="Message Subject" value={subject} min={3} recv={(v)=>{
            setSubject(v)
        }} />
        <Mgin top={10} />
        <Btn txt="SUBMIT" onClick={()=>{
            if(subject.length <3){
                toast('Please enter message subject',0)
                return
            }
            prop.rdy(subject)
        }} />
    </div>
}