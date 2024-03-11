import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown, BusinessOutlined } from "@mui/icons-material"
import { useState, useEffect } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, hexToRgba, ErrorCont } from "../../../../helper/general"
import tabcard from "../../../../assets/tabcard.png"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { adminHighlights, adminUserEle, defVal, partnerBasicinfo, partnerFinancialinfo, partnerGeneralinfo, schoolBasicinfo, schoolGeneralinfo, schoolPropInfo, verifStat } from "../../../classes/models"
import { format } from "date-fns"
import { PoweredBySSS } from "../../../../helper/schoolsilo"



export function AdminDirList(mainprop:{actiony:(action:number,user:any,isSchool:boolean)=>void,me:adminUserEle}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[search, setSearch] = useState('')
    const[vpos, setVpos] = useState(1)
    const[isSchool,setIsSchool] = useState(true)
    const myKey = Date.now()
    const[optToShow,setOptToShow] = useState(-1)
    const[showingIndex,setShowingIndex] = useState(0)
    const[schools,setSchools] = useState<schoolBasicinfo[]>([])
    const[partners,setPartners] = useState<partnerBasicinfo[]>([])
    const[vStats,setVStats] = useState<verifStat>()
    
    

    function handleError(task:resHandler,noHarm?:boolean){
        setLoad(false)
        setError(!noHarm)
        if(task.isLoggedOut()){
            navigate(`/adminLogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    useEffect(()=>{
        setTitle(`Directory List - ${appName}`)
        getVS()
    },[])

    function getVS(dontGetUsers?:boolean){
        setLoad(true)
        setError(false)
        makeRequest.get('getVerificationStats',{},(task)=>{
            if(task.isSuccessful()){
                setVStats(new verifStat(task.getData()))
                if(dontGetUsers){
                    setLoad(false)
                }else{
                    getUsers(vpos,0,true)
                }
            }else{
                handleError(task)
            }
        })
    }

    function getUsers(vpos:number, index:number, isSchool:boolean){
        setOptToShow(-1)
        setVpos(vpos)
        setError(false)
        setIsSchool(isSchool)
        setLoad(true)
        makeRequest.get(`${isSchool?'getSchoolsByV':'getPartnersByV'}/${vpos}`,{
            start:(index*20),
            count:20
        },(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                if(isSchool){
                    const tem:schoolBasicinfo[] = []
                    for(const key in task.getData()){
                        const basic = task.getData()[key]['b']
                        const general = task.getData()[key]['g']
                        const mbi = new schoolBasicinfo(basic)
                        const mgi = new schoolGeneralinfo(general)
                        mbi.setGeneralData(mgi)
                        tem.push(mbi)
                    }
                    setSchools(tem)
                }else{
                    const tem:partnerBasicinfo[] = []
                    for(const key in task.getData()){
                        const basic = task.getData()[key]['b']
                        const general = task.getData()[key]['g']
                        const mbi = new partnerBasicinfo(basic)
                        const mgi = new partnerGeneralinfo(general)
                        mbi.setGeneralData(mgi)
                        tem.push(mbi)
                    }
                    setPartners(tem)
                }
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
            getVS()
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
        <div style={{
            display:'flex',
            width:'100%',
            flexWrap:'wrap',
            alignItems:'center'
        }}>
            <Tab1 icon={PersonOutline} title="Verified Members" value={vStats?isSchool?vStats.getSchoolVerif():vStats.getPartnersVerif():'...'} color={mye.mycol.primarycol} />
            <Tab1 icon={PersonOutline} title="Unverified Members" value={vStats?isSchool?vStats.getSchoolsNotVerif():vStats.getPartnersNotVerif():'...'} color={mye.mycol.primarycol} />
            <Tab1 icon={PersonOutline} title="Deleted Members" value={vStats?isSchool?vStats.getSchoolsDeleted():vStats.getPartnersDeleted():'...'} color={mye.mycol.red} />
        </div>
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
                    makeRequest.get(isSchool?'searchSchools':'searchPartners',{search:search},(task)=>{
                        setLoad(false)
                        if(task.isSuccessful()){
                            setVpos(3)
                            if(isSchool){
                                const tem:schoolBasicinfo[] = []
                                for(const key in task.getData()){
                                    const basic = task.getData()[key]['b']
                                    const general = task.getData()[key]['g']
                                    const mbi = new schoolBasicinfo(basic)
                                    const mgi = new schoolGeneralinfo(general)
                                    mbi.setGeneralData(mgi)
                                    tem.push(mbi)
                                }
                                setSchools(tem)
                            }else{
                                const tem:partnerBasicinfo[] = []
                                for(const key in task.getData()){
                                    const basic = task.getData()[key]['b']
                                    const general = task.getData()[key]['g']
                                    const mbi = new partnerBasicinfo(basic)
                                    const mgi = new partnerGeneralinfo(general)
                                    mbi.setGeneralData(mgi)
                                    tem.push(mbi)
                                }
                                setPartners(tem)
                            }
                            setShowingIndex(0)
                        }else{
                            toast('No Result',0)
                        }
                    })
                }} strip={search.length < 5} />
            </div>
        </div>
        <Mgin top={30} />
        <div style={{
            width:280,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Schools" round onClick={()=>{
                    getUsers(vpos,0, true)
                }} transparent={!isSchool} />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Partners" round onClick={()=>{
                    getUsers(vpos,0, false)
                }} transparent={isSchool}/>
            </div>
        </div>
        <Mgin top={10} />
        <LrText wrap={!dimen.dsk}
        left={vpos==3?<div style={{
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
                    getUsers(1,0, isSchool)
                }}  width={120}/>
            </div>
        </div>:<div style={{
            width:360,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Verified" round onClick={()=>{
                    getUsers(1,0, isSchool)
                }} transparent={vpos!=1} />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Unverified" round onClick={()=>{
                    getUsers(0,0, isSchool)
                }} transparent={vpos!=0}/>
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Deleted" round onClick={()=>{
                    getUsers(2,0, isSchool)
                }} transparent={vpos!=2}/>
            </div>
        </div>}
        right={<div className="flexi">
            <div>
                <OlnBtnPlus text="New User" ocl={()=>{
                    toast('In Dev',2)
                }} />
            </div>
            <Mgin right={10} />
            <OlnBtnPlus text="Bulk CSV" ocl={()=>{

            }} />
            <Mgin right={10} maxOut={!dimen.dsk} />
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
                {isSchool?<BusinessOutlined style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />:<PersonOutline style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />}
                <Mgin right={10}/>
                <mye.HTv text={isSchool?'Schools':"Partners"} size={16} color={mye.mycol.secondarycol} />
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
                        <MyCell text="ID"  isBold/>
                        <MyCell text="DOR"  isBold/>
                        <MyCell text="Name"  isBold/>
                        <MyCell text="State"  isBold/>
                        <MyCell text={isSchool?"Partner":"Code"}  isBold/>
                        <MyCell text="Email"  isBold/>
                        <MyCell text="Phone No."  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        isSchool?(schools).map((ele,index)=>{
                            return <div className="hlc" key={myKey+index+showingIndex*20}>
                                <MyCell text={ele.getSchoolID()} />
                                <MyCell text={ele.getRegDate()} />
                                <MyCell text={ele.getSchoolName()} />
                                <MyCell text={ele.generalData.getFormattedState()} />
                                <MyCell text={ele.getPartnerCode()} />
                                <MyCell text={ele.getEmail()} />
                                <MyCell text={ele.getPhone()} />
                                <Opts index={index} school={ele} rmvMe={()=>{
                                    const i = index+showingIndex*20
                                    const al = [...schools.slice(0, i), ...schools.slice(i + 1)]
                                    setSchools(al)
                                    getVS(true)
                                }} />
                            </div>
                        }):(partners).map((ele,index)=>{
                            return <div className="hlc" key={myKey+index+showingIndex*20}>
                                <MyCell text={ele.getPartnerID()} />
                                <MyCell text={ele.getRegDate()} />
                                <MyCell text={ele.getFirstName()+' '+ele.getMiddleName()} />
                                <MyCell text={ele.generalData.getFormattedState()} />
                                <MyCell text={ele.getPartnerID()} />
                                <MyCell text={ele.getEmail()} />
                                <MyCell text={ele.getPhone()} />
                                <Opts index={index} partner={ele} rmvMe={()=>{
                                    const i = index+showingIndex*20
                                    const al = [...partners.slice(0, i), ...partners.slice(i + 1)]
                                    setPartners(al)
                                    getVS(true)
                                }} />
                            </div>
                        })
                    }
                </div>
            </div>
            <Mgin top={20} />
            {vStats?<div className="hlc">
                <ArrowBack id="clk" className="icon" onClick={()=>{
                    if(showingIndex >0){
                        const index = showingIndex-1
                        getUsers(vpos,index, isSchool)
                    }
                }} />
                <Mgin right={10} />
                {
                    Array.from({length:Math.floor((vpos==1?isSchool?vStats.getSchoolVerif():vStats.getPartnersVerif()
                        :vpos==0?isSchool?vStats.getSchoolsNotVerif():vStats.getPartnersNotVerif()
                        :isSchool?vStats.getSchoolsDeleted():vStats.getPartnersDeleted())/20)+1},(_,index)=>{
                        return <div id="clk" key={myKey+index+10000} className="ctr" style={{
                            width:25,
                            height:25,
                            backgroundColor:showingIndex==index?mye.mycol.black:'transparent',
                            borderRadius:'50%'
                        }} onClick={()=>{
                            getUsers(vpos,index,isSchool)
                        }}>
                            <mye.BTv text={(index+1).toString()} color={showingIndex==index?mye.mycol.white:mye.mycol.black} size={16}/>
                        </div>
                    })
                }
                <Mgin right={10} />
                <ArrowForward id="clk" className="icon" onClick={()=>{
                    const len = Math.floor((vpos==1?isSchool?vStats.getSchoolVerif():vStats.getPartnersVerif()
                    :vpos==0?isSchool?vStats.getSchoolsNotVerif():vStats.getPartnersNotVerif()
                    :isSchool?vStats.getSchoolsDeleted():vStats.getPartnersDeleted())/20)
                    if(showingIndex < len){
                        const index = showingIndex+1
                        getUsers(vpos,index, isSchool)
                    }
                }} />
            </div>:<div></div>}
        </div>
        <PoweredBySSS />
    </div>

    function Opts(prop:{index:number, rmvMe:()=>void,school?:schoolBasicinfo,partner?:partnerBasicinfo}) {

        function doIt(action:number){

            function rndFin(){
                if(isSchool){
                    makeRequest.get(`getSchoolPropInfo/${prop.school!.getSchoolID()}`,{},(task)=>{
                        if(task.isSuccessful()){
                            prop.school!.setFinData(new schoolPropInfo(task.getData()))//Will suffice, even if it doesnt exist
                            mainprop.actiony(action,prop.school,isSchool)
                        }else{
                            handleError(task)
                        }
                    })
                }else{
                    makeRequest.get(`getPartnerFinancialInfo/${prop.partner!.getPartnerID()}`,{},(task)=>{
                        if(task.isSuccessful()){
                            prop.partner!.setFinData(new partnerFinancialinfo(task.getData()))//Will suffice, even if it doesnt exist
                            mainprop.actiony(action,prop.partner,isSchool)
                        }else{
                            handleError(task)
                        }
                    })
                }
            }

            if(isSchool && prop.school!.isPrepared()){
                mainprop.actiony(action,prop.school,isSchool)
            }else if(!isSchool && prop.partner!.isPrepared()){
                mainprop.actiony(action,prop.partner,isSchool)
            }else{
                rndFin()
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
                <div style={{
                    width:'100%',
                    display: (isSchool?prop.school!.isDeleted():prop.partner!.isDeleted())?'none':undefined
                }}>
                    {/* <MyCell text="Edit" ocl={()=>{
                        doIt(1)
                    }} alignStart special/>
                    <Line /> */}
                    <MyCell text={(isSchool?prop.school!.isVerified():prop.partner!.isVerified())?"Deactivate":"Approve"} ocl={()=>{
                        if(mainprop.me.getPerm('pd2')!='1'){
                            toast('You dont have permission to do this',0)
                            return
                        }
                        setLoad(true)
                        if(isSchool){
                            const ndata = {...prop.school!.data}
                            const value = prop.school!.isVerified()?'0':'1'
                            ndata['verif'] = value
                            makeRequest.post('setSchoolBasicInfo',ndata,(task)=>{
                                if(task.isSuccessful()){
                                    if(!prop.school!.isVerified()){
                                        if(prop.school!.getEmail()!=defVal){
                                            toast('Mailing user..',2)
                                            makeRequest.post('sendMail',{
                                                name: prop.school!.getSchoolName(),
                                                email: prop.school!.getEmail(),
                                                subject: "SCHOOLSILO Account Verified",
                                                body: `Your SCHOOLSILO account has been verified. Please wait up to 72 hours for us to prepare your portal:`,
                                                link: 'https://portal.schoolsilo.cloud/schoolLogin'
                                            },(task)=>{
                                                setLoad(false)
                                                if(task.isSuccessful()){
                                                    toast('Approval successful and user has been mailed',1)
                                                }else{
                                                    toast('APPROVAL SUCCESSFUL. But '+task.getErrorMsg(),2);
                                                }
                                                prop.school!.data['verif'] = value
                                                setOptToShow(-1)
                                                prop.rmvMe()
                                            })
                                        }else{
                                            setLoad(false)
                                            toast('Successful. But we could not mail user as no email was provided',2,10000)
                                            prop.school!.data['verif'] = value
                                            setOptToShow(-1)
                                            prop.rmvMe()
                                        }
                                    }else{
                                        setLoad(false)
                                        toast('Update successful',1)
                                        prop.school!.data['verif'] = value
                                        setOptToShow(-1)
                                        prop.rmvMe()
                                    }
                                }else{
                                    handleError(task,true)
                                }
                            })
                        }else{
                            const ndata = {...prop.partner!.data}
                            const value = prop.partner!.isVerified()?'0':'1'
                            ndata['verif'] = value
                            makeRequest.post('setPartnerBasicInfo',ndata,(task)=>{
                                if(task.isSuccessful()){
                                    if(!prop.partner!.isVerified()){
                                        if(prop.partner!.getEmail()!=defVal){
                                            toast('Mailing user..',2)
                                            makeRequest.post('sendMail',{
                                                name: prop.partner!.getFirstName(),
                                                email: prop.partner!.getEmail(),
                                                subject: "SCHOOLSILO Account Verified",
                                                body: `Your SCHOOLSILO account has been verified. You can now use the portal at:`,
                                                link: 'https://portal.schoolsilo.cloud/partnerLogin'
                                            },(task)=>{
                                                setLoad(false)
                                                if(task.isSuccessful()){
                                                    toast('Approval successful and user has been mailed',1)
                                                }else{
                                                    toast('APPROVAL SUCCESSFUL. But '+task.getErrorMsg(),2);
                                                }
                                                prop.partner!.data['verif'] = value
                                                setOptToShow(-1)
                                                prop.rmvMe()
                                            })
                                        }else{
                                            setLoad(false)
                                            toast('Successful. But we could not mail user as no email was provided',2,10000)
                                            prop.partner!.data['verif'] = value
                                            setOptToShow(-1)
                                            prop.rmvMe()
                                        }
                                    }else{
                                        setLoad(false)
                                        toast('Update successful',1)
                                        prop.partner!.data['verif'] = value
                                        setOptToShow(-1)
                                        prop.rmvMe()
                                    }
                                }else{
                                    handleError(task,true)
                                }
                            })
                        }
                    }} alignStart special />
                    <Line />
                </div>
                <MyCell text={(isSchool?prop.school!.isDeleted():prop.partner!.isDeleted())?"Restore":"Delete"} ocl={()=>{
                    if(mainprop.me.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    setLoad(true)
                    if(isSchool){
                        const ndata = {...prop.school!.data}
                        const value = prop.school!.isDeleted()?'0':'2'
                        ndata['verif'] = value
                        makeRequest.post('setSchoolBasicInfo',ndata,(task)=>{
                            if(task.isSuccessful()){
                                setLoad(false)
                                toast(`${prop.school!.isDeleted()?'Restored':'Deleted'} successfully`,1)
                                prop.school!.data['verif'] = value
                                setOptToShow(-1)
                                prop.rmvMe()
                            }else{
                                handleError(task,true)
                            }
                        })
                    }else{
                        const ndata = {...prop.partner!.data}
                        const value = prop.partner!.isDeleted()?'0':'2'
                        ndata['verif'] = value
                        makeRequest.post('setPartnerBasicInfo',ndata,(task)=>{
                            if(task.isSuccessful()){
                                setLoad(false)
                                toast(`${prop.partner!.isDeleted()?'Restored':'Deleted'} successfully`,1)
                                prop.partner!.data['verif'] = value
                                setOptToShow(-1)
                                prop.rmvMe()
                            }else{
                                handleError(task,true)
                            }
                        })
                    }
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
            {prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv text={prop.text} size={14} color={mye.mycol.imghint} hideOverflow />}
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

