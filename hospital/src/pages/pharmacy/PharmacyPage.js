import React, { useEffect } from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
// import Dispenser from './Dispenser'
import ManageMent from './ManageMent'
// import DrugDate from './DrugDate'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setinfos } from '../../features/infoSlice'
// import Cart from './Cart'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import DispenseHistory from './DispenseHistory'
import Antenatal from './Antenatal'

function PharmacyPage() { 

  //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)
  
  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  const token = sessionStorage.getItem('refreshToken')
  const reload = useSelector((state) => state.reload.reload);


  const dispatch = useDispatch()

  useEffect(()=>{
    const controller = new AbortController()
    const func =async()=>{
      try {
        await axios.post(`http://${ip?.ip }:7700/pharmacyDashboard`, {staffID: getid?._id, token, signal: controller.signal}).then((res)=>{
          //console.log(res);
          
          if(res.data.status === 'success'){ 
            dispatch(
              setinfos({
                getprescribes: res.data?.getprescribes,
                getPatientDetails: res.data?.getPatientDetails,
                utils: res.data?.utils,
                getnotifications: res.data?.getnotifications,
                utilsQty: res.data?.utilsQty,
                batch: res.data?.getBatches,
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
          <Route path='/management' element={<ManageMent/>} />
          <Route path='/antenatal' element={<Antenatal/>} />
          <Route path='/dispence-history' element={<DispenseHistory/>} />
      </Routes>
    </Router>
  )
}

export default PharmacyPage