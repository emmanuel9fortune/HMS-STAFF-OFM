import React, { useEffect, useState } from 'react'
import './App.css'
import Receptionist from './pages/Receptionist/Receptionist'
import NursePage from './pages/nurse/NursePage'
import '../src/pages/Allstyling.css'
import LabPage from './pages/laboratory/LabPage'
import DoctorPage from './pages/doctor/DoctorPage'
import PharmacyPage from './pages/pharmacy/PharmacyPage'
import Login from './Login'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
// import { setUplistiners } from './socketClient
import { useDispatch } from 'react-redux'
import { setips } from './features/ipSlice'
import chime from './img/chime.dat'
import { setreloads } from './features/reloadSlice'
// import AdminPage from './pages/Admin/AdminPage'
import Loader from './Loader'
import Connection from './Connection'
import Network from './Network'
import logo from '../src/img/logo.jpg'
import axios from 'axios'


function App({serverIP, newSocket}) {

  useEffect(() => {
    const handleFirstUserInteraction = () => {
      const audio = new Audio(chime);
      audio.play().catch(() => {}); // unlocks future audio play
      window.removeEventListener('click', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction);
  }, []);
  //axios.defaults.withCredentials = true
  
  const staffID = sessionStorage.getItem('staffID')
  const getDep = JSON.parse(staffID)
  const dispatch = useDispatch()
  
  // ========================================================================== //
  // ||||||||||||||||||||||| NOTIFICATION FUNCTION |||||||||||||||||||||||||||| //
  // ========================================================================= //
  useEffect(() => {
    // if (!socket) return;
    if('Notification' in window && Notification.permission !== 'granted'){
      Notification.requestPermission()
    }
    newSocket?.on("message", (data) => {
      if(Notification.permission === 'granted'){
        new Notification('NOTIFICATION',{
          body: data,
          icon: logo
        })
      }

      const func=async()=>{
        try {
          await axios.post('http://localhost:4000/notify',{message: data}).then()
        } catch (error) {
          console.log(error)
        }
      }
      func()
      const audio = new Audio(chime);
      audio.play().catch(err => console.warn('🔇 Playback failed:', err))
      toast.warning(data);
      dispatch(setreloads(Date.now()));
    });

    return () => {
      newSocket?.off("message");
    };
  }, [newSocket, dispatch]);
  // ========================================================================== //
  // ||||||||||||||||||||||| NOTIFICATION FUNCTION |||||||||||||||||||||||||||| //
  // ========================================================================= //




  // ========================================================================== //
  // ||||||||||||||||||||||| JOINING ROOM FUNCTION |||||||||||||||||||||||||||| //
  // ========================================================================= //
  useEffect(() => {
    if (getDep?.title) {

      const room = getDep.title
    
      const joinRoom = () => {
        if (room) {
          newSocket.emit("join_room", room);
          //console.log(`✅ Joined room: ${room}`);
        }
      };

      newSocket.on("connect", joinRoom);
      newSocket.on("reconnect", joinRoom); // When auto-reconnected
      newSocket.on("disconnect", (reason) => {
        console.warn("❌ Disconnected:", reason);
      });

      return () => {
        newSocket.off("connect", joinRoom);
        newSocket.off("reconnect", joinRoom);
      };
    }
  }, [newSocket, getDep]);
  // ========================================================================== //
  // ||||||||||||||||||||||| JOINING ROOM FUNCTION |||||||||||||||||||||||||||| //
  // ========================================================================= //





  const [ipLoaded, setIpLoaded] = useState(false);
  const [connection, setconnection] = useState(false);
  const [network, setnetwork] = useState(false);
  // ========================================================================== //
  // ||||||||||||||||||||||| CHECK IP FUNCTION |||||||||||||||||||||||||||| //
  // ========================================================================= //
  
  useEffect(() => {
    const getIP = async () => {
      try {
          if (serverIP) {
            dispatch(setreloads(Date.now()));
            // //console.log('Discovered Server IP:', ip);
            setnetwork(false)
          }

          // // Fallback to local IP if needed
          if (!serverIP) {
            setnetwork(false)
          }

          if (serverIP) {
          dispatch(
            setips({
              ip: serverIP
            })
          );
        } else {
          console.warn('No IP address found.');
          setconnection(true)
        }
      } catch (err) {
        console.error('IP discovery error:', err);
        setconnection(true)
      } finally {
        setIpLoaded(true);
        setconnection(false)
      }
    };

    getIP();
  }, [dispatch, serverIP]);
  // ========================================================================== //
  // ||||||||||||||||||||||| CHECK IP FUNCTION |||||||||||||||||||||||||||| //
  // ========================================================================= //





  const [reload, setreload] = useState(0)
  const [login, setlogin] = useState('')

  useEffect(()=>{
    const func=()=>{
      setlogin(getDep)
      setreload(0)
    }
    func()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reload])

  

  return (
    <>
      <ToastContainer/>
      { connection ?
        <Connection/>
        :
        !ipLoaded ?
          <Loader/>
        :
        network ?
          <Network/>
        :
        login ?
          login?.title === 'receptionist' || login?.title === 'cashier' ?
            <Receptionist/>
          :
          login?.title === 'nurse' ?
            <NursePage/>
          :
          login?.title === 'laboratory' ?
            <LabPage/>
          :
          login?.title === 'doctor' ?
            <DoctorPage/>
          :
            login?.title === 'pharmacy' ?
            <PharmacyPage/>
          :
          <Login serverIP={serverIP} setreload={setreload} reload={reload} newSocket={newSocket} />
        :
          <Login serverIP={serverIP} setreload={setreload} reload={reload} newSocket={newSocket} />
      }
        {/* <AdminPage/> */}
    </>
  )
}

export default App