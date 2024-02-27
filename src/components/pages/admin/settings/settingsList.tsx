import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown, UploadOutlined, AccountBalance, PeopleOutline } from "@mui/icons-material"
import { useState, useEffect, useRef } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, EditTextFilled, MyCB, ErrorCont, isEmlValid, masterID, isDigit } from "../../../../helper/general"
import { mLoc } from "monagree-locs/dist/classes"
import { mCountry, mLga, mState } from "monagree-locs"
import { useLocation, useNavigate } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { makeRequest, resHandler } from "../../../../helper/requesthandler"
import { adminUserEle, schoolsiloInfoEle, permHelp } from "../../../classes/models"
import { mBanks } from "monagree-banks"
import {  PoweredBySSS } from "../../../../helper/schoolsilo"



export function SettingsList(){
    const location = useLocation()
    const navigate = useNavigate()
    const [myKey,setMyKey] = useState(Date.now())
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[cuser, setCUser] = useState<adminUserEle>()
    const[showStage, setShowStage] = useState(0)
    const[optToShow,setOptToShow] = useState(-1)
    //Cooperative Info
    const[name,setName] = useState('')
    const[regNo,setRegNo] = useState('')
    const[logo,setLogo] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const[addr,setAddr] = useState('')
    //Financial Info
    const[aname,setAName] = useState('')
    const[anum,setANum] = useState('')
    const[bank,setBank] = useState('')
    //Personal Info
    const[fullName,setFullName] = useState('')
    const[email,setEmail] = useState('')
    const[phn,setPhn] = useState('')
    const[paddr,setPAddr] = useState('')
    //Edit Staff
    const[oname,setOname] = useState('')
    const[lname,setLname] = useState('')
    const[eml,setEml] = useState('')
    const[sid,setSid] = useState('')
    const[role,setRole] = useState('')
    const[users, setUsers] = useState<adminUserEle[]>([])

    const[permies,setPermies] = useState([
        new permHelp('Create Member','pd1'),
        new permHelp('Approve / Delete Member','pd2'),
        new permHelp('View Payments','pp1'),
        new permHelp('Verify Payments','pp2'),
        new permHelp('View Messages','pm1'),
        new permHelp('Edit Messages','pm2'),
    ])
    

    const[country, setCountry] = useState<mLoc>()
    const[state, setState] = useState<mLoc>()
    const[city, setCity] = useState<mLoc>()
    const[state_custom, setState_custom] = useState('')
    const[city_custom, setCity_custom] = useState('')

    useEffect(()=>{
        setTitle(`Settings - ${appName}`)
        getUsers()
    },[])

    function getSchoolsiloInfo(){
        setShowStage(1)
        setLoad(true)
        setError(false)
        makeRequest.get(`getSchoolsiloInfo/${masterID}`,{},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const schoolsilo = new schoolsiloInfoEle(task.getData())
                setName(schoolsilo.getName())
                setRegNo(schoolsilo.getRegNo())
                setAddr(schoolsilo.getAddr())
                setCountry(mCountry.getCountryByCode(schoolsilo.getNationality()))
                if(schoolsilo.isLocsCustom()){
                    setState_custom(schoolsilo.getState())
                    setCity_custom(schoolsilo.getLga())
                }else{
                    setState(mState.getStateByCode(schoolsilo.getNationality(),schoolsilo.getState()))
                    setCity(mLga.getLgaByCode(schoolsilo.getNationality(),schoolsilo.getState(),schoolsilo.getLga()))
                }
                setAName(schoolsilo.getAccountName())
                setANum(schoolsilo.getAccountNumber())
                setBank(schoolsilo.getBankCode())

                setFullName(schoolsilo.getPersonalName())
                setEmail(schoolsilo.getPersonalEmail())
                setPhn(schoolsilo.getPersonalPhone())
                setPAddr(schoolsilo.getPersonalAddr())
                setMyKey(Date.now())
            }else{
                if(task.isLoggedOut()){
                    navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
                }else{
                    toast(task.getErrorMsg(),0)
                }
            }
        });
    }

    function getUsers(){
        setShowStage(0)
        setLoad(true)
        setError(false)
        makeRequest.get('getAdmins',{},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                let tem:adminUserEle[] = []
                for(const key in task.getData()){
                    tem.push(new adminUserEle(task.getData()[key]))
                }
                setUsers(tem)
            }else{
                handleError(task)
            }
        })
    }

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
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

    return <div key={myKey} className="vlc" style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getUsers()
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
            width:350,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Identity Management" round onClick={()=>{
                    getUsers()
                }} transparent={showStage!=0} />
            </div>
            <Mgin right={20} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Account" round onClick={()=>{
                    getSchoolsiloInfo()
                }} transparent={showStage!=1}/>
            </div>
        </div>
        <Mgin top={15} />
        {showStage==0?<div className="vlc" id='lshdw' style={{
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
                <mye.HTv text="Identity Management" size={16} color={mye.mycol.secondarycol} />
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
                        <MyCell text="S/N"  isBold/>
                        <MyCell text="Name"  isBold/>
                        <MyCell text="Email Address"  isBold/>
                        <MyCell text="Role"  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        users.map((ele,index)=>{
                            return <div className="hlc" key={myKey+index+0.01}>
                                <MyCell text={(index+1).toString()} />
                                <MyCell text={ele.getNames()} />
                                <MyCell text={ele.getEmail()} />
                                <MyCell text={ele.getFormattedRole()} />
                                <Opts index={index} user={ele} />
                            </div>
                        })
                    }
                </div>
            </div>
            <Mgin top={20} />
            <div style={{
                alignSelf:'flex-end'
            }}>
                <IconBtn icon={Add} mye={mye} text="Add Staff" ocl={()=>{
                    prepPerms()
                    setCUser(undefined)
                    setShowStage(2)
                }} />
            </div>
        </div>:showStage==1?<div id='lshdw' style={{
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
                <mye.HTv text="Cooperative Information" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="flexi">
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Cooperative Name" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Cooperative Name" min={6} value={name} recv={(v)=>{
                        setName(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Registration No." />
                    <Mgin top={5}/>
                    <EditTextFilled hint="00/0000" min={6} value={regNo} recv={(v)=>{
                        setRegNo(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Cooperative Logo" />
                    <Mgin top={5}/>
                    <div style={{
                        width:'100%',
                        height:45,
                        borderRadius:10,
                        backgroundColor:mye.mycol.btnstrip
                    }}>
                        <LrText 
                        left={<mye.Tv text={logo?logo.name:'Please upload Logo'} />}
                        right={<div>
                                <input
                                    type="file"
                                    onChange={(e)=>{
                                        const file = e.target.files?.[0];
                                        if(file){
                                            setLogo(file)
                                        }
                                    }}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                <IconBtn icon={UploadOutlined} mye={mye} text="Upload" ocl={()=>{
                                    fileInputRef.current?.click()
                                }} />
                            </div>}
                        />
                    </div>
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Cooperative Address" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Cooperative Address" min={6} value={addr} recv={(v)=>{
                        setAddr(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5,
                }}>
                    <mye.Tv text="Country" />
                    <Mgin top={5}/>
                    <select id="dropdown" name="dropdown" value={country?.getId() || ''} onChange={(e)=>{
                        const ele = mCountry.getCountryByCode(e.target.value)
                        setCountry(ele)
                        setState(undefined)
                        setCity(undefined)
                    }}>
                        <option value="">Choose Country</option>
                        {
                            mCountry.getAllCountries().map((ele, index)=>{
                                return <option key={myKey+index+10000} value={ele.getId()}>{ele.getName()}</option>
                            })
                        }
                    </select>
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5,
                    display:country?.getId()!='NG'?'none':undefined
                }}>
                    <mye.Tv text="State" />
                    <Mgin top={5}/>
                    <select id="dropdown" name="dropdown" value={state?.getId()||''} onChange={(e)=>{
                        if(country?.getId() == 'NG'){
                            const ele = mState.getStateByCode('NG',e.target.value)
                            setState(ele)
                            setCity(undefined)
                        }
                        
                    }}>
                        <option value="">Choose One</option>
                        {
                            country?country?.getId() == 'NG'?mState.getStatesByCountry('NG',true).map((ele, index)=>{
                                return <option key={myKey+index+1000} value={ele.getId()}>{ele.getName()}</option>
                            }):undefined:<option value="option1">Choose Country First</option>
                        }
                    </select>
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5,
                    display:country?.getId()!='NG'?'none':undefined
                }}>
                    <mye.Tv text="City" />
                    <Mgin top={5}/>
                    <select id="dropdown" name="dropdown" value={city?.getId()||''} onChange={(e)=>{
                        if(country?.getId() == 'NG' && state){
                            const ele = mLga.getLgaByCode('NG',state!.getId(),e.target.value)
                            setCity(ele)
                        }
                    }}>
                        <option value="">Choose One</option>
                        {
                            (country&& state)?country?.getId() == 'NG'?mLga.getLgasByState('NG',state!.getId()).map((ele, index)=>{
                                return <option key={myKey+index+100} value={ele.getId()}>{ele.getName()}</option>
                            }):undefined:<option value="option1">Choose Country & State First</option>
                        }
                    </select>
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5,
                    display:country?.getId()!='NG'?undefined:'none'
                }}>
                    <mye.Tv text="Type State" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Your State" min={3} value={state_custom} recv={(v)=>{
                        setState_custom(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5,
                    display:country?.getId()!='NG'?undefined:'none'
                }}>
                    <mye.Tv text="Type City" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Your City" min={3} value={city_custom} recv={(v)=>{
                        setCity_custom(v)
                    }} />
                </div>
            </div>
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <AccountBalance style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text="Cooperative Account Details" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="flexi">
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Account Name" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Account Name" min={6} value={aname} recv={(v)=>{
                        setAName(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Account Number" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="1234567890" min={6} value={anum} recv={(v)=>{
                        setANum(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Bank" />
                    <Mgin top={5}/>
                    <select id="dropdown" name="dropdown" value={bank} onChange={(e)=>{
                        setBank(e.target.value)
                    }}>
                        <option value="">Click to Choose</option>
                        {
                            mBanks.getAllBanks(true).map((ele,index)=>{
                                return <option key={myKey+0.05+index} value={ele.code}>{ele.name}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <PersonOutline style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text="Personal Information" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="flexi">
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Full Name" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Full Name" min={6} value={fullName} recv={(v)=>{
                        setFullName(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Email" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Example@gmail.com" min={6} value={email} recv={(v)=>{
                        setEmail(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Phone Number" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="0817265252" min={5} max={20} value={phn} recv={(v)=>{
                        setPhn(v)
                    }} />
                </div>
                <div style={{
                    width:gimmeWidth(),
                    margin:dimen.dsk?20:5
                }}>
                    <mye.Tv text="Address" />
                    <Mgin top={5}/>
                    <EditTextFilled hint="Some place in Nigeria" min={6} value={paddr} recv={(v)=>{
                        setPAddr(v)
                    }} />
                </div>
            </div>
            <Mgin top={20} />
            <Btn txt="SAVE" width={120} onClick={()=>{
                if(name.length<3){
                    toast('Please add cooperative name',0)
                    return;
                }
                if(regNo.length<3){
                    toast('Please add reg no',0)
                    return;
                }
                if(addr.length<3){
                    toast('Please add cooperative address',0)
                    return;
                }
                if(!country){
                    toast('Invalid Country Input',0)
                    return
                }
                if(!state &&  state_custom.length < 3){
                    toast('Invalid State location Input',0)
                    return
                }
                if(!city && city_custom.length < 3){
                    toast('Invalid City Input',0)
                    return
                }
                if(aname.length<3){
                    toast('Please add account name',0)
                    return;
                }
                if(anum.length<3){
                    toast('Please add account number',0)
                    return;
                }
                if(bank.length==0){
                    toast('Please choose bank',0)
                    return;
                }
                if(fullName.length<3){
                    toast('Please add personal name',0)
                    return;
                }
                if(!isEmlValid(email)){
                    toast('Invalid personal email',0)
                    return;
                }
                if(phn.length<3){
                    toast('Please add personal phone number',0)
                    return;
                }
                if(paddr.length<3){
                    toast('Please add personal address',0)
                    return;
                }
                setLoad(true)
                makeRequest.post('setSchoolsiloInfo',{
                    user_id:masterID,
                    cname:name,
                    regno:regNo,
                    addr: addr,
                    nationality: country.getId(),
                    state: state?state.getId():state_custom,
                    lga: city?city.getId():city_custom,
                    aname: aname,
                    anum: anum,
                    bnk: bank,
                    pname: fullName,
                    peml: email,
                    pphn: phn,
                    paddr: paddr
                },(task)=>{
                    setLoad(false)
                    if(task.isSuccessful()){
                        toast('Info updated',1)
                        getSchoolsiloInfo()
                    }else{
                        if(task.isLoggedOut()){
                            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
                        }else{
                            toast(task.getErrorMsg(),0)
                        }
                    }
                })
            }} />
        </div>:<div id='lshdw' style={{
            width:'100%',
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?20:10,
            boxSizing:'border-box'
        }}>
                <div id="clk" className="hlc" onClick={()=>{
                    setShowStage(0)
                }}>
                    <ArrowBack className="icon" />
                    <Mgin right={10} />
                    <mye.HTv text="Go Back" size={14} />
                </div>
                <Mgin top={20} />
                <LrText
                    left={<div className="hlc">
                        <PersonOutline style={{
                            color:mye.mycol.secondarycol,
                            fontSize:20
                        }} />
                        <Mgin right={10}/>
                        <mye.HTv text="Identity Management" size={16} color={mye.mycol.secondarycol} />
                    </div>}
                    right={<Btn txt="Assign" outlined width={120} onClick={()=>{
                        if(lname.length<3){
                            toast('Please enter last name',0)
                            return;
                        }
                        if(oname.length<3){
                            toast('Please enter other names',0)
                            return;
                        }
                        if(!isEmlValid(eml)){
                            toast('Please enter valid email',0)
                            return;
                        }
                        if(!isDigit(sid) || sid.length==0){
                            toast('Please enter valid id',0)
                            return;
                        }
                        if(role==''){
                            toast('Please choose role',0)
                            return;
                        }
                        setLoad(true)
                        makeRequest.post('setAdmin',{
                            user_id:sid,
                            lname:lname,
                            oname:oname,
                            eml:eml,
                            role:role,
                            pd1:permies[0].val,
                            pd2:permies[1].val,
                            pp1:permies[2].val,
                            pp2:permies[3].val,
                            pm1:permies[4].val,
                            pm2:permies[5].val,
                        },(task)=>{
                            setLoad(false)
                            if(task.isSuccessful()){
                                getUsers()
                            }else{
                                handleError(task)
                            }
                        })
                    }} />}
                />
                <Mgin top={20} />
                <div className="flexi">
                    <div style={{
                        width:gimmeWidth(true),
                        margin:dimen.dsk?20:5
                    }}>
                        <mye.Tv text="Name" />
                        <Mgin top={5}/>
                        <div style={{
                            width:'100%',
                            display:'flex'
                        }}>
                            <div style={{
                                flex:1
                            }}>
                                <EditTextFilled hint="Last Name" min={3} value={lname} recv={(v)=>{
                                    setLname(v)
                                }} />
                            </div>
                            <Mgin right={10} />
                            <div style={{
                                flex:1
                            }}>
                                <EditTextFilled hint="Other Names" min={3} value={oname} recv={(v)=>{
                                    setOname(v)
                                }} />
                            </div>
                            
                        </div>
                    </div>
                    <div style={{
                        width:gimmeWidth(),
                        margin:dimen.dsk?20:5
                    }}>
                        <mye.Tv text="Email Address" />
                        <Mgin top={5}/>
                        <EditTextFilled hint="example@gmail.com" min={6} eml value={eml} recv={(v)=>{
                            setEml(v)
                        }} />
                    </div>
                    <div style={{
                        width:gimmeWidth(),
                        margin:dimen.dsk?20:5
                    }}>
                        <mye.Tv text="User ID" />
                        <Mgin top={5}/>
                        <EditTextFilled hint="00000000" min={1} digi value={sid} recv={(v)=>{
                            setSid(v)
                        }} />
                    </div>
                    <div style={{
                        width:gimmeWidth(),
                        margin:dimen.dsk?20:5
                    }}>
                        <mye.Tv text="Role" />
                        <Mgin top={2}/>
                        <mye.Tv text="NOTE: All admins can see the dashboard" size={12}/>
                        <Mgin top={2}/>
                        <select id="dropdown" name="dropdown" value={role} onChange={(e)=>{
                            setRole(e.target.value)
                        }}>
                            <option value={''}>Choose One</option>
                            <option value={'0'}>Super Admin</option>
                            <option value={'1'}>Others</option>
                        </select>
                    </div>
                </div>
                <div className="hlc">
                    <PeopleOutline style={{
                        color:mye.mycol.secondarycol,
                        fontSize:20
                    }} />
                    <Mgin right={10}/>
                    <mye.HTv text="Permissions" size={16} color={mye.mycol.secondarycol} />
                </div>
                <Mgin top={20} />
                <div className="flexi">
                    <mye.BTv size={16} text="Directory" />
                    <Mgin right={10} />
                    <Permy index={0} />
                    <Mgin right={10} />
                    <Permy index={1} />
                </div>
                <Mgin top={20} />
                <div className="flexi">
                    <mye.BTv size={16} text="Payments" />
                    <Mgin right={10} />
                    <Permy index={2} />
                    <Mgin right={10} />
                    <Permy index={3} />
                </div>
                <Mgin top={20} />
                <div className="flexi">
                    <mye.BTv size={16} text="Mesages" />
                    <Mgin right={10} />
                    <Permy index={4} />
                    <Mgin right={10} />
                    <Permy index={5} />
                </div>
                
        </div>}
        <PoweredBySSS />
    </div>

    function grantPerm(index:number) {
        const np = [...permies]
        np.forEach((p,i)=>{
            if(p.id==permies[index].id){
                p.val = p.val=='1'?'0':'1'
            }
        })
        setPermies(np)
    }

    function Permy(prop:{index:number}) {
        return <label  style={{
            display:'flex',
            fontSize:12,
        }}>
            <MyCB checked={permies[prop.index].val=='1'}  mye={mye} ocl={()=>{
                grantPerm(prop.index)
            }} noPadding />
            <Mgin right={10}/>
            {permies[prop.index].name}
        </label>
    }

    function prepPerms(usr?:adminUserEle){
        const np = [...permies]
        np.forEach((p,i)=>{
            p.val = usr?.getPerm(p.id) || '0'
        })
        setPermies(np)
        if(usr){
            setLname(usr.getLastName())
            setOname(usr.getOtherNames())
            setEml(usr.getEmail())
            setSid(usr.getUserId())
            setRole(usr.getRole())
        }else{
            setLname('')
            setOname('')
            setEml('')
            setSid('')
            setRole('')
        }
    }

    function Opts(prop:{index:number,user:adminUserEle}) {
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
                <MyCell text="Edit" ocl={()=>{
                     if(prop.user.getUserId()==masterID){
                        toast('Cannot edit master Admin',0)
                        return;
                    }
                    prepPerms(prop.user)
                    setCUser(prop.user)
                    setShowStage(2)
                }} alignStart special/>
                <Line />
                <MyCell text="Delete" ocl={()=>{
                    if(prop.user.getUserId()==masterID){
                        toast('Cannot delete master Admin',0)
                        return;
                    }
                    setLoad(true)
                    makeRequest.get(`removeAdmin/${prop.user.getUserId()}`,{},(task)=>{
                        setLoad(false)
                        if(task.isSuccessful()){
                            toast('Access deleted',1)
                            getUsers()
                        }else{
                            toast(task.getErrorMsg(),0)
                        }
                    })
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

    function gimmeWidth(long?:boolean){
        return dimen.dsk?long?'450px':'300px':'100%'
    }

}

