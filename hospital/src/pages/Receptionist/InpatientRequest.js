import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice'

function InpatientRequest() {

  const ip = useSelector(selectip)

  const id = useSelector(selectid)

  const [patients, setpatients] = useState([])
  const [staffs, setstaffs] = useState([])
  const [bills, setbills] = useState([])
  const [reload, setreload] = useState(0)
  const [mode, setmode] = useState('')

  const [checkOut, setcheckOut] = useState([])
  const [consume, setconsume] = useState([])

  const handleBills =async(id)=>{
    try {
      await axios.post(`http://${ip?.ip}:7700/getInpatientRequest`, { uid: id }).then((res)=>{
        console.log(res);
        if(res.data.status === 'success'){
          setcheckOut(res.data.getpatientBills)
          setconsume(res.data.getconsumableBills)
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
          await axios.post(`http://${ip?.ip}:7700/InpatientOnBill`, {signal: controller.signal}).then((res)=>{
            console.log(res);
            
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

  
  const [dept, setdept] = useState('')

  const [totalPrice, setTotalPrice] = useState(0)
  

  useEffect(() => {
    let total = 0;

    checkOut.forEach(entry => {
        try {
        const parsed = entry.prescribe

        if (parsed?.length > 0) {
            parsed.forEach(item => {
                if (item?.price) {
                    total += Number(item?.price) * Number(item?.quantity);
                }
            });
        }


        } catch (e) {
        console.warn(`Failed to parse services for ID ${entry._id}`);
        }
    });

    setTotalPrice(total);
  }, [checkOut]);

  const [totalPrice1, setTotalPrice1] = useState(0)
  

  useEffect(() => {
    let total = 0;

    consume.forEach(entry => {
        try {
        const parsed = JSON.parse(entry?.services) 

        if (parsed?.items.length > 0) {
            parsed?.items.forEach(item => {
                if (item?.price) {
                    total += Number(item?.price) * Number(item?.quantity);
                }
            });
        }


        } catch (e) {
        console.warn(`Failed to parse services for ID ${entry._id}`);
        }
    });

    setTotalPrice1(total);
  }, [consume]);
  
    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)
    
    const handleApprove1=async(id, uid)=>{
        const value ={
            uid: uid,
            id,
        }

        try {
            await axios.post(`http://${ip?.ip}:7700/inpatientBill`, value).then((res)=>{  
                // console.log(res);
                                
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    handleBills(uid)
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

    const handleDecline1=async(id, uid)=>{
        const value ={
            uid: uid,
            id: id
        }
        try {
            await axios.post(`http://${ip?.ip}:7700/decline`, value).then((res)=>{  
                console.log(res);
                                
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    handleBills(uid)
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }
    
    const handleApprove=async(cartItems, totalPrice, id, uid)=>{
        const getservices = {
            totalPrice: totalPrice,
            items: cartItems
        }
        const value ={
            uid: uid,
            id,
            docID: getid?._id,
            services: JSON.stringify(getservices)
        }

        try {
            await axios.post(`http://${ip?.ip}:7700/inpatientBill`, value).then((res)=>{  
                console.log(res);
                                
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    handleBills(uid)
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

    const handleDecline=async(cartItems, uid)=>{
        const value ={
            uid: uid,
            items: cartItems
        }
        try {
            await axios.post(`http://${ip?.ip}:7700/decline`, value).then((res)=>{  
                console.log(res);
                                
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    handleBills(uid)
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body'>
            <div className='payment_desk' >
                <h3>INPATIENT REQUESTS</h3>
                <div className='payment_desk_cart_fields' >
                    <h4>INPATIENT</h4>
                    {
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
                                <button onClick={()=>[handleBills(item?._id), setdept(item?.deposit)]} style={{backgroundColor:'#0463ca'}} >View Bills</button>
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
                            <h1 style={{margin:'15px 0', color:'green'}} >Total Bill {formatted?.format(totalPrice + totalPrice1)}</h1>
                        </div>
                    }

                    {
                        
                        checkOut?.length > 0 ?
                            checkOut?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                                
                               return(
                                    <div key={i} className='payment_desk_checkout'>
                                        {
                                            item?.prescribe?.length > 0 ?
                                                item?.prescribe?.map((res, i)=>(
                                                    <div key={i} className='cart_checkout_price'>
                                                        <div>
                                                            <h4>{res?.drugs}</h4>
                                                            <p>Qty: {res?.quantity}</p>
                                                        </div>

                                                        <div>
                                                            <p>price</p>
                                                            <p>{formatted?.format(res?.price * res?.quantity)}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            : null
                                        }

                                        <div className='cart_checkout_price' >
                                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                            <h3 style={{margin:'7px 0'}}>{formatted?.format(totalPrice)}</h3>
                                        </div>                                        
                                        <button onClick={()=>handleApprove(item?.prescribe, totalPrice, item?._id, item?.uid)} style={{margin: '10px 0', width:'100%'}} className='custome_table_btn2' >APPROVE REQUEST</button>
                                        <button onClick={()=>handleDecline(item?.prescribe, item?.uid)} style={{margin: '10px 0', width:'100%', backgroundColor:'#fff', color:'red', border:'1px solid red'}} className='custome_table_btn2' >DECLINE REQUEST</button>
                                    </div>
                                )
                            })
                        : null
                    }
                    {
                        
                        consume?.length > 0 ?
                            consume?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                                const getBill = JSON.parse(item?.services) 
                                let total = 0;

                                if (Array.isArray(getBill?.items) && getBill.items.length > 0) {
                                    getBill.items.forEach((it) => {
                                        if (it?.price && it?.quantity) {
                                        total += Number(it.price) * Number(it.quantity);
                                        }
                                    });
                                }
                               return(
                                    <div key={i} className='payment_desk_checkout'>
                                        {
                                            getBill?.items?.length > 0 ?
                                                getBill?.items?.map((res, i)=>(
                                                    <div key={i} className='cart_checkout_price'>
                                                        <div>
                                                            <h4>{res?.name}</h4>
                                                            <p>Qty: {res?.quantity}</p>
                                                        </div>

                                                        <div>
                                                            <p>price</p>
                                                            <p>{formatted?.format(res?.price * res?.quantity)}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            : null
                                        }

                                        <div className='cart_checkout_price' >
                                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                            <h3 style={{margin:'7px 0'}}>{formatted?.format(total)}</h3>
                                        </div>                                        
                                        <button onClick={()=>handleApprove1(item?._id, item?.uid)} style={{margin: '10px 0', width:'100%'}} className='custome_table_btn2' >APPROVE REQUEST</button>
                                        <button onClick={()=>handleDecline1(item?._id, item?.uid)} style={{margin: '10px 0', width:'100%', backgroundColor:'#fff', color:'red', border:'1px solid red'}} className='custome_table_btn2' >DECLINE REQUEST</button>
                                    </div>
                                )
                            })
                        : null
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default InpatientRequest