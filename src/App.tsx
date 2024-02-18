//import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route, useLocation, } from 'react-router-dom'
import { createTheme, ThemeProvider } from "@mui/material";
import { lazy, useEffect, useState } from 'react';
import {  ForgotPassword, MailLogin, ResetPassword, Verif, } from './components/pages/login';
import { PaySchoolRegFee, RegisterPartner, RegisterSchool } from './components/pages/register';
import { Partners } from './components/pages/partners/partners';

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
          <Route path='/'  element={<Partners />}></Route>
            <Route path='/schoolRegister/:pcode?'  element={<RegisterSchool />}></Route>
            <Route path='/partnerRegister'  element={<RegisterPartner />}></Route>
            <Route path='/schoolLogin'  element={<MailLogin acctType={0} />}></Route>
            <Route path='/partnerLogin'  element={<MailLogin acctType={1} />}></Route>
            <Route path='/adminlogin'  element={<MailLogin acctType={2} />}></Route>
            <Route path='/payregfee'  element={<PaySchoolRegFee />}></Route>
            <Route path='/forgotpassword/:who'  element={<ForgotPassword />}></Route>
            <Route path='/verif'  element={<Verif />}></Route>
            <Route path='/passwordreset/:who/:token'  element={<ResetPassword />}></Route>
            {/* <Route path='/admindash'  element={<Admin />}></Route>
            <Route path='/memberdash'  element={<Members />}></Route> */}
            <Route path='/partnerdash'  element={<Partners />}></Route>
          </Routes>
        </Router>
      </div> 
    </ThemeProvider>
  );
}



