import React, { useEffect, useState } from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setinfos } from '../../features/infoSlice'
import { selectip } from '../../features/ipSlice'
import Task from './Task'
import Notes from './Notes'
import TransactionHistory from './TransactionHistory'
import Antenatal from './Antenatal'

function LabPage() {

  // labdashboard
  
  //axios.defaults.withCredentials = true
  const ip = useSelector(selectip)

  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  const token = sessionStorage.getItem('refreshToken')

  const [reload1, setreload1] = useState(0)
  const reload = useSelector((state) => state.reload.reload);

  const dispatch = useDispatch()

  useEffect(()=>{
    const controller = new AbortController()
    const func =async()=>{
      try {
        await axios.post(`http://${ip?.ip }:7700/labdashboard`, {staffID: getid?._id, token, signal: controller.signal}).then((res)=>{
          // console.log(res);
          
          if(res.data.status === 'success'){ 
            dispatch(
              setinfos({
                getrequest: res.data?.getrequest,
                getPatientDetails: res.data?.getPatientDetails,
                notes: res.data?.getnotes,
                task: res.data?.gettask,
              })
            )
            const accessToken = res.data.accessToken
            sessionStorage.setItem('accessToken', accessToken);
            setreload1(0)
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
              <Route path='/tasks' element={<Task reload={reload1} setreload={setreload1} />} />
              <Route path='/notes' element={<Notes reload={reload1} setreload={setreload1} />} />
              <Route path='/antenatal' element={<Antenatal reload={reload1} setreload={setreload1} />} />
              <Route path='/history' element={<TransactionHistory  />} />
          </Routes>
        </Router>
  )
}

export default LabPage