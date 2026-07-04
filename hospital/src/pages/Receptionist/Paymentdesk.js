import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice'
import DisApproved from './DisApproved';
import ChurchBills from './ChurchBills';
import PaytientBills from './PatientBills';
import { FaSearch } from 'react-icons/fa';
import Debtors from './Debtors';
import PaymentCard1 from './PaymentCard1';
import PaymentCard3 from './PaymentCard3';
import PaymentCard2 from './PaymentCard2';
import { FiLoader } from 'react-icons/fi';

//axios.defaults.withCredentials = true

function Paymentdesk() {
    const ip = useSelector(selectip)

  const [id, setid] = useState('')

  const [patients, setpatients] = useState([])
  const [staffs, setstaffs] = useState([])
  const [bills, setbills] = useState([])
  const [reload, setreload] = useState(0)
  const [getuid, setgetuid] = useState('')
  const [getdiscount, setgetdiscount] = useState('')
  const [getstaffs, setgetstaffs] = useState('')

  const [checkOut, setcheckOut] = useState([])

  const handleBills =async(id)=>{
    setgetuid(id)
    try {
      await axios.post(`http://${ip?.ip }:7700/getbills`, { uid: id }).then((res)=>{
        // console.log(res);
        if(res.data.status === 'success'){
          setcheckOut(res.data.getpatientBills)
          setgetstaffs(res.data.getstaffs)
          setid(id)
        }
      })
    } catch (error) {
      //console.log(error);
    }
  }
   
  
  useEffect(()=>{
    const controller = new AbortController()
    const func =async()=>{
      try {
          await axios.post(`http://${ip?.ip}:7700/getPatientOnBill`, {signal: controller.signal}).then((res)=>{
            // console.log(res);
            
            if(res.data.status === 'success'){
              setpatients(res.data.getpatients)
              setstaffs(res.data.getstaffs)
              setbills(res.data.getbills)
              setreload(0)
              if(id){
                handleBills(id)
              } 
            }
          })
      } catch (error) {
        //console.log(error);
      }
    }
    func()
    return ()=> controller.abort()
  },[id, reload, ip])

  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  // const checkLab = checkOut?.find((itm)=>itm.type.includes('lab'))
  // const checkScan = checkOut?.find((itm)=>itm.type.includes('scan'))
  // const check = checkOut?.find((itm)=> itm.type !== 'scan' && itm.type !== 'lab' )


  
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    let total = 0;

    checkOut.forEach(entry => {
        try {
        const parsed = JSON.parse(entry.services);

        // Case 1: Single object (e.g. scan)
        if (!Array.isArray(parsed) && parsed?.price) {
            total += parsed.price;

        // Case 2: Array of lab services
        } else if (Array.isArray(parsed)) {
            parsed.forEach(service => {
              if (service.price) {
                  total += service.price;
              }
            });

        // Case 3: Pharmacy with .items array
        } else if (parsed?.items && Array.isArray(parsed.items)) {
          parsed.items.forEach(item => {
            if (item.totalPrice) {
                total += item.totalPrice;
            }else{
              total += item.price * item.quantity;
            }
          });
        } 

        } catch (e) {
        console.warn(`Failed to parse services for ID ${entry._id}`);
        }
    });


    setTotalPrice(total);
  }, [checkOut]);
      
  const totalFormatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
  })


  const [dept, setdept] = useState('')

  
    const format = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })

    const [getPatientName, setGetPatientName] = useState('')
    const [getPatientuid, setGetPatientuid] = useState('')

    const handleChurchBill =async()=>{
      try { 
        await axios.post(`http://${ip?.ip}:7700/addChurchBill`, {
          amount: totalPrice, 
          patient: getPatientName,
          uid: getPatientuid,
          staff : getid?._id
        }).then((res)=>{
          // console.log(res)
          if(res.data.status === 'success'){
            handleBills(getPatientuid)
            setreload(reload + 1)
            toast.success('PATIENT BILL DISAPPROVED')
          }
        })
      } catch (error) {
        console.log(error);
        
      }
    }

    const [count, setcount] = useState(0)  
    
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

    const remainingBill = dept - totalPrice

  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body'>
          <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
              <button style={count !== 0 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(0)}>PAYMENT DESK</button>
              <button style={count !== 3 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(3)}>PATIENTS BILLS</button>
              <button style={count !== 1 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(1)}>DISAPPROVED BILLS</button>
              <button style={count !== 2 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(2)}>CHURCH BILLS</button>
              <button style={count !== 4 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(4)}>DEBTORS BILLS</button>
          </div>

          <div className='dashboard_body_header_displays' style={{cursor:'pointer', position:'absolute', top:'20px', right:'50px'}} onClick={()=>window.location.reload()} >
            <div className='dashboard_body_header_displays_icon'>
              <FiLoader size={25} color="#0463ca" />
            </div>
            <div className='dashboard_body_header_displays_text'>
              <h1>Reload</h1>
            </div>
          </div>

          {
            count === 0 &&
            <div className='payment_desk' >
              <h3>PAYMENT DESK</h3>

              <div className='payment_desk_cart_fields' >
                <h4>PATIENTS ON BILL</h4>
                <div style={{margin:'20px 0'}} className='dashboard_body_header_search'>
                    <FaSearch/>
                    <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                </div>
                {
                  search?.length > 0 ?
                    search?.map((item, i)=>{
                      const getService = bills?.length > 0 ?  bills?.find((bil)=>bil?.uid === item?._id) : []
                      const getStaff = staffs?.length > 0 ? staffs?.find((stf)=>stf?._id === getService?.staffID) : []

                        return(
                        <div key={i} style={getuid === item?._id ? {backgroundColor:'#8c8c8c8c'} : {}} className='payment_desk_cart_fields_slides'>
                          <div>
                            <h4>{item?.name} ({item?.hop})</h4>
                            <p>Bills sent from {getStaff?.title}</p>
                          </div>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <button 
                              onClick={() => {
                                handleBills(item?._id);
                                setdept(item?.deposit);
                                setGetPatientName(item?.name);
                                setGetPatientuid(item?._id);
                                setgetdiscount(item?.discount)
                              }}
                              style={{backgroundColor:'#0463ca'}} 
                              >View Bills</button>
                          </div>
                        </div>
                    )}) 
                  :
                  patients?.length > 0 ?
                    patients?.map((item, i)=>{
                      const getService = bills?.length > 0 ?  bills?.find((bil)=>bil?.uid === item?._id) : []
                      const getStaff = staffs?.length > 0 ? staffs?.find((stf)=>stf?._id === getService?.staffID) : []

                      return(
                        <div key={i} style={getuid === item?._id ? {backgroundColor:'#8c8c8c8c'} : {}} className='payment_desk_cart_fields_slides'>
                          <div>
                            <h4>{item?.name} ({item?.hop})</h4>
                            <p>Bills sent from {getStaff?.title}</p>
                          </div>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <button 
                              onClick={() => {
                                handleBills(item?._id);
                                setdept(item?.deposit);
                                setGetPatientName(item?.name);
                                setGetPatientuid(item?._id);
                                setgetdiscount(item?.discount)
                              }}
                              style={{backgroundColor:'#0463ca'}} 
                              >View Bills</button>
                          </div>
                        </div>
                      )
                    })
                  : null
                }
              </div>
              
              <div className='payment_desk_cart_fields' >
                {
                  checkOut?.length > 0 &&
                    <div className='deposit_' >
                      <div>
                        <h3 style={{margin:'15px 0', display:'flex', alignItems:'center'}} >Actual Bill {totalFormatted.format(totalPrice)} 
                          <button style={{padding:'10px', margin:'0 5px'}} onClick={handleChurchBill}>CHURCH BILL</button>
                        </h3>
                        {
                          dept && remainingBill < 0 ?
                          <h3 style={{margin:'15px 0', color:'orange', display:'flex', alignItems:'center'}} >Total Bill left {format.format(dept - totalPrice)}</h3>
                          : null
                        }
                        {
                          dept && remainingBill > 0 &&
                          <h3 style={{margin:'15px 0', color:'orange', display:'flex', alignItems:'center'}} >Total Refund Bill {format.format(remainingBill)}</h3>
                        }
                      </div>
                      {
                        dept &&
                        <div>
                          <h2 style={{margin:'0px 20px'}} >Deposit Made {format.format(dept)}</h2>
                        </div>
                      }
                      {
                        getdiscount &&
                          <div>
                            <h2 style={{margin:'0px 20px'}} >DISCOUNT {format.format(getdiscount)}</h2>
                            <h1 style={{color:'green', fontSize:'25px', margin:'0px 20px'}}>Total Bill {totalFormatted.format(totalPrice + getdiscount)} </h1>
                          </div>
                      }
                    </div> 
                }
                {/* {
                  check &&
                  <h4>BILLS FROM DOCTOR</h4>
                } */}
                {
                  checkOut?.length > 0 ?
                    checkOut?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>(
                     item?.type !== 'lab' && item?.type !== 'scan' ?
                        <PaymentCard3 key={i} item={item} getstaffs={getstaffs} handleBills={handleBills} setreload={setreload} reload={reload} />
                      : item.type.includes('lab') ?
                        <PaymentCard2 key={i} item={item} getstaffs={getstaffs} handleBills={handleBills} setreload={setreload} reload={reload} />
                      : item.type.includes('scan') ?
                        <PaymentCard1 key={i} item={item} getstaffs={getstaffs} handleBills={handleBills} setreload={setreload} reload={reload} />
                      : null
                    ))
                  : null
                }

              </div> 
            </div>
          }

          {
            count === 1 &&
            <DisApproved/>
          }

          {
            count === 2 &&
            <ChurchBills/>
          }

          {
            count === 3 &&
            <PaytientBills/>
          }

          {
            count === 4 &&
            <Debtors/>
          }
        </div>
    </div>
  )
}

export default Paymentdesk;
