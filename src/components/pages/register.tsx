import { useEffect, useRef, useState } from "react";
import { InfoOutlined } from "@mui/icons-material";
import coin from '../../assets/coin.png'
import thumb from '../../assets/thumbs.png'
import { MsgAlert, PaystackExplanation, PoweredBySSS } from "../../helper/schoolsilo";
import useWindowDimensions from "../../helper/dimension";
import { myEles, setTitle, appName, Mgin, EditTextFilled, Btn, useQuery, ErrorCont, isEmlValid, isPhoneNigOk, getPayRef, MyCB, paystackPK } from "../../helper/general";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Toast from "../toast/toast";
import {  getUserId, makeRequest, resHandler } from "../../helper/requesthandler";
import { defVal, schoolBasicinfo } from "../classes/models";






export function RegisterAdmin(){
    const qry = useQuery();
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[eml,setEml] = useState('')
    const[pwd1,setPwd1] = useState('')
    const[pwd2,setPwd2] = useState('')
    const[nar,setNar] = useState(false)

    useEffect(()=>{
        setTitle(`Create Partner Account - ${appName}`)
    },[])

    
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
        width:dimen.width,
        height:dimen.height
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{

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
        <div className="vlc" style={{
            width:dimen.dsk?500:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <Mgin top={40} />
            <mye.HTv text="Create an Account" size={35} />
            <Mgin top={20} />
            <MsgAlert icon={InfoOutlined} mye={mye} msg="Fields marked * are compulsory" />
            <Mgin top={20} />
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
                <mye.Tv text="*Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd1} min={6} pwd recv={(v)=>{
                    setPwd1(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Confirm Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd2} min={6} pwd recv={(v)=>{
                    setPwd2(v.trim())
                }} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <MyCB checked={nar} mye={mye} ocl={()=>{
                    setNar(!nar)
                }} />
                <mye.BTv text="I am not a robot" size={14} />
            </div>
            <Mgin top={15} />
            <Btn txt="CREATE ACCOUNT" onClick={()=>{
                if(!isEmlValid(eml)){
                    toast('Invalid Email',0)
                    return
                }
                if(pwd1.length < 6){
                    toast('Invalid Password',0)
                    return
                }
                if(pwd1 != pwd2){
                    toast('password mismatch',0)
                    return
                }
                if(!nar){
                    toast('Please confirm you are not a robot',0)
                    return
                }
                setLoad(true)
                makeRequest.post('registerAdmin',{
                    email:eml,
                    password:pwd1,
                },(task)=>{
                    setLoad(false)
                    if(task.isSuccessful()){
                        navigate('/adminLogin')
                    }else{
                        toast(task.getErrorMsg()+' Maybe login instead',0)
                    }
                },true)
            }} />
            <Mgin top={20} />
            <div className="hlc">
                <mye.Tv text="Already have an account?" color={mye.mycol.primarycol} />
                <Mgin right={10} />
                <mye.Tv text="Sign In" color={mye.mycol.primarycol} onClick={()=>{
                    navigate(`/adminLogin?eml=${eml}`)
                }} />
            </div>
            <PoweredBySSS/>
        </div>
    </div>

}





export function RegisterPartner(){
    const qry = useQuery();
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[fname,setFName] = useState('')
    const[mname,setMName] = useState('')
    const[lname,setLName] = useState('')
    const[eml,setEml] = useState('')
    const[phn,setPhn] = useState('')
    const[pwd1,setPwd1] = useState('')
    const[pwd2,setPwd2] = useState('')
    const[nar,setNar] = useState(false)

    useEffect(()=>{
        setTitle(`Create Partner Account - ${appName}`)
    },[])

    
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
        width:dimen.width,
        height:dimen.height
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{

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
        <div className="vlc" style={{
            width:dimen.dsk?500:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <Mgin top={40} />
            <mye.HTv text="Create an Account" size={35} />
            <Mgin top={20} />
            <MsgAlert icon={InfoOutlined} mye={mye} msg="Fields marked * are compulsory" />
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
                        setFName(v.trim())
                    }} />
                </div>
                <div style={{
                    flex:1,
                    marginLeft:20
                }}>
                    <mye.Tv text="*Middle Name" />
                    <Mgin top={5} />
                    <EditTextFilled hint="Middle Name" value={mname} noSpace min={3} recv={(v)=>{
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
                <EditTextFilled hint="08012345678" value={phn} digi noSpace min={11} max={11} recv={(v)=>{
                    setPhn(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd1} min={6} pwd recv={(v)=>{
                    setPwd1(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Confirm Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd2} min={6} pwd recv={(v)=>{
                    setPwd2(v.trim())
                }} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <MyCB checked={nar} mye={mye} ocl={()=>{
                    setNar(!nar)
                }} />
                <mye.BTv text="I am not a robot" size={14} />
            </div>
            <Mgin top={15} />
            <Btn txt="CREATE ACCOUNT" onClick={()=>{
                if(fname.length < 3){
                    toast('Invalid First Name Input',0)
                    return;
                }
                if(mname.length < 3){
                    toast('Invalid Middle Name Input',0)
                    return;
                }
                if(lname.length < 3){
                    toast('Invalid Last Name Input',0)
                    return;
                }
                if(!isEmlValid(eml)){
                    toast('Invalid Email',0)
                    return
                }
                if(!isPhoneNigOk(phn)){
                    toast('Invalid Phone Number',0)
                    return
                }
                if(pwd1.length < 6){
                    toast('Invalid Password',0)
                    return
                }
                if(pwd1 != pwd2){
                    toast('password mismatch',0)
                    return
                }
                if(!nar){
                    toast('Please confirm you are not a robot',0)
                    return
                }
                setLoad(true)
                makeRequest.post('registerPartner',{
                    email:eml,
                    password:pwd1,
                    fname:fname,
                    lname:lname,
                    mname:mname,
                    phn: phn,
                    verif:'0',
                },(task)=>{
                    setLoad(false)
                    if(task.isSuccessful()){
                        navigate('/partnerLogin')
                    }else{
                        toast(task.getErrorMsg()+' Maybe login instead',0)
                    }
                },true)
            }} />
            <Mgin top={20} />
            <div className="hlc">
                <mye.Tv text="Already have an account?" color={mye.mycol.primarycol} />
                <Mgin right={10} />
                <mye.Tv text="Sign In" color={mye.mycol.primarycol} onClick={()=>{
                    navigate(`/partnerLogin?eml=${eml}`)
                }} />
            </div>
            <PoweredBySSS/>
        </div>
    </div>

}



export function RegisterSchool(){
    const qry = useQuery();
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[sname,setSName] = useState('')
    const[eml,setEml] = useState('')
    const[phn,setPhn] = useState('')
    const[pwd1,setPwd1] = useState('')
    const[pwd2,setPwd2] = useState('')
    const[pcode,setPcode] = useState(useParams().pcode ?? '')
    const[disablePCode, setDisablePCode] = useState(false)
    const[nar,setNar] = useState(false)

    useEffect(()=>{
        if(pcode){
            setDisablePCode(true)
        }
        setTitle(`Create Account - ${appName}`)
    },[])

    
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
        width:dimen.width,
        height:dimen.height
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{

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
        <div className="vlc" style={{
            width:dimen.dsk?500:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <Mgin top={40} />
            <mye.HTv text="Create an Account" size={35} />
            <Mgin top={20} />
            <MsgAlert icon={InfoOutlined} mye={mye} msg="Fields marked * are compulsory" />
            <Mgin top={20} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*School Name" />
                <Mgin top={5} />
                <EditTextFilled hint="School Name" value={sname} min={3} recv={(v)=>{
                    setSName(v)
                }} />
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
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd1} min={6} pwd recv={(v)=>{
                    setPwd1(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="*Confirm Password" />
                <Mgin top={5} />
                <EditTextFilled hint="******" value={pwd2} min={6} pwd recv={(v)=>{
                    setPwd2(v.trim())
                }} />
            </div>
            <Mgin top={15} />
            <div style={{
                width:'100%'
            }}>
                <mye.Tv text="Partner Code" />
                <Mgin top={5} />
                <EditTextFilled hint="Referral Partner Code" disabled={disablePCode} value={pcode} min={0} digi recv={(v)=>{
                    setPcode(v.trim())
                }} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <MyCB checked={nar} mye={mye} ocl={()=>{
                    setNar(!nar)
                }} />
                <mye.BTv text="I am not a robot" size={14} />
            </div>
            <Mgin top={15} />
            <Btn txt="CREATE ACCOUNT" onClick={()=>{
                if(sname.length < 3){
                    toast('Invalid School Name Input',0)
                    return;
                }
                if(!isEmlValid(eml)){
                    toast('Invalid Email',0)
                    return
                }
                if(!isPhoneNigOk(phn)){
                    toast('Invalid Phone Number',0)
                    return
                }
                if(pwd1.length < 6){
                    toast('Invalid Password',0)
                    return
                }
                if(pwd1 != pwd2){
                    toast('password mismatch',0)
                    return
                }
                if(!nar){
                    toast('Please confirm you are not a robot',0)
                    return
                }
                setLoad(true)
                makeRequest.post('registerSchool',{
                    email:eml,
                    password:pwd1,
                    sname:sname,
                    phn: phn,
                    pcode:pcode.length>0?pcode:'0',
                    verif:'0',
                    pay: '0'
                },(task)=>{
                    setLoad(false)
                    if(task.isSuccessful()){
                        navigate('/schoolLogin')
                    }else{
                        toast(task.getErrorMsg()+' Maybe login instead',0)
                    }
                },true)
            }} />
            <Mgin top={20} />
            <div className="hlc">
                <mye.Tv text="Already have an account?" color={mye.mycol.primarycol} />
                <Mgin right={10} />
                <mye.Tv text="Sign In" color={mye.mycol.primarycol} onClick={()=>{
                    navigate(`/schoolLogin?eml=${eml}`)
                }} />
            </div>
            <PoweredBySSS/>
        </div>
    </div>

}




export function PaySchoolRegFee(mainprop:{sbi?:schoolBasicinfo}){
    const navigate = useNavigate()
    const location = useLocation()
    const mye = new myEles(false);
    const dimen = useWindowDimensions();
    const[payStage, setPayStage] = useState(0)
    const[sbi,setSbi] = useState<schoolBasicinfo>()

    useEffect(()=>{
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        setTitle(`Make Payment - ${appName}`)
        begin()
        if(mainprop.sbi){
            setPayStage(mainprop.sbi!.isPaid()?1:0)
        }
        return () => {
            document.body.removeChild(script);
          };
    },[])

    function begin(){
        setError(false)
        setLoad(true)
        makeRequest.get(`getSchoolBasicInfo/${getUserId()}`,{},(task)=>{
            if(task.isSuccessful()){
                setLoad(false)
                const tem = new schoolBasicinfo(task.getData())
                setSbi(tem)
            }else{
                handleError(task)
            }
        })
    }

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/schoolLogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function payWithPaystack() {
        if((window as any).PaystackPop){
            var handler = (window as any).PaystackPop.setup({

                subaccount: "ACCT_putnq50bqlukxxj",

                label: 'SCHOOLSILO',
      
                key: paystackPK,
            
                email: sbi!.getEmail(),
            
                amount: 20000 * 100, //In kobo
            
                currency: 'NGN', 
            
                ref: getPayRef('0','20000',getUserId()), 
            
                callback: function(response:any) {
                  //var reference = response.reference;    
                  setPayStage(2)
                },
            
                onClose: function() {
                  toast('Transaction cancelled',0);
                },
                metadata: {
                    name: sbi!.getSchoolName(),
                    time: Date.now().toString(),
                    year: '', 
                    shares: '' 
                  },
              });
              handler.openIframe();
        }else{
            toast('An error occured. Please refresh the page',0)
        }
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

    return <div className="ctr" style={{
        width:'100%',
        height:mainprop.sbi?'100%':'100vh'
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            begin()
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
        {payStage==1?<div className="vlc" style={{
            width:dimen.dsk?300:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <img src={thumb} alt="Payments" height={100} />
            <Mgin top={30} />
            <mye.BTv text="Payment Successful" size={22} />
            <Mgin top={10}/>
            <mye.Tv text="Thank you. Your payment has been received." center />
            <Mgin top={30} />
            <Btn txt="PROCEED TO DASHBOARD" onClick={()=>{
                navigate('/')
            }} />
            </div>:payStage==2?<div className="vlc" style={{
            width:dimen.dsk?300:'100%',
            padding:dimen.dsk?0:20,
            boxSizing:'border-box'
        }}>
            <img src={thumb} alt="Payments" height={100} />
            <Mgin top={30} />
            <mye.BTv text="Processing Payment" size={22} />
            <Mgin top={10}/>
            <mye.Tv text="Thank you. Your payment is being processed. We will let you know if we need more info." center />
            <Mgin top={30} />
            <Btn txt="PROCEED TO DASHBOARD" onClick={()=>{
                navigate('/')
            }} />
            </div>:
        <div className="vlc" style={{
            width:dimen.dsk?500:dimen.width,
            padding:dimen.dsk?0:10,
            boxSizing:'border-box'
        }}>
            <img src={coin} alt="Payments" height={100} />
            <Mgin top={30}/>
            <mye.HTv text="You are required to pay N20,000"  />
            <Mgin top={10}/>
            <mye.Tv text="This is setup fee required to create a portal for your school" center />
            <Mgin top={35} />
            <PaystackExplanation />
            <Btn txt="PAY" onClick={()=>{
                payWithPaystack()
            }} />
            <Mgin top={20} />
            <mye.Tv text="BACK TO HOME" color={mye.mycol.primarycol} onClick={()=>{
                setLoad(true)
                makeRequest.get('logout',{},(task)=>{
                    navigate('/schoolLogin')
                })
            }} />
        </div>}
    </div>

}

