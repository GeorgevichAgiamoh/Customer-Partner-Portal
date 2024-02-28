import { useEffect, useState } from "react"
import { Btn, EditTextFilled, ErrorCont, Line, Mgin, appName, goUrl, myEles, setTitle } from "../../../../helper/general"
import useWindowDimensions from "../../../../helper/dimension"
import { ArrowBack, FileOpenOutlined, PersonOutline } from "@mui/icons-material"
import { adminUserEle, defVal, fileEle, getCreatedTime, partnerBasicinfo, partnerFinancialinfo, partnerGeneralinfo, schoolBasicinfo, schoolGeneralinfo, schoolPropInfo } from "../../../classes/models"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { endpoint, makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { PoweredBySSS } from "../../../../helper/schoolsilo"


export function AdminDirViewSchool(mainprop:{school:schoolBasicinfo,backy:(action:number)=>void,isMemAccess?:boolean, editClbk?:()=>void,genU?:schoolGeneralinfo,propU?:schoolPropInfo, me?:adminUserEle}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const [mykey,setMyKey] = useState(Date.now())
    const[memFiles,setMemfiles] = useState<fileEle[]>([])
    const[newPwd,setNewPwd] = useState('')
    const[newPwdKey,setNewPwdKey] = useState(Date.now())

    useEffect(()=>{
        setTitle(`School Details - ${appName}`)
        if(mainprop.genU){
            mainprop.school.setGeneralData(mainprop.genU)
        }
        if(mainprop.propU){
            mainprop.school.setFinData(mainprop.propU)
        }
        getMemFiles()
    },[])

    function getMemFiles(){
        setError(false)
        setLoad(true)
        makeRequest.get(`getFiles/${mainprop.school.getSchoolID()}`,{},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:fileEle[] = []
                for(const key in task.getData()){
                    tem.push(new fileEle(task.getData()[key]))
                }
                setMemfiles(tem)
            }else{
                handleError(task)
            }
        })
    }

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminLogin?rdr=${location.pathname.substring(1)}`)
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

    function updateData(key:string, value:string, mailUser?:boolean){
        setLoad(true)
        const ndata = {...mainprop.school.data}
        ndata[key] = value
        makeRequest.post('setSchoolBasicInfo',ndata,(task)=>{
            if(task.isSuccessful()){
                mainprop.school.data[key] = value
                if(mailUser){
                    if(mainprop.school.getEmail()!=defVal){
                        toast('Mailing user..',2)
                        makeRequest.post('sendMail',{
                            name: mainprop.school.getSchoolName(),
                            email: mainprop.school.getEmail(),
                            subject: "SCHOOLSILO Account Verified",
                            body: `Your SCHOOLSILO account has been verified. You can now use the portal at:`,
                            link: 'https://portal.schoolsilo.cloud/schoolLogin'
                        },(task)=>{
                            setLoad(false)
                            if(task.isSuccessful()){
                                toast('Approval successful and user has been mailed',1)
                            }else{
                                toast('APPROVAL SUCCESSFUL. But '+task.getErrorMsg(),2);
                            }
                        })
                    }else{
                        setLoad(false)
                        toast('Successful. But we could not mail user as no email was provided',2,10000)
                    }
                }else{
                    setLoad(false)
                    toast('Update successful',1)
                    setMyKey(Date.now()) // Rebuild entire page
                }
            }else{
                handleError(task)
            }
        })
    }

    return <div key={mykey} style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getMemFiles()
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
        <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy(-1)
        }} style={{
            display: mainprop.isMemAccess?'none':undefined
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div className="hlc">
            <PersonOutline style={{
                fontSize:20,
                color:mye.mycol.secondarycol
            }} />
            <Mgin right={10} />
            <mye.HTv size={14} text={`${mainprop.isMemAccess?'Your':'Personal'} Information`} color={mye.mycol.secondarycol} />
        </div>
        <Mgin top={20} />
        <div id="lshdw" className="vlc" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            boxSizing:'border-box',
            padding:dimen.dsk?20:10
        }}>
            {mainprop.isMemAccess?<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.editClbk!()
                }} width={120} outlined />
            </div>:mainprop.school.isDeleted()?<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="RESTORE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','0',true)
                }} width={120} />
            </div>:!mainprop.school.isVerified()?<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="APPROVE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','1',true)
                }} width={120} />
                {/* <Mgin right={20}/>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.backy(1)
                }} width={120} outlined/> */}
                <Mgin right={20}/>
                <Btn txt="DELETE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','2')
                }} width={120} outlined/>
            </div>:<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="DEACTIVATE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','0')
                }} width={120} bkg={mye.mycol.red} />
                {/* <Mgin right={20}/>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.backy(1)
                }} width={120} outlined/> */}
                <Mgin right={20}/>
                <Btn txt="DELETE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','2')
                }} width={120} outlined/>
            </div>}
            <Mgin top={10} />
            :<img src={`${endpoint}/getFile/dp/${mainprop.school.getSchoolID()}`} alt="SCHOOL LOGO" style={{
                objectFit:'cover',
                width:120,
                height:120,
                backgroundColor:mye.mycol.btnstrip,
                borderRadius:100,
                alignSelf:'flex-start'
            }}  />
            <Mgin top={10} />
            <div style={{
                width:'100%',
                display:dimen.dsk?'flex':undefined,
                alignItems:'center'
            }}>
                <div className="flexi" style={{
                    flex:dimen.dsk?1:undefined,
                }}>
                    <InfoLay sub="School Name" main={mainprop.school.getSchoolName()} />
                    <InfoLay sub="School ID" main={mainprop.school.getSchoolID()} />
                    <InfoLay sub="Phone Number" main={mainprop.school.getPhone()} />
                    <InfoLay sub="Residential Address" main={mainprop.school.generalData.getAddr()} />
                    <InfoLay sub="Country" main={mainprop.school.generalData.getFormattedCountry() || ''} />
                    <InfoLay sub="State" main={mainprop.school.generalData.getFormattedState()} />
                    <InfoLay sub="City" main={mainprop.school.generalData.getFormattedLGA()} />
                    <InfoLay sub="Email" main={mainprop.school.getEmail()} />
                </div>
                <Mgin right={dimen.dsk?20:0} top={dimen.dsk?0:20} />
                <Line vertical={dimen.dsk} col={mye.mycol.btnstrip} height={200}/>
                <Mgin right={dimen.dsk?20:0} top={dimen.dsk?0:20} />
                <div className="flexi" style={{
                    flex:dimen.dsk?1:undefined,
                }}>
                    <InfoLay sub="Proprietor Name" main={mainprop.school.propData!.getFirstName()+' '+mainprop.school.propData!.getMiddleName()+' '+mainprop.school.propData!.getLastName()} />
                    <InfoLay sub="Proprietor Gender" main={mainprop.school.propData!.getGender()} />
                    <InfoLay sub="Proprietor Address" main={mainprop.school.propData!.getAddress()} />
                    <InfoLay sub="Proprietor Phone" main={mainprop.school.propData!.getPhone()} />
                    <InfoLay sub="Proprietor Email" main={mainprop.school.propData!.getEmail()} />
                    <InfoLay sub="Date of Initial Registration" main={getCreatedTime(mainprop.school.data)} />
                    <div style={{
                        width:'100%',
                        marginTop:20,
                        marginRight:10
                    }}>
                        <mye.Tv text={'Uploaded Documents'} color={mye.mycol.imghint} size={12} />
                        <Mgin top={5} />
                        {
                            memFiles.map((mf, index)=>{
                                return <div key={mykey+index+0.34} style={{
                                    marginBottom:5
                                }} className="hlc">
                                    <FileOpenOutlined style={{
                                        fontSize:20,
                                        color:mye.mycol.secondarycol
                                    }} />
                                    <Mgin right={5} />
                                    <mye.Tv text={mf.getFolder()+'/'+mf.getName()} size={14} onClick={()=>{
                                        goUrl(`${endpoint}/getFile/${mf.getFolder()}/${mf.getName()}`)
                                    }} />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
        <PoweredBySSS floaatIt />
    </div>

    function InfoLay(prop:{sub:string, main:string}) {
        return <div style={{
            minWidth:dimen.dsk?120:100,
            marginTop:dimen.dsk?20:20,
            marginRight:10
        }}>
            <mye.Tv text={prop.sub} color={mye.mycol.imghint} size={12} />
            <Mgin top={5} />
            <mye.Tv text={prop.main} size={16} />
        </div>
    }

}


export function AdminDirViewPartner(mainprop:{partner:partnerBasicinfo,backy:(action:number)=>void,isMemAccess?:boolean, editClbk?:()=>void,genU?:partnerGeneralinfo,finU?:partnerFinancialinfo, me?:adminUserEle}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const [mykey,setMyKey] = useState(Date.now())
    const[memFiles,setMemfiles] = useState<fileEle[]>([])
    const[newPwd,setNewPwd] = useState('')
    const[newPwdKey,setNewPwdKey] = useState(Date.now())

    useEffect(()=>{
        setTitle(`Member Details - ${appName}`)
        if(mainprop.genU){
            mainprop.partner.setGeneralData(mainprop.genU)
        }
        if(mainprop.finU){
            mainprop.partner.setFinData(mainprop.finU)
        }
        getMemFiles()
    },[])

    function getMemFiles(){
        setError(false)
        setLoad(true)
        makeRequest.get(`getFiles/${mainprop.partner.getPartnerID()}`,{},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:fileEle[] = []
                for(const key in task.getData()){
                    tem.push(new fileEle(task.getData()[key]))
                }
                setMemfiles(tem)
            }else{
                handleError(task)
            }
        })
    }

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminLogin?rdr=${location.pathname.substring(1)}`)
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

    function updateData(key:string, value:string, mailUser?:boolean){
        setLoad(true)
        const ndata = {...mainprop.partner.data}
        ndata[key] = value
        makeRequest.post('setPartnerBasicInfo',ndata,(task)=>{
            if(task.isSuccessful()){
                mainprop.partner.data[key] = value
                if(mailUser){
                    if(mainprop.partner.getEmail()!=defVal){
                        toast('Mailing user..',2)
                        makeRequest.post('sendMail',{
                            name: mainprop.partner.getFirstName(),
                            email: mainprop.partner.getEmail(),
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
                        })
                    }else{
                        setLoad(false)
                        toast('Successful. But we could not mail user as no email was provided',2,10000)
                    }
                }else{
                    setLoad(false)
                    toast('Update successful',1)
                    setMyKey(Date.now()) // Rebuild entire page
                }
            }else{
                handleError(task)
            }
        })
    }

    return <div key={mykey} style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getMemFiles()
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
        <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy(-1)
        }} style={{
            display: mainprop.isMemAccess?'none':undefined
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div className="hlc">
            <PersonOutline style={{
                fontSize:20,
                color:mye.mycol.secondarycol
            }} />
            <Mgin right={10} />
            <mye.HTv size={14} text={`${mainprop.isMemAccess?'Your':'Personal'} Information`} color={mye.mycol.secondarycol} />
        </div>
        <Mgin top={20} />
        <div id="lshdw" className="vlc" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            boxSizing:'border-box',
            padding:dimen.dsk?20:10
        }}>
            {mainprop.isMemAccess?<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.editClbk!()
                }} width={120} outlined />
            </div>:mainprop.partner.isDeleted()?<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="RESTORE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','0',true)
                }} width={120} />
            </div>:!mainprop.partner.isVerified()?<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="APPROVE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','1',true)
                }} width={120} />
                {/* <Mgin right={20}/>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.backy(1)
                }} width={120} outlined/> */}
                <Mgin right={20}/>
                <Btn txt="DELETE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','2')
                }} width={120} outlined/>
            </div>:<div className="hlc" style={{
                alignSelf:'flex-end'
            }}>
                <Btn txt="DEACTIVATE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','0')
                }} width={120} bkg={mye.mycol.red} />
                {/* <Mgin right={20}/>
                <Btn txt="EDIT" onClick={()=>{
                    mainprop.backy(1)
                }} width={120} outlined/> */}
                <Mgin right={20}/>
                <Btn txt="DELETE" onClick={()=>{
                    if(mainprop.me!.getPerm('pd2')!='1'){
                        toast('You dont have permission to do this',0)
                        return
                    }
                    updateData('verif','2')
                }} width={120} outlined/>
            </div>}
            <Mgin top={20} />
            <div style={{
                width:'100%',
                display:dimen.dsk?'flex':undefined,
                alignItems:'center'
            }}>
                <div className="flexi" style={{
                    flex:dimen.dsk?1:undefined,
                }}>
                    <InfoLay sub="First Name" main={mainprop.partner.getFirstName()} />
                    <InfoLay sub="Middle Name" main={mainprop.partner.getMiddleName()} />
                    <InfoLay sub="Last Name" main={mainprop.partner.getLastName()} />
                    <InfoLay sub="Code" main={mainprop.partner.getPartnerID()} />
                    <InfoLay sub="Phone Number" main={mainprop.partner.getPhone()} />
                    <InfoLay sub="Gender" main={mainprop.partner.generalData.getGender()} />
                    <InfoLay sub="Residential Address" main={mainprop.partner.generalData.getAddr()} />
                    <InfoLay sub="Country" main={mainprop.partner.generalData.getFormattedCountry() || ''} />
                    <InfoLay sub="State" main={mainprop.partner.generalData.getFormattedState()} />
                    <InfoLay sub="City" main={mainprop.partner.generalData.getFormattedLGA()} />
                    <InfoLay sub="Email" main={mainprop.partner.getEmail()} />
                </div>
                <Mgin right={dimen.dsk?20:0} top={dimen.dsk?0:20} />
                <Line vertical={dimen.dsk} col={mye.mycol.btnstrip} height={200}/>
                <Mgin right={dimen.dsk?20:0} top={dimen.dsk?0:20} />
                <div className="flexi" style={{
                    flex:dimen.dsk?1:undefined,
                }}>
                    <InfoLay sub="Account Name" main={mainprop.partner.finData!.getAccountName()} />
                    <InfoLay sub="Account Number" main={mainprop.partner.finData!.getAccountNumber()} />
                    <InfoLay sub="Bank" main={mainprop.partner.finData!.getFormattedbank()} />
                    <InfoLay sub="Date of Initial Registration" main={getCreatedTime(mainprop.partner.data)} />
                    <div style={{
                        width:'100%',
                        marginTop:20,
                        marginRight:10
                    }}>
                        <mye.Tv text={'Uploaded Documents'} color={mye.mycol.imghint} size={12} />
                        <Mgin top={5} />
                        {
                            memFiles.map((mf, index)=>{
                                return <div key={mykey+index+0.34} style={{
                                    marginBottom:5
                                }} className="hlc">
                                    <FileOpenOutlined style={{
                                        fontSize:20,
                                        color:mye.mycol.secondarycol
                                    }} />
                                    <Mgin right={5} />
                                    <mye.Tv text={mf.getFolder()+'/'+mf.getName()} size={14} onClick={()=>{
                                        goUrl(`${endpoint}/getFile/${mf.getFolder()}/${mf.getName()}`)
                                    }} />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
        <PoweredBySSS floaatIt />
    </div>


    function InfoLay(prop:{sub:string, main:string}) {
        return <div style={{
            minWidth:dimen.dsk?120:100,
            marginTop:dimen.dsk?20:20,
            marginRight:10
        }}>
            <mye.Tv text={prop.sub} color={mye.mycol.imghint} size={12} />
            <Mgin top={5} />
            <mye.Tv text={prop.main} size={16} />
        </div>
    }

}