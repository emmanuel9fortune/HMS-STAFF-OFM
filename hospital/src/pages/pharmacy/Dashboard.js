import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { MdNotifications } from 'react-icons/md'
import DoctorRequest from './DoctorRequest'
import PharmacyBar from '../../components/PharmacyBar'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import { setids } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'
import NurseRequest from './NurseRequest'
import Alert from './Alert'
import { FiLoader } from 'react-icons/fi'

function Dashboard() {
    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

    const [currentIndex, setcurrentIndex] = useState(0)

    const dispatch = useDispatch()

    const handleView =(id)=>{
        setcurrentIndex(currentIndex + 1)
        dispatch(
            setids({
                id:id
            })
        )
    }
    const handleBack =()=>{
        setcurrentIndex(currentIndex - 1)
    }

    
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

    const handleSearch = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
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

    const timeStampMap = new Map(
        (info?.getnotifications || []).map(item => [
            item?.uid,
            Number(item?.timeStamp) || 0
        ])
    );
    
    const sorted = [...(info?.getPatientDetails || [])].sort((a, b) => {
        const timeA = timeStampMap.get(a?._id) || 0;
        const timeB = timeStampMap.get(b?._id) || 0;
        return timeB - timeA; // Latest first
    });

    const [count, setcount] = useState(0)
    const [batch, setbatch] = useState('')
    

  return (
    <div className='dashboard_container'>
        <PharmacyBar/>  
        
        {
            currentIndex === 0 &&
            <div className='dashboard_body' >
                <h1>Pharmacy Dashboard</h1>
                <div className='dashboard_body_header' >
                    <div className='dashboard_body_header_search'>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search for patients' />
                    </div>

                    <div className='dashboard_body_header_displays' style={{cursor:'pointer'}} onClick={()=>window.location.reload()} >
                        <div className='dashboard_body_header_displays_icon'>
                        <FiLoader size={25} color="#0463ca" />
                        </div>
                        <div className='dashboard_body_header_displays_text'>
                        <h1>Reload</h1>
                        </div>
                    </div>
                </div>

                <div className='patient_details_ labdash' >
                    <div className='patient_details_input_field1' >
                        <h4>PATIENTS IN QUEUE</h4>
                        
                        { search?.length > 0 ?
                            search?.map((srch, i)=>{
                                
                                return(
                                <div key={i} className='recentpatientdashcard'>
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>{srch?.name}</h4>
                                        <p>{srch?.center ? "Ante Natal Patient" : srch?.family || srch?.familyid ? 'Family Card' : "Regular Patient"}</p>
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <button onClick={()=>handleView(srch?._id)} >View</button>
                                    </div>
                                </div>
                            )})
                            :null
                        }

                        
                        {
                            getsearch === '' ?
                                info?.getPatientDetails?.length > 0 ?
                                    sorted?.map((item, i)=>{
                                            return(
                                            <div key={i} className='recentpatientdashcard'>
                                                <div className='recentpatientdashcard_desc'>
                                                    <h4>{item?.name}</h4>
                                                    <p>{item?.center ? "Ante Natal Patient" : item?.family || item?.familyid ? 'Family Card' : "Regular Patient"}</p>
                                                </div>

                                                <div className='Patientqueuecard_button'>
                                                    <button onClick={()=>handleView(item?._id)} >VIEW</button>
                                                </div>
                                            </div>
                                            )
                                        }
                                    )
                                : null
                            : null
                        }
                    </div>

                    
                    <div className='patient_details_input_field1' >
                        <h4>NOTIFICATION</h4>    
                        <div className='notification_bar'>
                            {
                                info?.getnotifications?.length > 0 ?
                                    [...info?.getnotifications || []]?.sort((a, b)=>b.timeStamp - a.timeStamp).map((item, i)=>{
                                        const getTime = item?.timeStamp

                                        const date = new Date(Number(getTime))
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
                                    <div key={i} style={i <= 1 ? {color:'goldenrod'} : {}} className='recentpatientdashcard'>
                                        <div className='recentpatientdashcard_desc'>
                                            <p>New {item?.type === 'New Request' ? 'Consumable Request' : 'Prescription'} Sent for <strong style={{fontSize:'18px'}}>( {getpatientName?.name} )</strong></p>
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
 
                        <h4>STOCK ALERT</h4>                        
                        <div className='task_bar'> 
                            
                            <div style={{width:'100%', display:'flex', alignItems:'center'}} >
                                <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
                                    <button style={count !== 0 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(0)}>DRUGS EXPIRING</button>
                                    <button style={count !== 1 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(1)}>OUT OF STOCK</button>
                                </div>
                                    
                                <div style={{margin:'0 20px'}}>
                                    <select value={batch} onChange={(e)=> setbatch(e.target.value)} style={{padding:'10px'}} >
                                        <option value=''>ALL BATCHES</option>
                                        {   info?.batch &&
                                            info?.batch?.map((item, i)=>(
                                                <option key={i} value={item} >{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {
                                info?.utils?.length > 0 || info?.utilsQty?.length > 0 ?
                                    count === 0 ? 
                                        Object.values(info?.utils)?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                            batch !== '' ?
                                            item?.batch === batch  ?
                                                <Alert key={i} item={item} count={count} batch={batch} />
                                            : null
                                            :<Alert key={i} item={item} count={count} batch={batch} />
                                        ))
                                    :
                                        Object.values(info?.utilsQty)?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                            batch !== '' ?
                                            item?.batch === batch  ?
                                                <Alert key={i} item={item} count={count} batch={batch} />
                                            : null
                                            :<Alert key={i} item={item} count={count} batch={batch} />
                                        ))
                                : null
                            }
                        </div>

                    </div>
                </div>
            </div>
        }

        {
            currentIndex === 1 &&
            <NurseRequest handleBack={handleBack} setcurrentIndex={setcurrentIndex} currentIndex={currentIndex} />
        }
        

        {
            currentIndex === 2 &&
            <DoctorRequest handleBack={handleBack} setcurrentIndex={setcurrentIndex} currentIndex={currentIndex} />
        }
        
    </div>
  )
}

export default Dashboard