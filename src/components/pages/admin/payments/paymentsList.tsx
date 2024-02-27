import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown } from "@mui/icons-material"
import { useState, useEffect } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, hexToRgba, ErrorCont } from "../../../../helper/general"
import tabcard from "../../../../assets/tabcard.png"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { getUserId, makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { adminUserEle, defVal, partnerHighlights, payStat, schoolBasicinfo, schoolGeneralinfo, schoolPropInfo } from "../../../classes/models"
import { format } from "date-fns"
import { PoweredBySSS } from "../../../../helper/schoolsilo"



export function AdminPaymenysList(mainprop:{actiony:(action:number,user?:schoolBasicinfo)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[search, setSearch] = useState('')
    const myKey = Date.now()
    const[isSearching, setIsSearching] = useState(false)
    const[showPaid, setShowPaid] = useState(false)
    const[optToShow,setOptToShow] = useState(-1)
    const[showingIndex,setShowingIndex] = useState(0)
    const[infos,setInfos] = useState<schoolBasicinfo[]>([])
    const[stat, setStat] = useState<payStat>()
    
    

    function handleError(task:resHandler,noHarm?:boolean){
        setLoad(false)
        setError(!noHarm)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    useEffect(()=>{
        setTitle(`School Payments List - ${appName}`)
        getStats()
    },[])

    function getStats(dontgetschools?:boolean){
        setError(false)
        setLoad(true)
        makeRequest.get(`getPaymentStats`,{},(task)=>{
            if(task.isSuccessful()){
                setStat(new payStat(task.getData()))
                if(!dontgetschools){
                    getSchools(0, showPaid)
                }
            }else{
                handleError(task)
            }
        })
    }

    function getSchools(index:number, paid:boolean){
        setShowPaid(paid)
        setIsSearching(false)
        setOptToShow(-1)
        setError(false)
        setLoad(true)
        makeRequest.get(`getSchoolsByPay/${paid?'1':'0'}`,{
            start:(index*20),
            count:20
        },(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:schoolBasicinfo[] = []
                for(const key in task.getData()){
                    const basic = task.getData()[key]['b']
                    const general = task.getData()[key]['g']
                    const mbi = new schoolBasicinfo(basic)
                    const mgi = new schoolGeneralinfo(general)
                    mbi.setGeneralData(mgi)
                    tem.push(mbi)
                }
                setInfos(tem)
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
                    placeholder="Search"
                    onChange={(e)=>{
                        setSearch(e.target.value)
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
                    const sc = search.trim()
                    if(sc.length < 5){
                        toast('Enter at least 5 characters',0)
                        return;
                    }
                    setLoad(true)
                    makeRequest.get('searchSchools',{search:search},(task)=>{
                        setLoad(false)
                        if(task.isSuccessful()){
                            setIsSearching(true)
                            const tem:schoolBasicinfo[] = []
                            for(const key in task.getData()){
                                const basic = task.getData()[key]['b']
                                const general = task.getData()[key]['g']
                                const mbi = new schoolBasicinfo(basic)
                                const mgi = new schoolGeneralinfo(general)
                                mbi.setGeneralData(mgi)
                                tem.push(mbi)
                            }
                            setInfos(tem)
                            setShowingIndex(0)
                        }else{
                            toast('No Result',0)
                        }
                    })
                }} strip={search.length < 5} />
            </div>
        </div>
        <Mgin top={30} />
        <LrText wrap={!dimen.dsk}
        left={isSearching?<div style={{
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
                    getSchools(0,showPaid)
                }}  width={120}/>
            </div>
        </div>:<div style={{
            width:280,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Not Paid" round onClick={()=>{
                    getSchools(0, true)
                }} transparent={!showPaid} />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Paid" round onClick={()=>{
                    getSchools(0, false)
                }} transparent={showPaid}/>
            </div>
        </div>}
        right={<div className="flexi">
            <IconBtn icon={CloudDownloadOutlined} mye={mye} text="Download" ocl={()=>{

            }} />
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
                <PersonOutline style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text="Customers" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                <div style={{
                    width:dimen.dsk2?'100%':undefined,
                    paddingBottom:optToShow!=-1?200:0,
                }}>
                    <div className="hlc">
                        <MyCell text="S/N"  isBold/>
                        <MyCell text="DOR"  isBold/>
                        <MyCell text="Name"  isBold/>
                        <MyCell text="State"  isBold/>
                        <MyCell text="Email"  isBold/>
                        <MyCell text="Phone No."  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        infos.map((ele,index)=>{
                            return <div className="hlc" key={myKey+index+showingIndex*20}>
                                <MyCell text={(index+1+showingIndex*20).toString()} />
                                <MyCell text={ele.getRegDate()} />
                                <MyCell text={ele.getSchoolName()} />
                                <MyCell text={ele.generalData.getFormattedState()} />
                                <MyCell text={ele.getEmail()} />
                                <MyCell text={ele.getPhone()} />
                                <Opts index={index} user={ele} rmvMe={()=>{
                                    const i = index+showingIndex*20
                                    const al = [...infos.slice(0, i), ...infos.slice(i + 1)]
                                    setInfos(al)
                                    getStats(true)
                                }} />
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
                        getSchools(index,showPaid)
                    }
                }} />
                <Mgin right={10} />
                {
                    Array.from({length:Math.floor((stat?showPaid?stat.getSchoolsPaid():stat.getSchoolsNotPaid():0)/20)+1},(_,index)=>{
                        return <div id="clk" key={myKey+index+10000} className="ctr" style={{
                            width:25,
                            height:25,
                            backgroundColor:showingIndex==index?mye.mycol.black:'transparent',
                            borderRadius:'50%'
                        }} onClick={()=>{
                            getSchools(index,showPaid)
                        }}>
                            <mye.BTv text={(index+1).toString()} color={showingIndex==index?mye.mycol.white:mye.mycol.black} size={16}/>
                        </div>
                    })
                }
                <Mgin right={10} />
                <ArrowForward id="clk" className="icon" onClick={()=>{
                    const len = Math.floor((stat?showPaid?stat.getSchoolsPaid():stat.getSchoolsNotPaid():0)/20)
                    if(showingIndex < len){
                        const index = showingIndex+1
                        getSchools(index,showPaid)
                    }
                }} />
            </div>
        </div>
        <PoweredBySSS />
    </div>

    function Opts(prop:{index:number,user:schoolBasicinfo, rmvMe:()=>void}) {

        function doIt(action:number){

            function rndFin(){
                makeRequest.get(`getSchoolPropInfo/${prop.user.getSchoolID()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        prop.user.setFinData(new schoolPropInfo(task.getData()))//Will suffice, even if it doesnt exist
                        mainprop.actiony(action,prop.user)
                    }else{
                        handleError(task)
                    }
                })
            }

            if(prop.user.isPrepared()){
                mainprop.actiony(action,prop.user)
            }else{
                setLoad(true) //~
                if(prop.user.generalData.data == null){
                    makeRequest.get(`getSchoolGeneralInfo/${prop.user.getSchoolID()}`,{},(task)=>{
                        if(task.isSuccessful()){
                            prop.user.setGeneralData(new schoolGeneralinfo(task.getData()))//Will suffice, even if it doesnt exist
                            rndFin()
                        }else{
                            handleError(task)
                        }
                    })
                }else{
                    rndFin()
                }
            }
        }

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
                    doIt(0)
                }} alignStart special />
                <Line />
                <MyCell text={prop.user.isDeleted()?"Restore":"Delete"} ocl={()=>{
                   //TODO Can they?
                }} alignStart special />
            </div>
        </div>
    }

    function MyCell(prop:{text:string,isBold?:boolean,alignStart?:boolean,ocl?:()=>void, special?:boolean}) {
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
            {prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv text={prop.text} size={14} color={mye.mycol.imghint} />}
        </div>
    }

    function OlnBtnPlus(prop:{text:string,ocl:()=>void}) {
        return <div id="clk" className="hlc" style={{
            border: `solid ${mye.mycol.primarycol} 1px`,
            padding:9,
            borderRadius:10,
            width:100
        }} onClick={prop.ocl}>
            <LrText 
            left={<mye.Tv text={prop.text} wrapit={false} color={mye.mycol.primarycol}/>}
            right={<Add className="icon" style={{
                fontSize:20
            }} />}
            />
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


    function Tab1(prop:{title:string, value:string, icon:icony, color:string}) {
        
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
                <prop.icon style={{
                    fontSize:20,
                    color: prop.color
                }} />
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

