import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice'
import { FaSearch } from 'react-icons/fa';

//axios.defaults.withCredentials = true

function Debtors() {
  const ip = useSelector(selectip)

  const id = useSelector(selectid)

  const [patients, setpatients] = useState([])
  const [staffs, setstaffs] = useState([])
  const [bills, setbills] = useState([])
  const [reload, setreload] = useState(0)
  const [mode, setmode] = useState('')
  const [mode2, setmode2] = useState('')
  const [mode3, setmode3] = useState('')
  const [getuid, setgetuid] = useState('')

  const [checkOut, setcheckOut] = useState([])

  const handleBills =async(id)=>{
    setgetuid(id)
    try {
      await axios.post(`http://${ip?.ip }:7700/getDebtors`, { uid: id }).then((res)=>{
        console.log(res);
        if(res.data.status === 'success'){
          setcheckOut(res.data.getpatientBills)
          setmode('')
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
          await axios.post(`http://${ip?.ip}:7700/getDebtorsPatient`, {signal: controller.signal}).then((res)=>{
            ////console.log(res);
            
            if(res.data.status === 'success'){
              setpatients(res.data.getpatients)
              setstaffs(res.data.getstaffs)
              setbills(res.data.getbills)
              setreload(0)
              if(id?.uid){
                handleBills(id?.uid)
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

  const finallMode = mode ? mode : mode2 ? mode2 : mode3 ? mode3 : null
  
  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  const handleCheckOut =async(uid, billId, total, type)=>{
    try {
      await axios.post(`http://${ip?.ip}:7700/patientCheckOut`, {
        uid,
        billId,
        mode: finallMode,
        total,
        type,
        staff : getid?._id
      }).then((res)=>{
        console.log(res)
        if(res.data.status === 'success'){
          handleBills(uid)
          setreload(reload + 1)
          toast.success('PATIENT CHECKOUT SUCCESSFUL')
          setmode('')
        }
      })
    } catch (error) {
      //console.log(error);
    }
  }

  const checkLab = checkOut?.find((itm)=>itm.type.includes('lab'))
  const checkScan = checkOut?.find((itm)=>itm.type.includes('scan'))
  const check = checkOut?.find((itm)=> itm.type !== 'scan' && itm.type !== 'lab' )


  
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
              total += item.price;
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
  }).format(totalPrice);

  const [deposit, setdeposit] = useState('')
  const [dep, setdep] = useState(false)
  const [deposit1, setdeposit1] = useState('')
  const [deposit2, setdeposit2] = useState('')

  const handleDeposit =async(id, uid, deps)=>{
    try {
      await axios.post(`http://${ip?.ip }:7700/addDeposit`, {id, deposit, mode, deps}).then((res)=>{        
        console.log(res)
        if(res.data.status === 'success'){
          setreload(reload + 1)
          toast.success('DEPOSIT ADDED')
          handleBills(uid)
          setdeposit('')
          setdep(false)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeposit1 =async(id, uid, deps)=>{
    try {
      await axios.post(`http://${ip?.ip }:7700/addDeposit`, {id, deposit1, mode: mode2, deps}).then((res)=>{    
        console.log(res)    
        if(res.data.status === 'success'){
          setreload(reload + 1)
          toast.success('DEPOSIT ADDED')
          handleBills(uid)
          setdeposit1('')
          setdep(false)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeposit2 =async(id, uid, deps)=>{
    try {
      await axios.post(`http://${ip?.ip }:7700/addDeposit`, {id, deposit2, mode: mode3, deps}).then((res)=>{     
        console.log(res)   
        if(res.data.status === 'success'){
          setreload(reload + 1)
          toast.success('DEPOSIT ADDED')
          handleBills(uid)
          setdeposit2('')
          setdep(false)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

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
          console.log(res)
          if(res.data.status === 'success'){
            handleBills(getPatientuid)
            setreload(reload + 1)
            toast.success('PATIENT BILL ADD TO CHURCH BILL')
            setmode('')
          }
        })
      } catch (error) {
        console.log(error);
        
      }
    }

    const handleDeleteCard=async(tid)=>{
      try {
        await axios.post(`http://${ip?.ip}:7700/DeleteBill`, {id: tid}).then((res)=>{
          if(res.data.status === 'success'){
            handleBills(id?.uid)
            setreload(reload + 1)
            toast.success('PATIENT BILL DELETED')
            setmode('')
          }
        })
      } catch (error) {
        console.log(error);
        
      }
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

    const handleDisapprove =async(uid, billId, total, type)=>{
      try {
        await axios.post(`http://${ip?.ip}:7700/patientBillDisapprove`, {
          uid,
          billId,
          mode: finallMode,
          total, 
          type,
          staff : getid?._id
        }).then((res)=>{
          console.log(res)
          if(res.data.status === 'success'){
            handleBills(uid)
            setreload(reload + 1)
            toast.success('PATIENT BILL DISAPPROVED')
            setmode('')
          }
        })
      } catch (error) {
        //console.log(error);
      }
    }

    const handlePending =async(uid, billId, total, type)=>{
      try {
        await axios.post(`http://${ip?.ip}:7700/pendingBills`, {
          uid,
          billId,
          mode: finallMode,
          total, 
          type,
          staff : getid?._id
        }).then((res)=>{
          console.log(res)
          if(res.data.status === 'success'){
            handleBills(uid)
            setreload(reload + 1)
            toast.success('PATIENT BILL SET TO PENDING')
            setmode('')
          }
        })
      } catch (error) {
        //console.log(error);
      }
    }
    

  return (
    <div className='payment_desk' >
    <h3>DISAPPROVED BILLS</h3>

    <div className='payment_desk_cart_fields' >
        <h4>PATIENTS </h4>
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
                              }}
                              style={{backgroundColor:'#0463ca'}} 
                              >View Bills</button>
                          </div>
                        </div>
                    )}) 
                  :
        patients?.length > 0 ?
            patients?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
            const getService = bills?.length > 0 ?  bills?.find((bil)=>bil?.uid === item?._id) : []
            const getStaff = staffs?.length > 0 ? staffs?.find((stf)=>stf?._id === getService?.staffID) : []

            return(
                <div key={i} className='payment_desk_cart_fields_slides'>
                <div>
                    <h4>{item?.name}</h4>
                    <p>Bills sent from {getStaff?.title}</p>
                </div>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <button onClick={()=>[handleBills(item?._id), setdept(item?.deposit), setGetPatientName(item?.name), setGetPatientuid(item?._id)]} style={{backgroundColor:'#0463ca'}} >View Bills</button>
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
            <h1 style={{margin:'15px 0', color:'green', display:'flex', alignItems:'center'}} >Total Bill {totalFormatted} 
            <button style={{padding:'10px', margin:'0 5px'}} onClick={handleChurchBill}>CHURCH BILL</button>
            </h1>
            {
                dept &&
                <h2 style={{margin:'0px 20px'}}  >Deposit Left {format.format(dept)}</h2>
            }
            </div> 
        }
        {
        check &&
        <h4>BILLS FROM DOCTOR</h4>
        }
        {
        checkOut?.length > 0 ?
            checkOut?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
            const getBill = JSON.parse(item?.services) 

            const formatted = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(getBill?.totalPrice);
            const formatted2 = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(getBill?.actualPrice);
            const formatted3 = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(getBill?.totalPrice - getBill?.actualPrice);


                return(
                <div key={i}>
                    { 
                    item?.type !== 'lab' &&
                        item?.type !== 'scan' &&
                        <div className='payment_desk_checkout' >
                        <button onClick={()=> handleDeleteCard(item?._id)} style={{backgroundColor:'red', padding:'10px 20px', color:'white'}} >DELETE PAYMENT CARD</button>
                        {
                            getBill?.items?.length > 0 ?
                                getBill?.items?.map((item, i)=>{
                                
                                const formatted = new Intl.NumberFormat('en-NG', {
                                    style: 'currency',
                                    currency: 'NGN',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(item?.price);
                                
                                return(
                                    <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                    <div style={{width: '70%'}} >
                                        <h4 >{item?.name || item?.drugs}</h4>
                                        <p>Sold For :</p>
                                    </div>
                                    
                                    <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                        <h4>{item?.quantity}</h4>
                                        <h4>{formatted}</h4>
                                    </div>
                                    </div>
                                )})
                            : null
                        }
                    
                        {
                            getBill?.actualPrice &&
                            <div className='cart_checkout_price' >
                            <h4 style={{margin:'7px 0'}}>ACTUAL PRICE</h4>
                            <h4 style={{margin:'7px 0'}}>{ formatted2}</h4>
                            </div>
                        }
                        {
                            getBill?.actualPrice &&
                            <div className='cart_checkout_price' >
                            <h4 style={{margin:'7px 0'}}>PROFIT</h4>
                            <h4 style={{margin:'7px 0'}}>{formatted3}</h4>
                            </div>
                        }
                        
                        <div className='cart_checkout_price' >
                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                            <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                        </div>
                        
                        <div className='patient_details_input_field1_' >
                            <h4>CHOOSE METHOD</h4>
                            <select value={mode} onChange={(e)=>[setmode(e.target.value), setmode2(''), setmode3('')]} >
                                <option  value=''>-- SELECT PAYMENT METHOD ---</option>
                                <option value='cash' >-- CASH ---</option>
                                <option value='pos'>-- POS ---</option>
                                <option value='transfer'>-- TRANSFER ---</option>
                            </select>
                        </div>  

                        {
                            getBill ?
                            mode ?
                            dep && deposit ?
                            deposit > getBill?.totalPrice && !item?.initialDeposit ?
                            <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >DEPOSIT</button>
                            :
                            deposit > getBill?.totalPrice - item?.initialDeposit ?
                            <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >DEPOSIT</button>
                            :
                            <button onClick={()=>handleDeposit(item?._id, item?.uid, item?.deposit)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >RECORD DEPOSIT</button>
                            :
                            <button onClick={()=>handleCheckOut(item?.uid, item?._id, getBill?.totalPrice, item?.type)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                            :
                            <button onClick={()=> toast.error('ENTER PAYMENT METHOD')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >CHECK OUT NOW</button>
                            :
                            null
                        }

                        <button onClick={()=>handleDisapprove(item?.uid, item?._id, getBill?.totalPrice, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'red'}} className='custome_table_btn2' >DISAPPROVE BILL</button>

                        <button onClick={()=>handlePending(item?.uid, item?._id, getBill?.totalPrice, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'purple'}} className='custome_table_btn2' >SET PENDING BILL</button>

                        </div>
                    }
                </div>
                )                    
            })
        : null
        }

        {
        checkLab &&
        <h4>BILLS FROM LAB</h4>
        }
        {
        checkOut?.length > 0 ?
            checkOut?.filter((itm)=>itm.type.includes('lab')).sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
            const getBill = JSON.parse(item?.services) 
            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

            const formatted5 = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(getTotal);

                return(
                <div key={i} className='payment_desk_checkout'>
                    <button onClick={()=> handleDeleteCard(item?._id)} style={{backgroundColor:'red', padding:'10px 20px', color:'white'}} >DELETE PAYMENT CARD</button>
                    {
                    getBill?.map((bil)=>{

                    const formatted6 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                        }).format(bil?.price);

                        return(
                        <div key={i} >
                            <div  style={{margin:'5px 0'}} className='cart_checkout_price' >
                                
                                <div style={{width: '70%'}} >
                                <p>Test Type : {bil?.testname}</p>
                                </div>
                                
                                <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                <h4>{formatted6}</h4>
                                </div>
                            </div>
                        
                            
                        </div>
                    )})
                    }

                    <div className='cart_checkout_price' >
                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                            <h3 style={{margin:'7px 0'}}>{formatted5}</h3>
                            </div>
                            

                        <div className='patient_details_input_field1_' >
                            <h4>CHOOSE METHOD</h4>
                            <select value={mode2} onChange={(e)=>[setmode2(e.target.value), setmode(''), setmode3('')]} >
                            <option value=''>-- SELECT PAYMENT MODE ---</option>
                            <option value='cash' >-- CASH ---</option>
                            <option value='pos'>-- POS ---</option>
                            <option value='transfer'>-- TRANSFER ---</option>
                            </select>
                        </div>

                    {
                    getBill ?
                    mode2 ?
                    dep && deposit1 ?
                            deposit > getTotal && !item?.initialDeposit ?
                            <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >DEPOSIT</button>
                            :
                            deposit > getBill?.totalPrice - item?.initialDeposit ?
                            <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >DEPOSIT</button>
                            :
                    <button onClick={()=>handleDeposit1(item?._id, item?.uid, item?.deposit)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >RECORD DEPOSIT</button>
                    :
                    <button onClick={()=>handleCheckOut(item?.uid, item?._id, getTotal, item?.type)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                    :
                    <button onClick={()=> toast.error('ENTER PAYMENT MODE')} style={{margin: '20px 0', width:'100%', opacity:.3}} className='custome_table_btn2' >CHECK OUT NOW</button>
                    :
                    null
                    }
                    <button onClick={()=>handleDisapprove(item?.uid, item?._id, getTotal, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'red'}} className='custome_table_btn2' >DISAPPROVE BILL</button>
                    
                    <button onClick={()=>handlePending(item?.uid, item?._id, getTotal, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'purple'}} className='custome_table_btn2' >SET PENDING BILL</button>
                    
                </div>
                )                    
            })
        : null
        }

        {
        checkScan &&
        <h4>BILLS FROM SCAN</h4>
        }
        {
        checkOut?.length > 0 ?
            checkOut?.filter((itm)=>itm.type.includes('scan')).sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
            const getBill = JSON.parse(item?.services) 
            const getTotal = getBill?.length > 0 ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0
            
            const formatted5 = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(getTotal);

                return(
                <div key={i} className='payment_desk_checkout'>
                        <button onClick={()=> handleDeleteCard(item?._id)} style={{backgroundColor:'red', padding:'10px 20px', color:'white'}} >DELETE PAYMENT CARD</button>
                    {
                        getBill?.length > 0 ?
                            getBill?.map((items, i)=>{
                            const formatted = new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(items?.price);
                            
                            return(
                                <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                <div style={{width: '70%'}} >
                                    <p>Scan Type :</p>
                                    <h4 >{items?.testname}</h4>
                                </div>
                                
                                <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                    <h4>{formatted}</h4>
                                </div>
                                </div>
                            )})
                        : null
                    }
                
                    <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted5}</h3>
                    </div>                 

                    <div className='patient_details_input_field1_' >
                        <h4>CHOOSE METHOD</h4>
                    <select value={mode3} onChange={(e)=>[setmode3(e.target.value), setmode(''), setmode2('')]} >
                        <option value=''>-- SELECT PAYMENT MODE ---</option>
                        <option value='cash' >-- CASH ---</option>
                        <option value='pos'>-- POS ---</option>
                        <option value='transfer'>-- TRANSFER ---</option>
                    </select>     
                    </div>    
                    
                    {
                    getBill ?
                    mode3 ?
                    dep && deposit2 ?
                        deposit > getBill?.totalPrice && !item?.initialDeposit ?
                        <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >DEPOSIT</button>
                        :
                    deposit > getBill?.totalPrice - item?.initialDeposit ?
                    <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >CHECK OUT NOW</button>
                    :
                    <button onClick={()=>handleDeposit2(item?._id, item?.uid, item?.deposit)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >RECORD DEPOSIT</button>
                    :
                    <button onClick={()=>handleCheckOut(item?.uid, item?._id, getBill?.price , item?.type)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                    :
                    <button onClick={()=> toast.error('ENTER PAYMENT MODE')} style={{margin: '20px 0', width:'100%', opacity:.3}} className='custome_table_btn2' >CHECK OUT NOW</button>
                    :
                    null
                    }
                    
                    <button onClick={()=>handleDisapprove(item?.uid, item?._id, getBill?.price, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'red'}} className='custome_table_btn2' >DISAPPROVE BILL</button>
                    
                    <button onClick={()=>handlePending(item?.uid, item?._id, getBill?.price, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'purple'}} className='custome_table_btn2' >SET PENDING BILL</button>
                </div>
                )                    
            })
        : null
        }
    </div> 
    </div>
  )
}

export default Debtors;
