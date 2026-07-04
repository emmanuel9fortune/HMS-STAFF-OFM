import React, { useState } from 'react'
import NurseBar from '../../components/NurseBar'
import { FaSearch } from 'react-icons/fa'
import { MdNotifications } from 'react-icons/md'
import EditPatientTests from './EditPatientTests'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import { toast } from 'react-toastify'
import { setreloads } from '../../features/reloadSlice'
import { selectip } from '../../features/ipSlice'
import DispanseUtils from './DispanseUtils'
import NurseCard from './NurseCard'
import PatientDetails from './PatientDetails'
import LabResult from './LabResult'
import Medications from './Medications'
import Prescriptions from './Prescriptions'
import { FiLoader } from 'react-icons/fi'
import UrineOutput from './UrineOutput'
import TransactionHistory from './TransactionHistory'

function Dashboard() {
    
    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

    const [currentIndex, setcurrentIndex] = useState(0)
    const dispatch = useDispatch()

    const handleBack =()=>{
        setcurrentIndex(0)
    }


    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

    const handleSearch = async(e) => {
        const searchQuery = typeof e === 'string' ? e : e?.target?.value || '';
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${ip?.ip }:7700/search`, value);
                setsearch(response.data.patients) 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    const info = useSelector(selectinfo)

 
    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const handleUpdateTask =async(ids)=>{
        try {
        await axios.post(`http://${ip?.ip }:7700/updatetask`, {taskId: ids, uid: getid?._id }).then((res)=>{
            if(res.data.status === 'success'){
                toast.success('Task completed')
                dispatch(
                    setreloads(Date.now())
                )
            }
        })
        } catch (error) {
        //console.log(error);
        }
    }

    

    
    const timeStampMap = new Map(
        (info?.getNotification || []).map(item => [
            item?.uid,
            Number(item?.timeStamp) || 0
        ])
    );

    // Clone and sort the patients
    const sorted = [...(info?.getPatientDetails || [])].sort((a, b) => {
        const timeA = timeStampMap.get(a?._id) || 0;
        const timeB = timeStampMap.get(b?._id) || 0;
        return timeB - timeA; // Latest first
    }); 

    
    const isMobileDevice = window.innerWidth <= 768    

    const getPatientName = sessionStorage.getItem('name') 

  return (
    <div className='dashboard_container' style={isMobileDevice ? {width:'100%', padding:'5px'} : {}}>
        <NurseBar/>
        {
            getPatientName && currentIndex > 0 &&   
            <h1 style={{position:'absolute', top:'10px', right:'40%'}} >{getPatientName}</h1>

        }


        {
            currentIndex === 0 &&
            <div className='dashboard_body' style={isMobileDevice ? {width:'100%', padding:'5px'} : {}}>
                <h1>Nurse Dashboard</h1>
                <div className='dashboard_body_header' style={isMobileDevice ? {width:'100%', padding:'5px'} : {}}>
                    <div className='dashboard_body_header_search' style={isMobileDevice ? {width:'100%'} : {}}>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search for patients' />
                    </div> 
 
                    {
                        !isMobileDevice &&
                        <div className='dashboard_body_header_displays' style={{cursor:'pointer'}} onClick={()=>window.location.reload()} >
                            <div className='dashboard_body_header_displays_icon'>
                            <FiLoader size={25} color="#0463ca" />
                            </div>
                            <div className='dashboard_body_header_displays_text'>
                            <h1>Reload</h1>
                            </div>
                        </div>
                    }
                </div>

                <div className='patient_details_ labdash' style={isMobileDevice ? {width:'100%'} : {}}>
                    <div className='patient_details_input_field1' style={isMobileDevice ? {width:'100%'} : {}}>
                        <h4>PATIENTS IN QUEUE</h4>
                        
                        { search?.length > 0 ?
                            search?.map((srch, i)=>{
                            return(
                                <NurseCard key={i} item={srch} setcurrentIndex={setcurrentIndex} handleSearch={handleSearch} getsearch={getsearch} currentIndex={currentIndex} />
                            )})
                            :null
                        }

                        {
                            getsearch === '' ?
                                info?.getPatientDetails?.length > 0 ?
                                    sorted?.map((item, i)=>{ 
                                    return(
                                    <NurseCard key={i} item={item} setcurrentIndex={setcurrentIndex} handleSearch={handleSearch} getsearch={getsearch} currentIndex={currentIndex} />
                                    )})
                                : null
                            : null
                        } 
                        
                    </div>
                    
                    {
                        !isMobileDevice &&
                        <div className='patient_details_input_field1'  >
                            <h4>NOTIFICATION</h4>    
                            <div className='notification_bar'>
                                {
                                    info?.getNotification?.length > 0 ?
                                    [ ...info?.getNotification || []].sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()

                                            let hours = date.getHours()
                                            const minutes = date.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"
    
                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                                            const getpatientName = info?.getPatientDetails?.find((nm)=> nm?._id === item?.uid)

                                        return (
                                        <div key={i} style={i <= 1 ? {color:'goldenrod'} : {}} className='recentpatientdashcard notification_cards'>
                                            <div className='recentpatientdashcard_desc'>
                                                <h4>{item?.type}</h4>
                                                <p><strong style={{fontSize:'18px'}}>( {getpatientName?.name} )</strong> {item?.message} </p>
                                            </div>

                                            <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                                                <div className='Patientqueuecard_button'>
                                                    <MdNotifications size={22} style={i <= 1 ? {color:'goldenrod'} : {color:'#0463ca'}} />
                                                </div>
                                                <p>{timeString}, {`${day}-${month}-${year}`}</p>
                                            </div>

                                        </div>
                                        )})
                                    : null
                                }
                            </div>

                            <h4>TASKS</h4>                        
                            <div className='task_bar' >
                                {
                                    info?.task?.length > 0 ?
                                        info?.task?.map((item, i)=>{                   
                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()

                                            let hours = date.getHours()
                                            const minutes = date.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                                            return(
                                        <div key={i} className='recentpatientdashcard'>
                                            <div className='recentpatientdashcard_desc'>
                                                <h4>{item.title}</h4>
                                                <p>{timeString}, {`${day}-${month}-${year}`}</p>
                                            </div>

                                            <div className='Patientqueuecard_button'>
                                                {
                                                    item?.status === 'completed' ?
                                                <button className='add_new_patient_container_btns2' style={{backgroundColor:'#c3c3c3'}} disabled>COMPLETED</button>
                                                :
                                                <button className='add_new_patient_container_btns2' onClick={()=>handleUpdateTask(item?._id)} >DONE</button>
                                                }
                                            </div>
                                        </div>
                                        )})
                                    : null
                                }
                            </div>

                        </div>
                    }
                </div> 
            </div>
        }

        {
            currentIndex === 1 &&
            <PatientDetails currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }

        { 
            currentIndex === 2 &&
            <EditPatientTests currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }
 
        {
            currentIndex === 3 &&
            <DispanseUtils currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }

        {
            currentIndex === 4 &&
            <LabResult currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }

        {
            currentIndex === 5 &&
            <Medications currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }

        {
            currentIndex === 6 &&
            <Prescriptions currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }

        {
            currentIndex === 7 &&
            <UrineOutput currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }

        {
            currentIndex === 8 &&
            <TransactionHistory currentIndex={currentIndex} setcurrentIndex={setcurrentIndex} handleBack={handleBack}/>
        }
        
    </div>
  )
}

export default Dashboard