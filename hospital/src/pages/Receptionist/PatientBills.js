import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { FaSearch } from 'react-icons/fa';

//axios.defaults.withCredentials = true

function PaytientBills() {
    const ip = useSelector(selectip)

  const id = useSelector(selectid)

  const [patients, setpatients] = useState([])
  const [staffs, setstaffs] = useState([])
  const [bills, setbills] = useState([])
  const [reload, setreload] = useState(0)

  const [count, setcount] = useState(0)
  const [status, setstatus] = useState('PAID')

  const [checkOut, setcheckOut] = useState([])

  const handleBills =async(id)=>{ 
    try {
      await axios.post(`http://${ip?.ip }:7700/getpatientBills`, { uid: id }).then((res)=>{
        console.log(res);
        if(res.data.status === 'success'){
          setcheckOut(res.data.getpatientBills)
          setcount(0)
          setstatus('PAID')
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
          await axios.post(`http://${ip?.ip}:7700/getBillPatieants`, {signal: controller.signal}).then((res)=>{
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



  
  const [totals, setTotals] = useState({
    drugs: 0,
    consumables: 0,
    scan: 0,
    test: 0,
    });

   useEffect(() => {
  let drugs = 0;
  let consumables = 0;
  let scan = 0;
  let test = 0;

  checkOut
    .filter(entry => entry.status === status) // ✅ Only count current status
    .forEach(entry => {
      try {
        const parsed = JSON.parse(entry.services);

        // DRUGS (doctor type)
        if (entry.type === "doctor" || entry.type === "pharmacy" || entry.type === "consult") {
          parsed.items.forEach(item => {
            drugs += item.totalPrice || item.price * item?.quantity;
          });
        }

        // CONSUMABLES (nurse type)
        if (entry.type === "nurse" && parsed?.items) {
          parsed.items.forEach(item => {
            consumables += item.totalPrice || item.price ;
          });
        }

        // SCAN
        if (entry.type === "scan") {
          if (Array.isArray(parsed)) {
            parsed.forEach(scanItem => {
              scan += scanItem.price || 0;
            });
          } else if (parsed?.price) {
            scan += parsed.price;
          }
        }

        // TEST (lab)
        if (entry.type === "lab") {
          if (Array.isArray(parsed)) {
            parsed.forEach(testItem => {
              test += testItem.price || 0;
            });
          } else if (parsed?.price) {
            test += parsed.price;
          }
        }
      } catch (e) {
        console.warn("Parse error for entry:", entry._id, e);
      }
    });

  setTotals({ drugs, consumables, scan, test });
}, [checkOut, status]); // ✅ recalc when status changes


    const totalFormatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(
      count === 0 ? totals.drugs :
      count === 3 ? totals.consumables :
      count === 1 ? totals.scan :
      count === 2 ? totals.test : 0
    );

  const [dept, setdept] = useState('')

  
    const format = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })



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


  return (
        <>
            <div className='payment_desk' >
              <div className='payment_desk_cart_fields' >
                <div style={{margin:'20px 0'}} className='dashboard_body_header_search'>
                    <FaSearch/>
                    <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                </div>

                <h4>PATIENTS ON BILL</h4>
                {search?.length > 0 ?
                    search?.map((srch, i)=>{
                      const getService = bills?.length > 0 ?  bills?.find((bil)=>bil?.uid === srch?._id) : []
                      const getStaff = staffs?.length > 0 ? staffs?.find((stf)=>stf?._id === getService?.staffID) : []

                        return(
                        <div key={i} className='payment_desk_cart_fields_slides'>
                          <div>
                            <h4>{srch?.name} ({srch?.hop})</h4>
                            <p>View Patient Bills {getStaff?.title}</p>
                          </div>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <button onClick={()=>{handleBills(srch?._id); setdept(srch?.deposit)}} style={{backgroundColor:'#0463ca'}} >View Bills</button>
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
                            <h4>{item?.name} ({item?.hop})</h4>
                            <p>View Patient Bills {getStaff?.title}</p>
                          </div>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <button onClick={()=>{handleBills(item?._id); setdept(item?.deposit)}} style={{backgroundColor:'#0463ca'}} >View Bills</button>
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
                    <>
                        <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
                            <button style={count !== 0 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(0)}>DRUGS | CARDS | CONSULTATION</button>
                            <button style={count !== 3 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(3)}>CONSUMABLES | UTILS</button>
                            <button style={count !== 1 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(1)}>SCAN</button>
                            <button style={count !== 2 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(2)}>TEST</button>
                        </div>

                        <div style={{display:'flex', alignItems:'center'}}>
                          <div style={{width:'fit-content', borderRadius:'10px', border:'1px solid grey', padding:'5px', margin:'5px 10px'}} >
                              <button style={status !== 'PAID' ? {padding:'15px 10px', borderRadius:'10px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'10px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setstatus('PAID')}>PAID</button>
                              <button style={status !== 'PENDING' ? {padding:'15px 10px', borderRadius:'10px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'10px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setstatus('PENDING')}>PENDING</button>
                          </div>
                        </div>
                    </>
                }
                
                    
                {
                  checkOut?.length > 0 &&
                    <div className='deposit_' >
                      <h1 style={{margin:'15px 0', color:'green', display:'flex', alignItems:'center'}} >Total Bill {totalFormatted} 
                      </h1>
                      {
                        dept &&
                        <h2 style={{margin:'0px 20px'}} >Deposit Left {format.format(dept)}</h2>
                      }
                    </div> 
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

                    const date = new Date(Number(item?.timeStamp))
                    const day = date.getDate() 
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const date1 = new Date(Number(item?.timeStamp))

                    let hours = date1.getHours()
                    const minutes = date1.getMinutes()
                    const ampm = hours >= 12 ? "PM" : "AM"

                    hours = hours % 12
                    hours = hours ? hours : 12

                    const pad = (n) => n.toString().padStart(2, '0')

                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                    let total = 0

                    if (Array.isArray(getBill?.items) && getBill.items.length > 0) {
                          getBill.items.forEach((it) => {
                              if (it?.price && it?.quantity) {
                              total += Number(it.price) * Number(it.quantity);
                              }
                          });
                      }

                      
                      const formatted1 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(total);

                        return(
                            <>
                                {
                                    count === 0 && item?.status === status ?
                                    item?.type === 'doctor' || item?.type === 'cashier' || item?.type === 'consult' || item?.type === 'pharmacy' ?
                                      <div key={i}>
                                        { 
                                          item?.type !== 'lab' &&
                                              item?.type !== 'scan' &&
                                              <div className='payment_desk_checkout' >
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
                                                              <p>{item?.quantity} Sold For :</p>
                                                          </div>
                                                          
                                                          <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                                              <h4>{item?.quantity}</h4>
                                                              <h4>{formatted}</h4>
                                                          </div>
                                                          </div>
                                                      )})
                                                  : null
                                              }
                                          
                                              
                                              <div className='cart_checkout_price' >
                                                  <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                                  <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                                              </div>
                                              
                                              
                                              <div className='psyment_desk_history' style={{margin:'5px 0'}} >
                                                  <p>Date : </p>
                                                  <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                              </div>
                                              </div>
                                        }
                                      </div>
                                    : null
                                    : null
                                }

                                {
                                    count === 3 && item?.type === 'nurse' && item?.status === status &&
                                    <div key={i}>
                                    
                                        { 
                                        item?.type !== 'lab' &&
                                            item?.type !== 'scan' &&
                                            <div className='payment_desk_checkout' >
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
                                        
                                            
                                            <div className='cart_checkout_price' >
                                                <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                                <h3 style={{margin:'7px 0'}}>{formatted1}</h3>
                                            </div>
                                            
                                            <div className='psyment_desk_history' style={{margin:'5px 0'}} >
                                                <p>Date : </p>
                                                <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                            </div>
                                            </div>
                                        }
                                    </div>
                                }

                            </>
                        )                    
                    })
                  : null
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
                      const formatted4 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(item?.deposit);
                      const formatted7= new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(getBill?.totalPrice - item?.initialDeposit);
                      const formated6 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(item?.initialDeposit);

                    const date = new Date(Number(item?.timeStamp))
                    const day = date.getDate() 
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const date1 = new Date(Number(item?.timeStamp))

                    let hours = date1.getHours()
                    const minutes = date1.getMinutes()
                    const ampm = hours >= 12 ? "PM" : "AM"

                    hours = hours % 12
                    hours = hours ? hours : 12

                    const pad = (n) => n.toString().padStart(2, '0')

                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                        return(
                          <>
                            {
                                count === 2 && item?.status === status &&
                                <div key={i} className='payment_desk_checkout'>
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
                                            
                                            {
                                            item?.deposit &&
                                            <div className='cart_checkout_price' >
                                                <h4 style={{margin:'7px 0'}}>Recent Deposit</h4>
                                                <h4 style={{margin:'7px 0'}}>{item?.deposit ? formatted4 : 0}</h4>
                                            </div>
                                            }
                                            
                                        {
                                            item?.deposit &&
                                            <div style={{margin:'5px 0'}} className='cart_checkout_price' >
                                            <h4>Amount Left</h4>
                                            <h4>{formatted7}</h4>
                                            </div>
                                        }
                                        
                                        {
                                            item?.deposit &&
                                            <div className='cart_checkout_price' >
                                            <h4 style={{margin:'7px 0'}}>Recent Payment Method</h4>
                                            <h4 style={{margin:'7px 0'}}>{item?.mode}</h4>
                                            </div>
                                        }

                                        {
                                            item?.deposit &&
                                            <div className='cart_checkout_price' >
                                            <h3 style={{margin:'7px 0'}}>TOTAL DEPOSITS</h3>
                                            <h3 style={{margin:'7px 0'}}>{formated6}</h3>
                                            </div>
                                        }
                                    <div className='psyment_desk_history' >
                                        <p>Date : </p>
                                        <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                    </div>

                                </div>
                            }
                          </>
                        )                    
                    })
                  : null
                }

                {
                  checkOut?.length > 0 ?
                    checkOut?.filter((itm)=>itm.type.includes('scan')).sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                      const getBill = JSON.parse(item?.services) 
                      const getTotal = getBill?.length > 0 ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0
                      
                      const formatted4 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(item?.deposit);
                      const formatted7= new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(getBill?.totalPrice - item?.initialDeposit);
                      const formated6 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(item?.initialDeposit);
                      const formatted5 = new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                      }).format(getTotal);

                      
                    const date = new Date(Number(item?.timeStamp))
                    const day = date.getDate() 
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const date1 = new Date(Number(item?.timeStamp))

                    let hours = date1.getHours()
                    const minutes = date1.getMinutes()
                    const ampm = hours >= 12 ? "PM" : "AM"

                    hours = hours % 12
                    hours = hours ? hours : 12

                    const pad = (n) => n.toString().padStart(2, '0')

                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                        return(
                          <>
                            {
                                count === 1 && item?.status === status &&
                                <div key={i} className='payment_desk_checkout'>
                                    <div className='psyment_desk_history' >
                                        <p>Date : </p>
                                        <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                    </div>
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
                                    
                                    {
                                    item?.deposit &&
                                    <div className='cart_checkout_price' >
                                        <h4 style={{margin:'7px 0'}}>Recent Deposit</h4>
                                        <h4 style={{margin:'7px 0'}}>{item?.deposit ? formatted4 : 0}</h4>
                                    </div>
                                    }
                                    
                                    {
                                    item?.deposit &&
                                    <div style={{margin:'5px 0'}} className='cart_checkout_price' >
                                        <h4>Amount Left</h4>
                                        <h4>{formatted7}</h4>
                                    </div>
                                    }
                                            
                                    {
                                    item?.deposit &&
                                    <div className='cart_checkout_price' >
                                        <h4 style={{margin:'7px 0'}}>Recent Payment Method</h4>
                                        <h4 style={{margin:'7px 0'}}>{item?.mode}</h4>
                                    </div>
                                    }

                                    {
                                    item?.deposit &&
                                    <div className='cart_checkout_price' >
                                        <h3 style={{margin:'7px 0'}}>TOTAL DEPOSITS</h3>
                                        <h3 style={{margin:'7px 0'}}>{formated6}</h3>
                                    </div>
                                    }
                                    <div className='psyment_desk_history' >
                                        <p>Date : </p>
                                        <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                    </div>
                                </div>
                            }
                          </>
                        )                    
                    })
                  : null
                }
              </div> 
            </div>
        </>
  )
}

export default PaytientBills;
