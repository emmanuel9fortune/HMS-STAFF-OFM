import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'
import TestDisplay from '../../components/TestDisplay'
import ScanDisplay from '../../components/ScanDisplay'
import { selectfid } from '../../features/fidSlice'

function LabResult({ handleBack, setcurrentIndex, currentIndex }) {
    const ip = useSelector(selectip)

  const [labresults, setLabResults] = useState([])
  const [scan, setScan] = useState([])
  const [staff, setStaff] = useState([])
  const [patient, setpatient] = useState({})

  const id = useSelector(selectid)
    const fid = useSelector(selectfid);
    const uid = fid?.id || id?.id;

    useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const res = await axios.post(`http://${ip?.ip }:7700/viewScanLab`, { uid: uid, signal: controller.signal })
        console.log(res);
        
        if (res.data.status === 'success') {
          setLabResults(res.data.getlabs || [])
          setScan(res.data.getscan || []) 
          setStaff(res.data.staffs || [])
          setpatient(res.data.patient || [])
        }
      } catch (err) {
        console.error('Error fetching scan/lab data:', err)
      }
    }

    if (uid) {
      fetchData()
    }
    return ()=> controller.abort()
  }, [uid, ip])

  // Combine results uniquely
  const combineObj = [...new Set([...labresults, ...scan])]
  
  const [imgs, setimgs] = useState('')
  const isMobileDevice = window.innerWidth <= 768   

  return (
    <div className='dashboard_body'>
        <div className='back_btn_' onClick={handleBack}>
          <FaChevronLeft />
          <h4>BACK</h4>
        </div>
        <div className='dashboard_body_patient_details_btns' style={isMobileDevice ? {width:'100%', padding:'5px', flexWrap:'nowrap', display:'flex', flexDirection:'row'} : {}}>
            <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
            <button onClick={()=>setcurrentIndex(2)}>PATIENT VITALS</button> 
            <button onClick={()=>setcurrentIndex(3)}>UTILITIES | CONSUMABLES</button>
            <button className={currentIndex === 4 && 'dashboard_body_patient_details_btns_'} >LAB RESULTS | SCAN</button>
            <button onClick={()=>setcurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button>
            <button onClick={()=>setcurrentIndex(7)}>URINE CHART</button>
                        <button onClick={()=>setcurrentIndex(8)}>PATIENT RECENT BILLS</button>
        </div>

      <div className='lab_result_container'>
        {combineObj.length > 0 ? 
          combineObj.map((obj, i) => {
            
            const view = null
 
            return (
             <div key={i} className='lab_result_container_l'>
                {
                  obj?.scan?.length > 0 ?
                    obj?.scan?.map((item, i)=>{
                      
                        const photo =[
                          {img: item?.photo1},
                          {img: item?.photo2},
                          {img: item?.photo3},
                          {img: item?.photo4},
                          {img: item?.photo5},
                          {img: item?.photo6},
                        ]
                      return(
                        <ScanDisplay setimgs={setimgs} key={i} patient={patient} photo={photo} item={item} id={i} obj={obj?.scan} view={view} />
                      )
                    })
                  :
                  obj?.lab?.map((res, i)=>(
                    <TestDisplay key={i} patient={patient} res={res} obj={obj?.lab} id={i} view={view} />
                  ))
                }
              </div>
            )
          })
        : (
          <div className='add_new_patient_container make_request'>
            <h2>NO LAB RESULTS OR SCAN FOUND</h2>
          </div>
        )}
      </div>
      
    </div>
  )
}

export default LabResult
