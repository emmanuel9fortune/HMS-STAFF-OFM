import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import axios from 'axios'
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify'

function NurseRequest({handleBack, setcurrentIndex, currentIndex}) {
    const ip = useSelector(selectip)

    const id = useSelector(selectid)
    const uid = id?.id;
    const [reload, setreload] = useState(0)

    const [checkOut, setcheckOut] = useState([])
    const [staff, setstaff] = useState([])

    useEffect(()=>{
    const controller = new AbortController()
        const func =async()=>{
            try {
                await axios.post(`http://${ip?.ip}:7700/utilityRequest`, {uid, signal: controller.signal}).then((res)=>{
                    //console.log(res);
                    
                    if(res.data.status === 'success'){
                        setcheckOut(res.data.utils)
                        setstaff(res.data.getStaffDetails)
                        setreload(0)
                    }
                })
            } catch (error) {
                //console.log(error);
            }
        }
        func()
    return ()=> controller.abort()
    },[uid, ip, reload])

    
  const handleCheckOut =async(uid, billId, tag)=>{
    try {
      await axios.post(`http://${ip?.ip}:7700/utilsDispenser`, {
        uid,
        billId,
        tag
      }).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
          toast.success('PATIENT CHECKOUT SUCCESSFUL')
        }
      })
    } catch (error) {
      //console.log(error);
    } 
  }

  return (
    <div className='dashboard_body' >
        <div className='back_btn_' onClick={handleBack}>
            <FaChevronLeft />
            <h4>BACK</h4>
        </div>
        
        <div className='dashboard_body_patient_details_btns'>
            <button className={currentIndex === 1 && 'dashboard_body_patient_details_btns_'} >CONSUMABLE REQUESTS</button>
            <button onClick={()=>setcurrentIndex(2)} >DRUG REQUESTS</button>
        </div>
        
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

                    const getstaff = staff?.length > 0 ? staff?.find((stf)=> stf?._id === item?.nurseID) : []

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
                    <div className='payment_desk_checkout' key={i}>
                        <h4>{getstaff?.name} Request</h4>
                        
                        {
                            item?.type !== 'lab' &&
                            item?.type !== 'scan' &&
                            <div className='psyment_desk_history' style={{margin:'5px 0'}} >
                                <p>Request Date : </p>
                                <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                            </div>
                        }
                        { 
                        item?.type !== 'lab' &&
                            item?.type !== 'scan' &&
                            <div  >
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
                                            <h4 >{item?.name}</h4>
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
                                <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                                <h3 style={{margin:'7px 0'}}>{formatted2}</h3>
                            </div>
                                
                            <div className='cart_checkout_price' >
                                <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                            </div>
                                
                            <div className='cart_checkout_price' >
                                <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                                <h3 style={{margin:'7px 0'}}>{formatted3}</h3>
                            </div>
                            

                            {
                                getBill ?
                                <button onClick={()=>handleCheckOut(item?.uid, item?._id, item?.tag)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                                :
                                null
                            }
                            </div>
                        }
                    </div>
                    )                    
                })
            : null
        }
    </div>
  )
}

export default NurseRequest