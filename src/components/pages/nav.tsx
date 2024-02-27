import { useState } from "react"
import logo from "../../assets/schoolsilo.png"
import { Mgin, icony, myEles } from "../../helper/general"
import { Close, ContactsOutlined, DashboardOutlined, LogoutOutlined, MessageOutlined, PaymentOutlined, PersonOutline, SettingsOutlined } from "@mui/icons-material"


export function SchoolNav(mainprop:{currentTab:number,mye:myEles,isMobile:boolean, ocl:(pos:number)=>void, showy:()=>void}){

    const[selpos, setSelPos] = useState(mainprop.currentTab)

    return <div style={{
        width:'100%',
        height:'100%',
        overflowY:'scroll',
        backgroundColor: mainprop.mye.mycol.primarycol,
    }}>
        <div className="vlc" style={{
            width: '100%',
        }}>
            <div style={{
                display: mainprop.isMobile?undefined:'none',
                alignSelf:'flex-end'
            }}>
                <Mgin top={10} />
                <div className="ctr" style={{
                    width:50,
                    height:50
                }} onClick={()=>{
                    mainprop.showy()
                }}>
                    <Close style={{
                        color:mainprop.mye.mycol.white
                    }}/>
                </div>
            </div>
            <Mgin top={20} />
            <img src={logo} alt="SCHOOLSILO Logo" />
            <Mgin top={20} />
            <Tab icon={DashboardOutlined} text="Dashboard" pos={0} />
            <Tab icon={PaymentOutlined} text="Payments" pos={1} />
            <Tab icon={MessageOutlined} text="Messages" pos={2} />
            <Tab icon={PersonOutline} text="User Profile" pos={3} />
            <Tab icon={LogoutOutlined} text="Logout" pos={4} />
            
        </div>
    </div>

    function Tab(prop:{icon:icony, text:string, pos:number}) {
        return <div id="clk" style={{
            display:'flex',
            width:'100%',
            height: 45
        }} onClick={()=>{
            mainprop.ocl(prop.pos)
            setSelPos(prop.pos)
        }}>
            <div style={{
                display: selpos===prop.pos?undefined:' none',
                width:4,
                height:'100%',
                backgroundColor: mainprop.mye.mycol.white
            }}></div>
            <div style={{
                flex:1,
                height:'100%',
                backgroundColor:selpos===prop.pos?'rgba(255,255,255,0.1)':undefined,
                display:'flex',
                alignItems:'center',
            }}>
                <Mgin right={15} />
                <prop.icon style={{
                    fontSize:20,
                    color:mainprop.mye.mycol.white
                }} />
                <Mgin right={20} />
                <mainprop.mye.Tv text={prop.text} color={mainprop.mye.mycol.white} />
            </div>
        </div>
    }
}


export function PartnerNav(mainprop:{currentTab:number,mye:myEles,isMobile:boolean, ocl:(pos:number)=>void, showy:()=>void}){

    const[selpos, setSelPos] = useState(mainprop.currentTab)

    return <div style={{
        width:'100%',
        height:'100%',
        overflowY:'scroll',
        backgroundColor: mainprop.mye.mycol.primarycol,
    }}>
        <div className="vlc" style={{
            width: '100%',
        }}>
            <div style={{
                display: mainprop.isMobile?undefined:'none',
                alignSelf:'flex-end'
            }}>
                <Mgin top={10} />
                <div className="ctr" style={{
                    width:50,
                    height:50
                }} onClick={()=>{
                    mainprop.showy()
                }}>
                    <Close style={{
                        color:mainprop.mye.mycol.white
                    }}/>
                </div>
            </div>
            <Mgin top={20} />
            <img src={logo} alt="SCHOOLSILO Logo" />
            <Mgin top={20} />
            <Tab icon={DashboardOutlined} text="Dashboard" pos={0} />
            <Tab icon={ContactsOutlined} text="Customers" pos={1} />
            <Tab icon={PaymentOutlined} text="Payments" pos={2} />
            <Tab icon={MessageOutlined} text="Messages" pos={3} />
            <Tab icon={SettingsOutlined} text="My Profile" pos={4} />
            <Tab icon={LogoutOutlined} text="Logout" pos={5} />
            
        </div>
    </div>

    function Tab(prop:{icon:icony, text:string, pos:number}) {
        return <div id="clk" style={{
            display:'flex',
            width:'100%',
            height: 45
        }} onClick={()=>{
            mainprop.ocl(prop.pos)
            setSelPos(prop.pos)
        }}>
            <div style={{
                display: selpos===prop.pos?undefined:' none',
                width:4,
                height:'100%',
                backgroundColor: mainprop.mye.mycol.white
            }}></div>
            <div style={{
                flex:1,
                height:'100%',
                backgroundColor:selpos===prop.pos?'rgba(255,255,255,0.1)':undefined,
                display:'flex',
                alignItems:'center',
            }}>
                <Mgin right={15} />
                <prop.icon style={{
                    fontSize:20,
                    color:mainprop.mye.mycol.white
                }} />
                <Mgin right={20} />
                <mainprop.mye.Tv text={prop.text} color={mainprop.mye.mycol.white} />
            </div>
        </div>
    }
}




export function AdminNav(mainprop:{currentTab:number,mye:myEles,isMobile:boolean, ocl:(pos:number)=>void, showy:()=>void}){

    const[selpos, setSelPos] = useState(mainprop.currentTab)

    return <div style={{
        width:'100%',
        height:'100%',
        overflowY:'scroll',
        backgroundColor: mainprop.mye.mycol.primarycol,
    }}>
        <div className="vlc" style={{
            width: '100%',
        }}>
            <div style={{
                display: mainprop.isMobile?undefined:'none',
                alignSelf:'flex-end'
            }}>
                <Mgin top={10} />
                <div className="ctr" style={{
                    width:50,
                    height:50
                }} onClick={()=>{
                    mainprop.showy()
                }}>
                    <Close style={{
                        color:mainprop.mye.mycol.white
                    }}/>
                </div>
            </div>
            <Mgin top={20} />
            <img src={logo} alt="SCHOOLSILO Logo" />
            <Mgin top={20} />
            <Tab icon={DashboardOutlined} text="Dashboard" pos={0} />
            <Tab icon={ContactsOutlined} text="Directory" pos={1} />
            <Tab icon={PaymentOutlined} text="Payments" pos={2} />
            <Tab icon={MessageOutlined} text="Messages" pos={3} />
            <Tab icon={SettingsOutlined} text="Settings" pos={4} />
            <Tab icon={LogoutOutlined} text="Logout" pos={5} />
            
        </div>
    </div>

    function Tab(prop:{icon:icony, text:string, pos:number}) {
        return <div id="clk" style={{
            display:'flex',
            width:'100%',
            height: 45
        }} onClick={()=>{
            mainprop.ocl(prop.pos)
            setSelPos(prop.pos)
        }}>
            <div style={{
                display: selpos===prop.pos?undefined:' none',
                width:4,
                height:'100%',
                backgroundColor: mainprop.mye.mycol.white
            }}></div>
            <div style={{
                flex:1,
                height:'100%',
                backgroundColor:selpos===prop.pos?'rgba(255,255,255,0.1)':undefined,
                display:'flex',
                alignItems:'center',
            }}>
                <Mgin right={15} />
                <prop.icon style={{
                    fontSize:20,
                    color:mainprop.mye.mycol.white
                }} />
                <Mgin right={20} />
                <mainprop.mye.Tv text={prop.text} color={mainprop.mye.mycol.white} />
            </div>
        </div>
    }
}
