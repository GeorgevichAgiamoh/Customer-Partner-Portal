import { useEffect, useRef, useState } from "react"
import { Btn, EditTextFilled, ErrorCont, Line, LrText, Mgin, appName, goUrl, myEles, setTitle } from "../../../../helper/general"
import useWindowDimensions from "../../../../helper/dimension"
import { ArrowBack, AttachFileOutlined, FileOpenOutlined, MessageOutlined, PersonOutline } from "@mui/icons-material"
import { adminUserEle, defVal, fileEle, getCreatedTime, msgEle, msgThread } from "../../../classes/models"
import { CircularProgress, dividerClasses } from "@mui/material"
import Toast from "../../../toast/toast"
import { endpoint, getUserId, makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { PoweredBySSS } from "../../../../helper/schoolsilo"


export function AdminMessageThread(mainprop:{thread:msgThread,me:adminUserEle,backy:(action:number)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const [mykey,setMyKey] = useState(Date.now())
    const[msgs, setMsgs] = useState<msgEle[]>([])
    const[send,setSend] = useState('')
    const[art,setArt] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        setTitle(`${mainprop.thread.getSubject()} - ${appName}`)
        getMsgs()
    },[])

    function getMsgs(){
        setError(false)
        setLoad(true)
        makeRequest.get(`getMessageThread/${mainprop.thread.getThreadId()}`,{},(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:msgEle[] = []
                for(const key in task.getData()){
                    tem.push(new msgEle(task.getData()[key]))
                }
                setMsgs(tem)
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

    return <div key={mykey} style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20, 
        height:'100%',
        display:'flex',
        flexDirection:'column'
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getMsgs()
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
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div className="hlc">
            <MessageOutlined style={{
                fontSize:20,
                color:mye.mycol.secondarycol
            }} />
            <Mgin right={10} />
            <mye.HTv size={14} text={mainprop.thread.getSubject()} color={mye.mycol.secondarycol} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%',
            flex:1
        }}>
            {
                msgs.length==0?<div style={{
                    width:'100%',
                    height:'100%'
                }} className="ctr">
                    <mye.Tv text="No Messages Yet. Start One" color={mye.mycol.hint} size={12} />
                </div>:<div className="vlc" style={{
                    overflowY:'scroll',
                    width:'100%'
                }}>
                    {
                        msgs.map((msg,i)=>{
                            return <MessageMini key={mykey+i+0.34731} ele={msg} />
                        })
                    }
                </div>
            }
        </div>
        <Mgin top={10} />
        <div style={{
            width:'100%',
            display:'flex',
            margin: dimen.dsk?10:5,
        }}>
            <div className="hlc" id="lshdw" style={{
                flex:1,
                backgroundColor:mye.mycol.white,
                borderRadius:10,
            }}>
                <Mgin right={15} />
                <MessageOutlined style={{
                    fontSize:20,
                    color:mye.mycol.imghint
                }} />
                <Mgin right={5} />
                <input className="tinp"
                    type="text"
                    value={send}
                    placeholder="Type Message Here"
                    onChange={(e)=>{
                        setSend(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMsg()
                        }
                    }}
                    style={{
                        flex:1,
                    }}
                />
                <Mgin right={5} />
                <input
                    type="file"
                    onChange={(e)=>{
                        const file = e.target.files?.[0];
                        if(file){
                            setArt(file)
                            toast('File Added',1)
                        }
                    }}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <AttachFileOutlined style={{
                    fontSize:24,
                    color: art?mye.mycol.primarycol:mye.mycol.imghint,
                    padding:"5px 7px"
                }}  onClick={()=>{
                    fileInputRef.current?.click()
                }} />
                <div className="hlc" style={{
                    display: art?undefined:'none'
                }}>
                    <Mgin right={3} />
                    <mye.Tv color={mye.mycol.primarycol} text="File Attached" size={12} />
                </div>
            </div>
            <Mgin right={10} />
            <Btn txt="Send" width={100} onClick={()=>{
                sendMsg()
            }} strip={send.length < 3} />
        </div>
        <PoweredBySSS floaatIt />
    </div>

    function sendMsg() {
        const sc = send.trim()
        if(sc.length < 3){
            toast('Enter at least 3 characters',0)
            return;
        }
        setLoad(true)
        function finise(fid:string){
            makeRequest.post('sendMsg',{
                body: sc,
                who: getUserId(),
                tid: mainprop.thread.getThreadId(),
                mail: mainprop.thread.amFrom()?mainprop.thread.getToMail():mainprop.thread.getFromMail(),
                art:fid
            },(task)=>{
                setLoad(false)
                if(task.isSuccessful()){
                    toast('Message Sent',1)
                    const lastMsg = new msgEle(task.getData())
                    const tem = [...msgs]
                    tem.push(lastMsg)
                    setMsgs(tem)
                    setSend('')
                    setArt(undefined)
                }else{
                    toast(task.getErrorMsg(),0)
                }
            })
        }
        if(art){
            let fileId = Date.now().toString()
            if (art.type.startsWith('image/')) {
                fileId = 'img_'+fileId;
            }
            makeRequest.uploadFile('msg',fileId,getUserId(),art!, (task)=>{
                if(task.isSuccessful()){
                    finise(fileId)
                }else{
                    setLoad(false)
                    if(task.isLoggedOut()){
                        navigate('/adminLogin')
                        return
                    }
                    toast(task.getErrorMsg(),0)
                }
            })
        }else{
            finise('_')
        }
    }

    function MessageMini(prop:{ele:msgEle}) {
        return <div id="lshdw" className="vlc" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            marginTop:20,
            boxSizing:'border-box',
            padding:dimen.dsk?20:10,
            alignItems:'flex-start',
            alignSelf: prop.ele.isMe()?'flex-end':'flex-start',
            minWidth:dimen.dsk?400:200
        }}>
            <LrText
                left={<div className="hlc">
                    <img src={`${endpoint}/getFile/dp/${prop.ele.getWho()}`} alt="" style={{
                        objectFit:'cover',
                        width:45,
                        height:45,
                        backgroundColor:mye.mycol.btnstrip,
                        borderRadius:50
                    }}  />
                    <Mgin right={5} />
                    <div>
                        <mye.Tv text="Sent By:" size={12} />
                        <Mgin top={2} />
                        <mye.Tv text={mainprop.thread.getNameById(prop.ele.getWho())} />
                    </div>
                </div>}
                right={<mye.Tv text={prop.ele.getTime()} />}
                />
            <Mgin top={10}/>
            <div style={{
                display: prop.ele.hasArt()?undefined:'none'
            }}>
                {
                    prop.ele.isArtImage()?<img src={prop.ele.getArtUrl()} alt={'Message'} style={{
                        objectFit:'cover',
                        width:200,
                        borderRadius:10
                    }} />:<div className="hlc">
                        <FileOpenOutlined className="icon" />
                        <Mgin right={5} />
                        <mye.Tv text="File - Download" size={14} onClick={()=>{
                            goUrl(prop.ele.getArtUrl())
                        }} color={mye.mycol.primarycol} />
                    </div>
                }
                <Mgin top={5} />
            </div>
            <mye.Tv text={prop.ele.getBody()} />
        </div>
    }

}
