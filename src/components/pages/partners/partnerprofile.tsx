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
import { partnerBasicinfo, partnerFinancialinfo, partnerGeneralinfo } from "../../classes/models";
import { getUserId } from "../../../helper/requesthandler";



export function PartnerProfile(mainprop:{goto:(action:number)=>void}){
    const qry = useQuery();
    const myKey = Date.now()
    const rdr = qry.get('rdr') ?? ''
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[rdy, setRdy] = useState(false)

    const[fname,setFName] = useState('')
    const[mname,setMName] = useState('')
    const[lname,setLName] = useState('')
    const[eml,setEml] = useState(qry.get('eml') ?? '')
    const[phn,setPhn] = useState('')

    const[state,setState] = useState<mLoc>()
    const[lga,setLga] = useState<mLoc>()
    const[addr,setAddr] = useState('')
    const[sex,setSex] = useState('')

    const[bnk,setBnk] = useState('')
    const[anum,setANum] = useState('')
    const[aname,setAName] = useState('')

    const[mbi,setMbi] = useState<partnerBasicinfo>()

    const basicRef = useRef<HTMLDivElement>(null);
    const genRef = useRef<HTMLDivElement>(null);
        

    useEffect(()=>{
        setTitle(`Edit Your Profile - ${appName}`)
        getPartnerInfo()
    },[])

    function getPartnerInfo(){
        setError(false)
        setRdy(false)
        if(getUserId().length==0){
            navigate('/partnerLogin')
            return;
        }
        makeRequest.get(`getPartnerBasicInfo/${getUserId()}`,{},(task)=>{
            if(task.isSuccessful()){
                const mbi = new partnerBasicinfo(task.getData())
                setFName(mbi.getFirstName())
                setLName(mbi.getLastName())
                setMName(mbi.getMiddleName())
                setEml(mbi.getEmail())
                setPhn(mbi.getPhone())
                setMbi(mbi)
                makeRequest.get(`getPartnerGeneralInfo/${getUserId()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        if(task.exists()){
                            const mgi = new partnerGeneralinfo(task.getData())
                            setSex(mgi.getGender())
                            setState(mState.getStateByCode(mgi.getCountry(), mgi.getState()))
                            setLga(mLga.getLgaByCode(mgi.getCountry(),mgi.getState(),mgi.getLga()))
                            setAddr(mgi.getAddr())
                        }
                        makeRequest.get(`getPartnerFinancialInfo/${getUserId()}`,{},(task)=>{
                            if(task.isSuccessful()){
                                if(task.exists()){
                                    const mfi = new partnerFinancialinfo(task.getData())
                                    setBnk(mfi.getBankCode())
                                    setANum(mfi.getAccountNumber())
                                    setAName(mfi.getAccountName())
                                }
                                setRdy(true)
                            }else{
                                if(task.isLoggedOut()){
                                    navigate('/partnerLogin')
                                    return
                                }
                                setError(true)
                            }
                        })
                    }else{
                        if(task.isLoggedOut()){
                            navigate('/partnerLogin')
                            return
                        }
                        setError(true)
                    }
                })
            }else{
                if(task.isLoggedOut()){
                    navigate('/partnerLogin')
                    return
                }
                setError(true)
            }
        })
    }

    function basicOk(){
        if(fname.length < 3 || lname.length < 3){
            toast('Invalid Name Input',0)
            return false
        }
        if(!isEmlValid(eml)){
            toast('Invalid Email',0)
            return false
        }
        if(!isPhoneNigOk(phn)){
            toast('Invalid Phone Number',0)
            return
        }
        return true
    }

    function finOK(){
        if(bnk.length == 0){
            toast('Invalid Bank Input',0)
            return
        }
        if(anum.length < 10){
            toast('Invalid Account Number',0)
            return
        }
        if(aname.length < 3){
            toast('Invalid Account Name',0)
            return
        }
        return true
    }

    function genOk(){
        if(sex.length == 0){
            toast('Invalid gender Input',0)
            return
        }
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
            getPartnerInfo()
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
            <div ref={basicRef} className="hlc" style={{
                width:'100%'
            }}>
                <div style={{
                    flex:1
                }}>
                    <mye.Tv text="*First Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="First Name" value={fname} noSpace min={3} recv={(v)=>{
                        setFName(v.trim())
                    }} />
                </div>
                <div style={{
                    flex:1,
                    marginLeft:20
                }}>
                    <mye.Tv text="Middle Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="Middle Name" value={mname} noSpace min={0} recv={(v)=>{
                        setMName(v.trim())
                    }} />
                </div>
                <div style={{
                    flex:1,
                    marginLeft:20
                }}>
                    <mye.Tv text="*Last Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="Last Name" value={lname} noSpace min={3} recv={(v)=>{
                        setLName(v.trim())
                    }} />
                </div>
            </div>
            <Mgin top={5} />
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
            <Mgin top={60} />
            <mye.BTv size={18} text="Section 2 - General Profile" />
            <Mgin top={20} />
            <div ref={genRef} style={{
                width:'100%',
            }}>
                <mye.Tv text="*Gender" />
                <Mgin top={5}/>
                <select id="dropdown" name="dropdown" value={sex} onChange={(e)=>{
                    setSex(e.target.value)
                }}>
                    <option value="">Click to Choose</option>
                    {Object.entries(spin_genders).map(([key,value],i)=>{
                        return <option key={myKey+i+21.32} value={key}>{value}</option>
                    })}
                </select>
            </div>
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
            <Mgin top={60} />
            <mye.BTv size={18} text="Section 3 - Financial Information" />
            <Mgin top={20} />
            <div style={{
                width:'100%',
            }}>
                <mye.Tv text="*Bank" />
                <Mgin top={5}/>
                <select id="dropdown" name="dropdown" value={bnk} onChange={(e)=>{
                    setBnk(e.target.value)
                }}>
                    <option value="">Click to Choose</option>
                    {
                        mBanks.getAllBanks().map((ele,index)=>{
                            return <option key={myKey+0.05+index} value={ele.code}>{ele.name}</option>
                        })
                    }
                </select>
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Account Number" />
                <Mgin top={5} />
                <EditTextFilled hint="1234567890" value={anum} noSpace min={10} recv={(v)=>{
                    setANum(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Account Name" />
                <Mgin top={5} />
                <EditTextFilled hint="Account Name" value={aname} min={10} recv={(v)=>{
                    setAName(v.trim())
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
                if(!finOK()){
                    return
                }
                setLoad(true)
                makeRequest.post('setPartnerBasicInfo',{
                    user_id:getUserId(),
                    fname:fname,
                    lname:lname,
                    mname:mname,
                    eml:eml,
                    phn:phn,
                    verif:'0'
                },(task)=>{
                    if(task.isSuccessful()){
                        makeRequest.post('setPartnerGeneralInfo',{
                            user_id:getUserId(),
                            sex:sex,
                            state:state!.getId(),
                            lga:lga!.getId(),
                            addr:addr,
                        },(task)=>{
                            function finFinish(){
                                makeRequest.post('setPartnerFinancialInfo',{
                                    user_id:getUserId(),
                                    bnk:bnk,
                                    anum:anum,
                                    aname:aname,
                                },(task)=>{
                                    setLoad(false)
                                    if(task.isSuccessful()){
                                        mainprop.goto(0)
                                    }else{
                                        if(task.isLoggedOut()){
                                            navigate('/partnerLogin')
                                            return
                                        }
                                        toast(task.getErrorMsg(),0)
                                    }
                                })
                            }
                            if(task.isSuccessful()){
                                finFinish()
                            }else{
                                setLoad(false)
                                if(task.isLoggedOut()){
                                    navigate('/partnerLogin')
                                    return
                                }
                                toast(task.getErrorMsg(),0)
                            }
                        })
                    }else{
                        setLoad(false)
                        if(task.isLoggedOut()){
                            navigate('/partnerLogin')
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


