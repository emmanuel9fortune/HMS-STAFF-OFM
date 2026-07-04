import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setids } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'
import { FiLoader } from 'react-icons/fi'
import Prescribe from './Prescribe'
import PharmacyBar from '../../components/PharmacyBar'

function Antenatal() {

    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

    const [currentIndex, setcurrentIndex] = useState(0)


    const dispatch = useDispatch()

    const handleView =(id)=>{
        setcurrentIndex(currentIndex + 1)
        dispatch(
            setids({
                id:id,
            })
        )
    }

    const handleBack =()=>{
        setcurrentIndex(0 )
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

                const response = await axios.post(`http://${ip?.ip }:7700/AntenatalSearch`, value);
                setsearch(response.data.patients) 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }



  return (
    <div className='dashboard_container'>
        <PharmacyBar/>
        
        {
            currentIndex === 0 &&
            <div className='dashboard_body' >
                <h1>Pharmacist Dashboard For Antenatal Patients</h1>
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

                    
                    { search?.length > 0 ?
                        search?.map((srch, i)=>{
                            if(!srch?.center) return null
                            return(
                            <div key={i} className='recentpatientdashcard'>
                                <div className='recentpatientdashcard_desc'>
                                    <h4>{srch?.name}</h4>
                                    <p>{srch?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
                                </div>

                                <div className='Patientqueuecard_button'>
                                            
                                    <button onClick={()=>handleView(srch?._id)} >PRESCRIBE</button>
                                </div>
                            </div>
                        )})
                        :null
                    }
                    
                </div>

        } 

        {
            currentIndex === 1 &&
            <Prescribe handleBack={handleBack}/>
        }

        
    </div>
  )
}

export default Antenatal