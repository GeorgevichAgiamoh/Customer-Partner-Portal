//import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route, useLocation, useNavigate, } from 'react-router-dom'
import { createTheme, ThemeProvider } from "@mui/material";
import { lazy, useEffect, useState } from 'react';
import {  ForgotPassword, MailLogin, ResetPassword, Verif, } from './components/pages/login';
import { PaySchoolRegFee, RegisterAdmin, RegisterPartner, RegisterSchool } from './components/pages/register';
import { Partners } from './components/pages/partners/partners';
import { Schools } from './components/pages/schools/schools';
import { Btn, Mgin, myEles } from './helper/general';
import { Admin } from './components/pages/admin/admin';

function useQuery(){
  return new URLSearchParams(useLocation().search);
}

const theme = createTheme({
  palette: {
      primary:{
          main: '#0411A7'
      },
      secondary:{
          main:'#FFA500'
      },
  }
})


export default function App() {
  const[isNgt, setNgt] = useState(false)
  const[isApp, setIsApp] = useState(true)
  //const qry = useQuery();

  useEffect(()=>{
    let murl = window.location.href;
    if(murl.includes('mode=')){
      let url = murl.split('mode=')[1]
      if(url.startsWith('n')){
        setNgt(true)
      }
    }
    setIsApp(murl.includes('app='))
  },[])
 
  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/'  element={<MainPage />}></Route>
            <Route path='/schoolRegister/:pcode?'  element={<RegisterSchool />}></Route>
            <Route path='/partnerRegister'  element={<RegisterPartner />}></Route>
            <Route path='/adminRegister'  element={<RegisterAdmin />}></Route>
            <Route path='/schoolLogin'  element={<MailLogin acctType={0} />}></Route>
            <Route path='/partnerLogin'  element={<MailLogin acctType={1} />}></Route>
            <Route path='/adminLogin'  element={<MailLogin acctType={2} />}></Route>
            <Route path='/payregfee'  element={<PaySchoolRegFee />}></Route>
            <Route path='/forgotpassword/:who'  element={<ForgotPassword />}></Route>
            <Route path='/verif'  element={<Verif />}></Route>
            <Route path='/passwordreset/:who/:token'  element={<ResetPassword />}></Route>
            <Route path='/partnerdash'  element={<Partners />}></Route>
            <Route path='/schooldash'  element={<Schools />}></Route>
            <Route path='/admindash'  element={<Admin />}></Route>
          </Routes>
        </Router>
      </div> 
    </ThemeProvider>
  );
}

function MainPage(){
  const navigate = useNavigate()
  const mye = new myEles(false)


  return <div>
    <mye.HTv text='What portal do you want to visit' />
    <Mgin top={10}/>
    <Btn txt='Partner Portal' width={140} strip onClick={()=>{
      navigate('/partnerLogin')
    }} />
    <Mgin top={20}/>
    <Btn txt='School Portal' width={140} strip onClick={()=>{
      navigate('/schoolLogin')
    }} />
    <Mgin top={10}/>
  </div>

}

