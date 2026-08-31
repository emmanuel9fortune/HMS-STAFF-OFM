import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice';

function PaymentCard2({item, getstaffs, handleBills, setreload, reload}) {
    const ip = useSelector(selectip)
  
    const getBill = JSON.parse(item?.services) 
    const [mode2, setmode2] = useState('')    
    const [deposit1, setdeposit1] = useState('')
    const [dep, setdep] = useState(false)
    const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

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
    const getStaffName = getstaffs?.find((items)=> items?._id === item?.nurseID || items?._id === item?.doctorID || items?._id === item?.staffID)
    
    const handleDeposit1 =async(id, uid, deps)=>{
        try {
        await axios.post(`http://${ip?.ip }:7700/addDeposit`, {id, deposit1, mode: mode2, deps}).then((res)=>{    
            // console.log(res)    
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

    const finallMode = mode2
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
            setmode2('')
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
            setmode2('')
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
            setmode2('')
          }
        })
      } catch (error) {
        //console.log(error);
      }
    }

    return(
        <div className='payment_desk_checkout' style={{backgroundColor:'cadetblue'}}>
            {
                getBill?.length > 0 &&
                <div className='psyment_desk_history' >
                    <p>Date : </p>
                    <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>

                    <h4>Staff: {getStaffName?.name}</h4>
                </div>  
            } 
        {
            getBill?.map((bil)=>{

            const formatted6 = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(bil?.price);

            return(
            <div >
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
            <select value={mode2} onChange={(e)=>[setmode2(e.target.value)]} >
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
                deposit1 > getTotal && !item?.initialDeposit ?
                <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >DEPOSIT</button>
                :
                deposit1 > getBill?.totalPrice - item?.initialDeposit ?
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

        <button onClick={()=>handleDebtor(item?.uid, item?._id, getTotal, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'gold'}} className='custome_table_btn2' >SET BILL TO DEBTOR</button>
        </div>
    )   
}

export default PaymentCard2