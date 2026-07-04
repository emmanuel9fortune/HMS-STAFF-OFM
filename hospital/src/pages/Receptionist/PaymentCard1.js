import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice';

function PaymentCard1({item, getstaffs, handleBills, setreload, reload}) {
  const ip = useSelector(selectip)
  
  const getBill = JSON.parse(item?.services) 
  const getTotal = getBill?.length > 0 ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0
  const [mode3, setmode3] = useState('')
  const [deposit2, setdeposit2] = useState('')
  const [dep, setdep] = useState(false)
  
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

  const handleDeposit2 =async(id, uid, deps)=>{
    try {
      await axios.post(`http://${ip?.ip }:7700/addDeposit`, {id, deposit2, mode: mode3, deps}).then((res)=>{     
        // console.log(res)   
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

  
  const finallMode = mode3
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
          setmode3('')
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
          setmode3('')
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
          setmode3('')
        }
      })
    } catch (error) {
      //console.log(error);
    }
  }


  return(
    <div className='payment_desk_checkout' style={{backgroundColor:'cadetblue'}}>
          <div className='psyment_desk_history' >
              <p>Date : </p>
              <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
              
              <h4>{getStaffName?.name}</h4>
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


      <div className='patient_details_input_field1_' >
          <h4>CHOOSE METHOD</h4>
        <select value={mode3} onChange={(e)=>[setmode3(e.target.value)]} >
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
          deposit2 > getBill?.totalPrice && !item?.initialDeposit ?
          <button onClick={()=> toast.error('OVER DEPOSITED AMOUNT ')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >DEPOSIT</button>
          :
        deposit2 > getBill?.totalPrice - item?.initialDeposit ?
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

      <button onClick={()=>handleDebtor(item?.uid, item?._id, getBill?.price, item?.type)} style={{margin: '20px 0', width:'100%', backgroundColor:'gold'}} className='custome_table_btn2' >SET BILL TO DEBTOR</button>
    </div>
  )   
}

export default PaymentCard1