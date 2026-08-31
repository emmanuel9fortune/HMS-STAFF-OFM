import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import Searchpatientresulttab from '../../components/Searchpatientresulttab';
import axios from 'axios';
import PatientDetails from '../doctor/PatientDetails';
import AdminBar from '../../components/AdminBar';
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'

function Searchpatient() {
    //axios.defaults.withCredentials = true
        const ip = useSelector(selectip)
    const [currentIndex, setcurrentIndex] = useState(0)

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

    const admin = true

  return (
    <div className='dashboard_container'>
        <AdminBar/>

        {
            currentIndex === 0 &&
            <div className='dashboard_body' >
                <div className='dashboard_body_header' >
                    <div className='dashboard_body_header_search'>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                    </div>
                </div>

                <h3>SEARCH RESULTS</h3>
                <div>
                    {
                        search?.length > 0 ?
                            search?.map((srch, i)=>(
                                <Searchpatientresulttab admin={true} key={i} srch={srch} setview={setcurrentIndex} />
                            ))
                        : null
                    }
                </div>
            </div>
        }

        
        {
            currentIndex === 1 &&
            <PatientDetails admin={admin} handleBack={handleBack}/>
        }
    </div>
  )
}

export default Searchpatient;