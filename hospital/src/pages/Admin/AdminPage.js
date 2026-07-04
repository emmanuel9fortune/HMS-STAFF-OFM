import React, { useEffect } from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import AddStaff from './AddStaff'
import AddServices from './AddServices'
import AddUtils from './AddUtils'
import SearchDrugs from './SearchDrugs'
import SearchPatient from './SearchPatient'
import DrugDate from './DrugDate'
import TransactionHistory from './TransactionHistory'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setinfos } from '../../features/infoSlice'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import Paymentdesk from './Paymentdesk'
import Roster from './Roster'


function AdminPage() {

  const dispatch = useDispatch()
    const ip = useSelector(selectip)

  useEffect(()=>{
      const func =async()=>{
          try{
              await axios.post(`http://${ip?.ip }:7700/Admdashboard`).then((res)=>{
                //console.log(res)
                if(res.data.status === 'success'){ 
                  dispatch(
                    setinfos({
                      invoice: res.data.TotalInvoice || 0,
                      numberOfPatients: res.data.getPatientCount || 0,
                      numberOfutils: res.data.getutilsCount || 0,
                      staffs: res.data.getSaff || 0,
                      stocksExpire: res.data.stocksExpire || 0,
                      batches : res.data.getBatches,
                      analytics : res.data.analytics[0],
                    })
                  )
                }
              })
          }catch(error){
              console.log(error)
          }
      }
      func()
  },[dispatch, ip])

  return (
    <Router>
      <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/addstaff' element={<AddStaff/>} />
          <Route path='/addutils' element={<AddUtils/>} />
          <Route path='/searchdrugs' element={<SearchDrugs/>} />
          <Route path='/searchpatient' element={<SearchPatient/>} />
          <Route path='/drugdate' element={<DrugDate/>} /> 
          <Route path='/history' element={<TransactionHistory/>} />
          <Route path='/addservices' element={<AddServices/>} />
          <Route path='/paymentdesk' element={<Paymentdesk/>} />
          <Route path='/addroster' element={<Roster/>} />
      </Routes>
    </Router> 
  )
}

export default AdminPage