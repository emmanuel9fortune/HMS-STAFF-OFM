import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice';

function PaymentCard3({item, getstaffs, handleBills, setreload, reload}) {
    const ip = useSelector(selectip)
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
    }).format(Number(getBill?.actualPrice));
    const formatted3 = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    }).format(getBill?.totalPrice  - getBill?.actualPrice);

    
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

    const format = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    })

    const getUtils = getBill?.profit === 0 ? 'utils' : 'con'

    const getStaffName = getstaffs?.find((items)=> items?._id === item?.nurseID || items?._id === item?.doctorID || items?._id === item?.staffID)

    
    const [deposit, setdeposit] = useState('')
    const [dep, setdep] = useState(false)
    const [mode, setmode] = useState('')

    const handleDeposit =async(id, uid, deps)=>{
        try {
        await axios.post(`http://${ip?.ip }:7700/addDeposit`, {id, deposit, mode, deps}).then((res)=>{        
            // console.log(res)
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

    const finallMode = mode 
    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const handleCheckOut =async(uid, billId, total, type, getUtils)=>{
        try {
        await axios.post(`http://${ip?.ip}:7700/patientCheckOut`, {
            uid,
            billId,
            mode: finallMode,
            total,
            type,
            getUtils,
            staff : getid?._id
        }).then((res)=>{
            // console.log(res)
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
          // console.log(res)
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

    

    const handleDebtor =async(uid, billId, total, type)=>{
      try {
        await axios.post(`http://${ip?.ip}:7700/debtors`, {
          uid,
          billId,
          mode: finallMode,
          total, 
          type,
          staff : getid?._id
        }).then((res)=>{
          // console.log(res)
          if(res.data.status === 'success'){
            handleBills(uid)
            setreload(reload + 1)
            toast.success('PATIENT BILL SET TO DEBTORS')
            setmode('')
          }
        })
      } catch (error) {
        //console.log(error);
      }
    }

    return(
    <div style={{backgroundColor:'cadetblue'}}>
        { 
        item?.type !== 'lab' &&
            item?.type !== 'scan' &&
            <div className='payment_desk_checkout' >
            {
                item?.type !== 'lab' && item?.type !== 'scan' &&
                <div className='psyment_desk_history' >
                    <p>Date : </p>
                    <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>

                    <h4>Staff: {getStaffName?.name}</h4>
                </div>   
            }
            {
                getBill?.items?.length > 0 ?
                    getBill?.items?.map((item, i)=>{
                    
                    const formatted = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })
                    
                    return(
                        <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                        <div style={{width: '70%'}} >
                            <h4 style={{width:'100%', backgroundColor:'whitesmoke', padding:'5px'}}>{item?.name || item?.drugs}</h4>
                            <p style={{width:'100%', backgroundColor:'orange', padding:'5px'}}>{item?.quantity} Sold For :</p>
                            <p>1 Sold For :</p>
                        </div>
                        
                        <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                            <h4 style={{width:'100%', backgroundColor:'whitesmoke', padding:'5px', textAlign:'end'}}>{item?.quantity}</h4>
                            <h4 style={{width:'100%', backgroundColor:'orange', textAlign:'end', padding:'5px'}}>{formatted.format(item?.quantity > 0 ? item?.price * item?.quantity : item?.price)}</h4>
                            <h4>{formatted.format(item?.price)}</h4>
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
                <h3 style={{margin:'7px 0'}}>{getBill?.totalPrice ? formatted : format.format(getBill?.items?.[0]?.totalPrice)}</h3>
            </div>
            
            <div className='patient_details_input_field1_' >
                <h4>CHOOSE METHOD</h4>
                <select value={mode} onChange={(e)=>setmode(e.target.value)} >
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
                <button onClick={()=>handleCheckOut(item?.uid, item?._id, getBill?.totalPrice, item?.type, getUtils)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                :
                <button onClick={()=> toast.error('ENTER PAYMENT METHOD')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >CHECK OUT NOW</button>
                :
                null
            }

            <button onClick={()=>handleDisapprove(item?.uid, item?._id, getBill?.totalPrice, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'red'}} className='custome_table_btn2' >DISAPPROVE BILL</button>

            <button onClick={()=>handleDebtor(item?.uid, item?._id, getBill?.totalPrice, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'gold'}} className='custome_table_btn2' >SET BILL TO DEBTOR</button>
            </div>
        }
    </div>
  )
}

export default PaymentCard3