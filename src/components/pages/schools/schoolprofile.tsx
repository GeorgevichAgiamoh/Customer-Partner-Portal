/* eslint-disable eqeqeq */
import { useEffect, useRef, useState } from "react";
import { Add, CalendarMonth, InfoOutlined } from "@mui/icons-material";
import coin from '../../assets/coin.png'
import thumb from '../../assets/thumbs.png'
import { MsgAlert, PoweredBySSS } from "../../../helper/schoolsilo";
import useWindowDimensions from "../../../helper/dimension";
import { myEles, setTitle, appName, Mgin, EditTextFilled, Btn, useQuery, ErrorCont, isEmlValid, isPhoneNigOk, LrText, DatePicky, IconBtn, LoadLay, spin_genders, spin_marital, spin_nok } from "../../../helper/general";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Toast from "../../toast/toast";
import { makeRequest } from "../../../helper/requesthandler";
import { format } from "date-fns";
import { mLoc } from "monagree-locs/dist/classes";
import { mCountry, mLga, mState } from "monagree-locs";
import { mBanks } from "monagree-banks";
import { schoolBasicinfo, schoolGeneralinfo, schoolPropInfo } from "../../classes/models";
import { getUserId } from "../../../helper/requesthandler";



export function SchoolProfile(mainprop:{goto:(action:number)=>void}){
    const qry = useQuery();
    const myKey = Date.now()
    const rdr = qry.get('rdr') ?? ''
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[rdy, setRdy] = useState(false)

    const[sname,setSName] = useState('')
    const[eml,setEml] = useState(qry.get('eml') ?? '')
    const[phn,setPhn] = useState('')
    const[pcode,setPcode] = useState('')

    const[logo,setLogo] = useState<File>()
    const[fileExists, setFileExists] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const[state,setState] = useState<mLoc>()
    const[lga,setLga] = useState<mLoc>()
    const[addr,setAddr] = useState('')
    const[vision,setVision] = useState('')
    const[mission,setMission] = useState('')
    const[values,setValues] = useState('')

    const[fname,setFname] = useState('')
    const[mname,setMname] = useState('')
    const[lname,setLname] = useState('')
    const[sex,setSex] = useState('')
    const[propPhn,setPropPhn] = useState('')
    const[propAddr,setPropAddr] = useState('')
    const[propEml,setPropEml] = useState('')

    const[sbi,setSbi] = useState<schoolBasicinfo>()

    const basicRef = useRef<HTMLDivElement>(null);
    const genRef = useRef<HTMLDivElement>(null);
        

    useEffect(()=>{
        setTitle(`School Profile - ${appName}`)
        getSchoolInfo()
    },[])

    function getSchoolInfo(){
        setError(false)
        setRdy(false)
        if(getUserId().length==0){
            navigate('/schoolLogin')
            return;
        }
        makeRequest.get(`getSchoolBasicInfo/${getUserId()}`,{},(task)=>{
            if(task.isSuccessful()){
                const sbi = new schoolBasicinfo(task.getData())
                setSName(sbi.getSchoolName())
                setEml(sbi.getEmail())
                setPhn(sbi.getPhone())
                setPcode(sbi.getPartnerCode())
                setSbi(sbi)
                makeRequest.get(`getSchoolGeneralInfo/${getUserId()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        if(task.exists()){
                            const sgi = new schoolGeneralinfo(task.getData())
                            setState(mState.getStateByCode(sgi.getCountry(), sgi.getState()))
                            setLga(mLga.getLgaByCode(sgi.getCountry(),sgi.getState(),sgi.getLga()))
                            setAddr(sgi.getAddr())
                            setVision(sgi.getVision())
                            setMission(sgi.getMission())
                            setValues(sgi.getValues())
                            
                        }
                        makeRequest.get(`getSchoolPropInfo/${getUserId()}`,{},(task)=>{
                            if(task.isSuccessful()){
                                if(task.exists()){
                                    const spi = new schoolPropInfo(task.getData())
                                    setFname(spi.getFirstName())
                                    setMname(spi.getMiddleName())
                                    setLname(spi.getLastName())
                                    setSex(spi.getGender())
                                    setPropPhn(spi.getPhone())
                                    setPropAddr(spi.getAddress())
                                    setPropEml(spi.getEmail())
                                }
                                setRdy(true)
                            }else{
                                if(task.isLoggedOut()){
                                    navigate('/schoolLogin')
                                    return
                                }
                                setError(true)
                            }
                        })
                    }else{
                        if(task.isLoggedOut()){
                            navigate('/schoolLogin')
                            return
                        }
                        setError(true)
                    }
                })
            }else{
                if(task.isLoggedOut()){
                    navigate('/schoolLogin')
                    return
                }
                setError(true)
            }
        })
        makeRequest.get(`fileExists/dp/${getUserId()}`,{},(task)=>{
            if(task.isSuccessful()){
                setFileExists(true)
            }
        })
    }

    function basicOk(){
        if(sname.length < 3){
            toast('Invalid School Name Input',0)
            return false
        }
        if(!isEmlValid(eml)){
            toast('Invalid School Email',0)
            return false
        }
        if(!isPhoneNigOk(phn)){
            toast('Invalid School Phone Number',0)
            return
        }
        if(pcode.length ==0){
            toast('Invalid Partner Code',0)
            return
        }
        return true
    }

    function propOK(){
        if(fname.length < 3 || lname.length < 3|| mname.length < 3){
            toast('Invalid Name Input',0)
            return false
        }
        if(sex.length == 0){
            toast('Please choose gender',0)
            return
        }
        if(propPhn.length < 10){
            toast('Invalid Proprietor Phone',0)
            return
        }
        if(propAddr.length < 3){
            toast('Invalid Proprietor Address',0)
            return
        }
        if(propEml.length < 6 || !isEmlValid(propEml)){
            toast('Invalid Proprietor Email',0)
            return
        }
        return true
    }

    function genOk(){
        if(!state){
            toast('Invalid State location Input',0)
            return
        }
        if(!lga){
            toast('Invalid LGA/City Input',0)
            return
        }
        if(addr.length < 3){
            toast('Invalid Address Input',0)
            return;
        }
        if(vision.length < 3){
            toast('Invalid School Vision Input',0)
            return
        }
        if(mission.length < 3){
            toast('Invalid School Mission Input',0)
            return
        }
        if(values.length < 3){
            toast('Invalid School Values Input',0)
            return
        }
        return true
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
    return <div className="vlc" style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            getSchoolInfo()
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
        {rdy?<div className="vlc" style={{
            width:dimen.dsk?500:'100%'
        }}>
            <Mgin top={40} />
            <mye.HTv text="Edit Your Profile" size={35} />
            <Mgin top={20} />
            <MsgAlert icon={InfoOutlined} mye={mye} msg="Fields marked * are compulsory" />
            <Mgin top={20} />
            <mye.BTv size={18} text="Section 1 - Basic Information" />
            <Mgin top={20} />
            <div ref={basicRef} style={{
                width:'100%'
            }}>
                <mye.Tv text="*Name Of School" />
                <Mgin top={5} />
                <EditTextFilled hint="School Name" value={sname} noSpace min={3} recv={(v)=>{
                    setSName(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Email Address" />
                <Mgin top={5} />
                <EditTextFilled hint="Enter Email Address" value={eml} noSpace min={0} recv={(v)=>{
                    setEml(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Phone Number" />
                <Mgin top={5} />
                <EditTextFilled hint="08012345678" value={phn} digi noSpace min={5} max={20} recv={(v)=>{
                    setPhn(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="Partner Code" />
                <Mgin top={5} />
                <EditTextFilled hint="Partner Code" disabled value={pcode} digi noSpace min={0} recv={(v)=>{
                    setPcode(v.trim())
                }} />
            </div>
            <Mgin top={60} />
            <mye.BTv size={18} text="Section 2 - General Profile" />
            <Mgin top={20} />
            <LrText wrap={!dimen.dsk}
            left={<div>
                <mye.Tv text="*School Logo"  />
                <Mgin top={5} />
                <mye.Tv text="Please upload your valid school logo" size={12} />
                <div style={{
                    display:fileExists?undefined:'none'
                }}>
                    <Mgin top={5} />
                    <mye.Tv text="Uploaded, but you can change it" size={12} color={mye.mycol.green} />
                </div>
                <div style={{
                    display:logo?undefined:'none'
                }}>
                    <Mgin top={5} />
                    <mye.Tv text={`${logo?logo.name:''} added`} size={14} color={mye.mycol.primarycol} />
                </div>
            </div>}
            right={<div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e)=>{
                        const file = e.target.files?.[0];
                        if(file){
                            setLogo(file)
                            toast('File Added',1)
                        }
                    }}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
               <IconBtn icon={Add} mye={mye} ocl={()=>{
                    fileInputRef.current?.click()
                }} text="ATTACH DOC" />
            </div>}
            />
            <Mgin top={10} />
            
            <div style={{
                width:'100%',
                marginTop:15,
            }}>
                <mye.Tv text="*State Of Origin" />
                <Mgin top={5}/>
                <select id="dropdown" name="dropdown" value={state?.getId()||''} onChange={(e)=>{
                    const ele = mState.getStateByCode('NG',e.target.value)
                    setState(ele)
                    setLga(undefined)
                    
                }}>
                    <option value="">Choose One</option>
                    {
                        mState.getStatesByCountry('NG',true).map((ele, index)=>{
                            return <option key={myKey+index+1000} value={ele.getId()}>{ele.getName()}</option>
                        })
                    }
                </select>
            </div>
            <div style={{
                width:'100%',
                marginTop:15,
            }}>
                <mye.Tv text="*Local Government Area" />
                <Mgin top={5}/>
                <select id="dropdown" name="dropdown" value={lga?.getId()||''} onChange={(e)=>{
                    const ele = mLga.getLgaByCode('NG',state!.getId(),e.target.value)
                    setLga(ele)
                }}>
                    <option value="">Choose One</option>
                    {
                        (state)?mLga.getLgasByState('NG',state!.getId(),true).map((ele, index)=>{
                            return <option key={myKey+index+100} value={ele.getId()}>{ele.getName()}</option>
                        }):<option value="option1">Choose State First</option>
                    }
                </select>
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Official Address" />
                <Mgin top={5} />
                <EditTextFilled hint="Official Address" value={addr} min={3} recv={(v)=>{
                    setAddr(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Vision" />
                <Mgin top={5} />
                <EditTextFilled hint="School Vision" value={vision} singleLine={false} min={3} recv={(v)=>{
                    setVision(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Mission" />
                <Mgin top={5} />
                <EditTextFilled singleLine={false} hint="School Mission" value={mission} min={3} recv={(v)=>{
                    setMission(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Core Values" />
                <Mgin top={5} />
                <EditTextFilled singleLine={false} hint="School Core values" value={values} min={3} recv={(v)=>{
                    setValues(v.trim())
                }} />
            </div>
            <Mgin top={60} />
            <mye.BTv size={18} text="Section 3 - Proprietor Information" />
            <Mgin top={20} />
            <div className="hlc" style={{
                width:'100%'
            }}>
                <div style={{
                    flex:1
                }}>
                    <mye.Tv text="*First Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="First Name" value={fname} noSpace min={3} recv={(v)=>{
                        setFname(v.trim())
                    }} />
                </div>
                <div style={{
                    flex:1,
                    marginLeft:20
                }}>
                    <mye.Tv text="Middle Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="Middle Name" value={mname} noSpace min={3} recv={(v)=>{
                        setMname(v.trim())
                    }} />
                </div>
                <div style={{
                    flex:1,
                    marginLeft:20
                }}>
                    <mye.Tv text="*Last Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="Last Name" value={lname} noSpace min={3} recv={(v)=>{
                        setLname(v.trim())
                    }} />
                </div>
            </div>
            <Mgin top={20} />
            <div style={{
                width:'100%',
            }}>
                <mye.Tv text="*Gender" />
                <Mgin top={5}/>
                <select id="dropdown" name="dropdown" value={sex} onChange={(e)=>{
                    setSex(e.target.value)
                }}>
                    <option value="">Click to Choose</option>
                    {Object.entries(spin_genders).map(([key,value],i)=>{
                        return <option key={myKey+i+0.2123} value={key}>{value}</option>
                    })}
                </select>
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Phone Number Of Proprietor" />
                <Mgin top={5} />
                <EditTextFilled hint="08012345678" value={propPhn} digi noSpace min={11} max={11} recv={(v)=>{
                    setPropPhn(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Residential Address Of Proprietor" />
                <Mgin top={5} />
                <EditTextFilled hint="Address Of Proprietor" value={propAddr} noSpace min={3} recv={(v)=>{
                    setPropAddr(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Email Address" />
                <Mgin top={5} />
                <EditTextFilled hint="Enter Email Address" value={propEml} noSpace min={6} recv={(v)=>{
                    setPropEml(v.trim())
                }} />
            </div>
            <Mgin top={35} />
            <Btn txt="SUBMIT ALL" onClick={()=>{
                if(!basicOk()){
                    if (basicRef.current) {
                        basicRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                    return;
                }
                if(!genOk()){
                    if (genRef.current) {
                        genRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                    return
                }
                if(!propOK()){
                    return
                }
                setLoad(true)
                makeRequest.post('setSchoolBasicInfo',{
                    user_id:getUserId(),
                    sname:sname,
                    eml:eml,
                    phn:phn,
                    verif:'0',
                    pcode: pcode,
                    pay: sbi?.isPaid()?'1':'0'
                },(task)=>{
                    if(task.isSuccessful()){
                        makeRequest.post('setSchoolGeneralInfo',{
                            user_id:getUserId(),
                            state:state!.getId(),
                            lga:lga!.getId(),
                            addr:addr,
                            vision:vision,
                            mission:mission,
                            values:values,
                        },(task)=>{
                            function finFinish(){
                                makeRequest.post('setSchoolPropInfo',{
                                    user_id:getUserId(),
                                    fname:fname,
                                    mname:mname,
                                    lname:lname,
                                    sex:sex,
                                    phn:propPhn,
                                    addr:propAddr,
                                    eml:propEml,
                                },(task)=>{
                                    setLoad(false)
                                    if(task.isSuccessful()){
                                        mainprop.goto(0)
                                    }else{
                                        if(task.isLoggedOut()){
                                            navigate('/schoolLogin')
                                            return
                                        }
                                        toast(task.getErrorMsg(),0)
                                    }
                                })
                            }
                            if(task.isSuccessful()){
                                if(!logo && fileExists){
                                    finFinish()
                                    return
                                }
                                toast('Almost there...',2)
                                makeRequest.uploadFile('dp',getUserId(),getUserId(),logo!, (task)=>{
                                    if(task.isSuccessful()){
                                        finFinish()
                                    }else{
                                        setLoad(false)
                                        if(task.isLoggedOut()){
                                            navigate('/schoolLogin')
                                            return
                                        }
                                        toast(task.getErrorMsg(),0)
                                    }
                                })
                            }else{
                                setLoad(false)
                                if(task.isLoggedOut()){
                                    navigate('/schoolLogin')
                                    return
                                }
                                toast(task.getErrorMsg(),0)
                            }
                        })
                    }else{
                        setLoad(false)
                        if(task.isLoggedOut()){
                            navigate('/schoolLogin')
                            return
                        }
                        toast(task.getErrorMsg(),0)
                    }
                })
            }} />
            <PoweredBySSS />
        </div>:LoadLay()}
    </div>

}


