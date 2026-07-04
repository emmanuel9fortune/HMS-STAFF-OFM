import React, { useEffect } from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Notes from './Notes'
import Task from './Task'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setinfos } from '../../features/infoSlice'
import { selectip } from '../../features/ipSlice'
import HandOffs from './HandOffs'
import Roster from './Roster'

function NursePage() {
  
  //axios.defaults.withCredentials = true
  const ip = useSelector(selectip)

  const reload = useSelector((state) => state.reload.reload);
  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  const token = sessionStorage.getItem('refreshToken')

  const dispatch = useDispatch() 

  useEffect(()=>{
    const controller = new AbortController()
    const func =async()=>{
      try {
        await axios.post(`http://${ip?.ip}:7700/nurseDashboard`, {staffID: getid?._id, token, signal: controller.signal}).then((res)=>{
          // console.log(res);
          
          if(res.data.status === 'success'){ 
            dispatch( 
              setinfos({
                getNotification: res.data?.getNotification,
                getPatientDetails: res.data?.getPatientDetails,
                notes: res.data?.getnotes?.notes,
                task: res.data?.gettask,
              })
            )
            const accessToken = res.data.accessToken
            sessionStorage.setItem('accessToken', accessToken);
          }
        })
      } catch (error) {
        //console.log(error);
      }
    }
    func()
    return ()=> controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reload])



  return (
      <Router>
        <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/notes' element={<Notes/>} />
            <Route path='/tasks' element={<Task/>}/>
            <Route path='/handoff' element={<HandOffs/>}/>
            <Route path='/roster' element={<Roster/>}/>
        </Routes>
      </Router>
  )
}

export default NursePage