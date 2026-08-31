import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectip } from '../../features/ipSlice';
import { toast } from 'react-toastify'
import { setreloads } from '../../features/reloadSlice'
import { FaColumns } from 'react-icons/fa'

function DocResult({srch, handleView, handleSearch, getsearch}) {
    const ip = useSelector(selectip)
    const dispatch = useDispatch()

    
    const [option, setoption] = useState(false)

    const handleUpdateStatus1 =async(item)=>{
        const status = 'discharged'
        try{
        await axios.post(`http://${ip?.ip }:7700/updatePatientStatus`, {uid: item?._id , status}).then((res)=>{
            if(res.data.status === 'success'){
                setoption(false)
                toast.success('PATIENT STATUS UPDATED')
                dispatch(setreloads(Date.now()));
                handleSearch(getsearch)
            }
        })
        }catch(error){
        console.log(error)
        }
    }

    const handleUpdateStatus2 =async(item)=>{
        const status = 'admitted'
        try{
        await axios.post(`http://${ip?.ip }:7700/updatePatientStatus`, {uid: item?._id , status}).then((res)=>{
            if(res.data.status === 'success'){
                setoption(false)
                toast.success('PATIENT STATUS UPDATED')
                dispatch(setreloads(Date.now()));
                handleSearch(getsearch)
            }
        })
        }catch(error){
        console.log(error)
        }
    }

    const handleUpdateStatus3 =async(item)=>{
        const status = 'emergency'
        try{
        await axios.post(`http://${ip?.ip }:7700/updatePatientStatus`, {uid: item?._id , status}).then((res)=>{
            if(res.data.status === 'success'){
                setoption(false)
                toast.success('PATIENT STATUS UPDATED')
                dispatch(setreloads(Date.now()));
                handleSearch(getsearch)
            }
        })
        }catch(error){
        console.log(error)
        }
    }
    

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc'>
            <h4>{srch?.name}</h4>
            <p>{srch?.center ? "Ante Natal Patient" : srch?.family || srch?.familyid ? 'Family Card' : "Regular Patient"} {srch?.hop && `(${srch?.hop})`}</p> 
        </div>

        <div style={{margin:'0 20px', display:'flex', flexDirection:'column'}} className='Patientqueuecard_button'>
            <button onClick={()=>handleView(srch?._id, srch?.familyid )} >VIEW</button>
            {
                !srch?.family &&
                <p style={{color:'red'}}>{srch?.status === 'admitted' ? 'In Patient' : srch?.status === 'discharged' ? 'Out Patient' : srch?.status === 'emergency' ? 'Emergency Patient' : 'Out Patient'}</p>
            }
        </div>
        
        {
            !srch?.family &&
            <div onClick={()=>setoption(true)} className='card_icon_' >
                <FaColumns size={22} /> 
            </div>
        }

        {
            option &&
            <div onClick={()=>setoption(false)} className='card_option_overlay' ></div>
        }
        
        {
            option &&
            <div className='card_option' >
                <div onClick={()=>handleUpdateStatus1(srch)}>
                    <h4  style={{color:'green'}} >OUT PATIENT</h4>
                </div> 
                <div onClick={()=>handleUpdateStatus2(srch)}>
                    <h4 style={{color:'gold'}} >IN PATIENT</h4>
                </div>
                <div onClick={()=>handleUpdateStatus3(srch)}>
                    <h4 style={{color:'red'}} >EMERGENCY</h4>
                </div>
            </div>
        }
    </div>
  )
}

export default DocResult