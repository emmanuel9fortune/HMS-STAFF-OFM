import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setids } from '../../features/idSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { setreloads } from '../../features/reloadSlice'
import { selectip } from '../../features/ipSlice'
import { FaColumns } from 'react-icons/fa'
import { setfids } from '../../features/fidSlice'

function NurseCard({item, currentIndex, setcurrentIndex, nurse, getsearch, handleSearch}) {

    const ip = useSelector(selectip)
    
    const dispatch = useDispatch()

    const handleView =(id)=>{
        sessionStorage.setItem('name', item?.name)
        setcurrentIndex(currentIndex + 1)
        dispatch(
            setids({
                id: item?._id,
                fid: item?.familyid
            })
        )
        dispatch(
            setfids({
                id:'',
                fid:''
            })
        )
    }

    
    const [option, setoption] = useState(false)

    const handleUpdateStatus1 =async(item)=>{
        const status = 'discharged'
        try{ 
        await axios.post(`http://${ip?.ip}:7700/updatePatientStatus`, {uid: item?._id , status}).then((res)=>{
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
        await axios.post(`http://${ip?.ip}:7700/updatePatientStatus`, {uid: item?._id , status}).then((res)=>{
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
        await axios.post(`http://${ip?.ip}:7700/updatePatientStatus`, {uid: item?._id , status}).then((res)=>{
            if(res.data.status === 'success'){
                setoption(false)
                toast.success('PATIENT STATUS UPDATED')
                dispatch(setreloads(Date.now()));
            }
        })
        }catch(error){
        console.log(error)
        }
    }

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc'>
            <h4>{item?.name}</h4>
            <p>{item?.center ? "Ante Natal Patient" : item?.family || item?.familyid ? 'Family Card' : "Regular Patient"} {item?.hop && `(${(item?.hop)})`}</p>
        </div>

            <div style={{margin:'0 20px', display:'flex', flexDirection:'column'}} className='Patientqueuecard_button'>
                {
                    !nurse && 
                    <button onClick={()=>handleView(item?._id, item?.familyid)} >VIEW</button>
                }
                {
                    !item?.family &&
                    <p style={{color:'red'}}>{item?.status === 'admitted' ? 'In Patient' : item?.status === 'discharged' ? 'Out Patient' : item?.status === 'emergency' ? 'Emergency Patient' : 'Out Patient'}</p>
                }
            </div>
             {
                !item?.family &&
                <div onClick={()=>setoption(true)} className='card_icon_' >
                    <FaColumns size={22} /> 
                </div>
             }
        {
            option &&
            !item?.family &&
            <div onClick={()=>setoption(false)} className='card_option_overlay' ></div>
        }

        {
            option &&
            <div className='card_option' >
                <div onClick={()=>handleUpdateStatus1(item)}>
                    <h4  style={{color:'green'}} >OUT PATIENT</h4>
                </div>
                <div onClick={()=>handleUpdateStatus2(item)}>
                    <h4 style={{color:'gold'}} >IN PATIENT</h4>
                </div>
                <div onClick={()=>handleUpdateStatus3(item)}>
                    <h4 style={{color:'red'}} >EMERGENCY</h4>
                </div>
            </div>
        }
    </div>
  )
}

export default NurseCard