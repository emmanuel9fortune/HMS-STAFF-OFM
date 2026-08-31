import React, { useState } from 'react'
import logo from '../src/img/logo.jpg'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectip } from './features/ipSlice'
import { toast } from 'react-toastify'
import { FiEye, FiEyeOff } from 'react-icons/fi'


function Login({setreload, reload, serverIP, newSocket}) {

    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

    const [passkey, setpasskey] = useState(0)
    const handleLogin =async()=>{
        try {
            await axios.post(`http://${ip?.ip }:7700/staffLogin`, {passkey}).then((res)=>{
                //console.log(res);
                
                if(res.data.status === 'success'){                    
                    newSocket.emit("join_room", {room: res.data.verify?.title})

                    const getinfo = JSON.stringify(res.data.verify)
                    sessionStorage.setItem('staffID', getinfo)
                    sessionStorage.setItem('accessToken', res.data.accessToken)
                    sessionStorage.setItem('refreshToken', res.data.refreshToken)
                    setreload(reload + 1)
                }else{
                    toast.error(res.data.message)
                }
            })
        } catch (error) {
            console.log(error);
        } 
    }

    const [count, setcount] = useState(0)
    const [newip, setnewip] = useState('')

    const handleIP =()=>{
        localStorage.setItem('ip', newip)
        toast.success('IP ADDED')
        window.location.reload()
    }

    const [pass, setpass] = useState(false)

  return (
    <>
        {   count === 0 &&
            <div className='login_container'>
                <div className='login_container_body' >
                    <img src={logo} alt='' />

                    <h3>ENTER STAFF PASSKEY</h3>

                    <div style={{width:'330px', display:'flex', alignItems:'center', padding:'20px 0'}}>
                        <input style={{padding:'15px'}} onChange={(e)=>setpasskey(e.target.value)} type={!pass ? 'password' : 'number'} placeholder='Enter Your Passkey'  />
                        {
                            pass ?
                            <button style={{padding:'15px'}} onClick={()=>setpass(false)}>
                                <FiEye size={22} />
                            </button>
                            :
                            <button style={{padding:'15px'}} onClick={()=>setpass(true)}>
                                <FiEyeOff size={22} />
                            </button>
                        }
                    </div>


                    <button onClick={handleLogin} >LOGIN</button>

                    <p>Want to change Ip Address ? <span onClick={()=>setcount(1)} style={{fontWeight:'bold', color:'blue', textDecoration:'underline', cursor:'pointer'}}>Click</span></p>
                </div>
            </div>
        }

        {   count === 1 &&
            <div className='login_container'>
                <div className='login_container_body' >
                    <img src={logo} alt='' />

                    <h3>ENTER IP ADDRESS</h3>

                    <input onChange={(e)=>setnewip(e.target.value)} type='text' placeholder='Enter IP ADDRESS'  />

                    <button onClick={handleIP} >SET IP</button>

                    <p>Go back to login ? <span onClick={()=>setcount(0)} style={{fontWeight:'bold', color:'blue', textDecoration:'underline', cursor:'pointer'}}>Click</span></p>
                </div>
            </div>
        }
    </>
  )
}

export default Login