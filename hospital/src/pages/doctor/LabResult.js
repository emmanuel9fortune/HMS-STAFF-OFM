import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaPlus, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectip } from '../../features/ipSlice'
import TestDisplay from '../../components/TestDisplay'
import ScanDisplay from '../../components/ScanDisplay'
import { setfids } from '../../features/fidSlice'
import { useParams } from 'react-router-dom'

function LabResult({ handleBack, setCurrentIndex, currenIndex }) {
    const ip = useSelector(selectip)

  const [labresults, setLabResults] = useState([])
  const [scan, setScan] = useState([])
  const [patient, setpatient] = useState({})

  const [req, setReq] = useState(false)

  const {id, fid} = useParams()

  const uid = id;

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const res = await axios.post(`http://${ip?.ip }:7700/viewScanLab`, { uid: uid, signal: controller.signal })
        // console.log(res);
        
        if (res.data.status === 'success') {
          setLabResults(res.data.getlabs || [])
          setScan(res.data.getscan || [])
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
  }, [uid, ip, id, fid])

  // Combine results uniquely
  const combineObj = [...new Set([...labresults, ...scan])]

  const staffID = sessionStorage.getItem('staffID')
  const parsedStaff = staffID ? JSON.parse(staffID) : null

  
  const [imgs, setimgs] = useState('')

  const [getsearch, setgetsearch] = useState('')
  const [type, settype] = useState('')
  const [search, setsearch] = useState([])
  const [searchArr, setsearchArr] = useState([])
  
  const handleSearch = async(e) => {
      e.preventDefault()
      const searchQuery = e.target.value;
      setgetsearch(searchQuery)
      if (searchQuery.length > 0) {
          try {
              const value = {     
                  search : searchQuery
              }

              const response = await axios.post(`http://${ip?.ip }:7700/searchRequest`, value);
              console.log(response);
              
              setsearch(response.data.utils) 
              
          } catch (err) {
              console.error('Error fetching search results', err);
          }
      } else {
          setsearch([]);
      }
  }
  
  
  const handleSubmit = async () => {
    if (searchArr?.length < 1) {
      toast.warning('Please enter a request.')
      return
    }

    const payload = {
      staffID: parsedStaff?._id,
      uid: fid || uid,
      requests: searchArr,
      type: type,
      oid: id
    }

    try {
      const res = await axios.post(`http://${ip?.ip}:7700/doctorRequest`, payload)
      // console.log(res);
      settype('')
      if (res.data.status === 'success') {
        setReq(false)
        setsearchArr([])
        settype('')
        toast.success('REQUEST SENT SUCCESSFULLY')
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to send request.')
    }
  }
  
  const Formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
  })

  
  const getTotal = searchArr?.reduce((sum, item)=> sum + item.price, 0)  
  const dispatch = useDispatch()

  const handleView =(id)=>{
      dispatch(
          setfids({
              id:''
          })
      )
      window.history.back()
  }

  return ( 
    <div className='dashboard_body' style={{width:'100%', margin:'100px 0 ', paddingBottom:'200px'}}>
      <div className='back_btn_' onClick={handleView}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>
      <div className='dashboard_body_patient_details_btns'>
        <button onClick={() => setCurrentIndex(0)}>PATIENT DETAILS</button>
        <button onClick={() => setCurrentIndex(1)}>VITALS</button>
        <button className={currenIndex === 2 ? 'dashboard_body_patient_details_btns_' : ''}>LAB RESULTS | SCAN</button>
        <button onClick={() => setCurrentIndex(3)}>PRESCRIPTION</button>
        <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
        <button onClick={()=>setCurrentIndex(4)}>TRANSACTION HISTORY</button>
        <button onClick={()=>setCurrentIndex(6)}>URINE CHART</button>
        <button onClick={()=>setCurrentIndex(7)}>UTILITIES | CONSUMABLES</button>
      </div>

      <div className='dashboard_body_header' style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between'}} >
        <div></div>

        {
          combineObj.length > 0 &&
          <div className='add_new_patient_container_btns' style={{width:'50%', justifyContent:'flex-end'}}>
            <button className='add_new_patient_container_btns2' onClick={() => setReq(true)}>
              MAKE YOUR REQUEST
            </button>
          </div>
        }
      </div>

      <div className='lab_result_container' style={{marginBottom:'100px', paddingBottom:'200px'}}>
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
                        <ScanDisplay setimgs={setimgs} key={i} patient={patient} photo={photo} item={item} id={i} obj={obj?.scan} view={view} setReq={setReq} />
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
            <div className='add_new_patient_container_btns'>
              <button className='add_new_patient_container_btns2' onClick={() => setReq(true)}>
                MAKE YOUR REQUEST
              </button>
            </div>
          </div>
        )}
      </div>

 
      {req && ( 
        <div className='popt_request' style={{zIndex:100000}}>
          <div className='over_lay_pop_up' onClick={() => setReq(false)}></div>
          <div style={{display:'flex', alignItems:'center'}} >
            <div className='pop_up_request_display'>
              <h2>REQUEST TEST | SCAN</h2>
              <div className='patient_details_input_field1_' style={{width:'90%'}}>
                <h4>SELECT REQUEST TYPE</h4>
                <select disabled={type && searchArr?.length > 0} value={type} onChange={(e)=>settype(e.target.value)} >
                  <option value={''} >CHOOSE REQUEST TYPE</option>
                  <option value={'test'} >TEST</option>
                  <option value={'scan'} >SCAN</option>
                </select>
              </div>

              {
                type &&
                <div className='patient_details_input_field1_' style={{width:'90%'}}>
                  <h4>SEARCH SERVICE</h4>
                  <input value={getsearch} onChange={handleSearch} style={{width:'100%'}} placeholder='Search for service' />
                </div>
              }


                <div style={{width:'90%', display:'flex', flexDirection:'column', flexWrap:'wrap', height:'270px', overflowY:'scroll', margin:'10px 0'}} >
                  {
                    search?.length > 0  &&
                    search?.map((res, i)=>{
                      const getObj = searchArr?.length > 0 ? searchArr?.find((ref)=> ref?.name === res?.name) : null
                      return (
                        <div key={i}  style={{width:'100%', display:'flex', justifyContent:'space-between', margin:'5px 0', alignItems:'center' }}>
                          {
                            type === res?.type &&
                            <div  style={{width:'100%', display:'flex', justifyContent:'space-between', margin:'5px 0', alignItems:'center' }} >
                              <div>
                                <p>{res?.name}</p>
                                <small>{Formatted.format(res?.price)}</small>
                              </div>
                              {
                                !getObj &&
                                <button onClick={()=> [setsearchArr((prev)=> [...prev, {testname: res?.name, price: res?.price}]), setgetsearch('')]} style={{padding:'5px 10px'}} >
                                  <FaPlus size={22} />
                                </button>
                              }
                            </div>
                          }
                        </div>
                      )})
                    }
                </div>
            </div>
            
            <div className='pop_up_request_display'>
              <div style={{width:'90%', display:'flex', flexDirection:'column', flexWrap:'wrap', height:'270px', overflowY:'scroll', margin:'10px 0'}}>
                {searchArr?.length > 0 &&
                  searchArr?.map((res, i)=>(
                    <div key={i}  style={{width:'100%', display:'flex', justifyContent:'space-between', margin:'5px 0', alignItems:'center'  }} >
                      <div>
                        <p>{res?.testname}</p>
                        <small>{Formatted.format(res?.price)}</small>
                      </div>
                      <button style={{padding:'5px 10px'}} onClick={()=> setsearchArr(() => searchArr?.filter((resf)=> resf?.testname !== res?.testname))} >
                        <FaTimes size={22} />
                      </button>
                    </div>
                  ))
                }
              </div>

              <div style={{width:'80%', display:'flex', justifyContent:'space-between', margin:'5px 0', alignItems:'center'  }} >
                <h3>Total</h3>
                <h3>{Formatted.format(getTotal)}</h3>
              </div>

              {
                searchArr?.length > 0 ?
                <button className='add_new_patient_container_btns2' onClick={handleSubmit}>
                  REQUEST SERVICE
                </button>
                :
                <button style={{opacity:'.4', cursor:'not-allowed'}} className='add_new_patient_container_btns2' disabled>
                  REQUEST SERVICE
                </button>
              }
            </div>
          </div>
        </div>
      )}
      <div style={{height:'700px', width:'100%'}}></div>
      <div style={{height:'700px', width:'100%'}}></div>
    </div>
  )
}

export default LabResult
