import React from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'

function DrugsBar({item, reload, setreload}) {    
    
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(item?.sellingPrice);

    const date = new Date(Number(item?.expireDate * 1000))
    const day = date.getDate()
    const month = date.getMonth() 
    const year = date.getFullYear()
    const ip = useSelector(selectip)



    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1

    const expires = item?.expireDate * 1000
    const today = expires >= start && expires <= end || expires < start
    
    const handleDelete =async(id)=>{
        try {
            await axios.post(`http://${ip?.ip }:7700/deleteUtils`, {utilID: id}).then((res)=>{
                if(res.data.status === 'success'){
                setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleInc =async()=>{
        try {
            await axios.post(`http://${ip?.ip }:7700/incDec`, {dec: false, id: item?._id}).then((res)=>{
                if(res.data.status === 'success'){
                setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleDec =async()=>{
        try {
            await axios.post(`http://${ip?.ip }:7700/incDec`, {dec: true, id: item?._id}).then((res)=>{
                if(res.data.status === 'success'){
                setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <h4>{`${day}-${month}-${year}`}</h4>
            {
              today ?
              <p style={{color:'red'}} >Expired</p>
              :
              <p>Day-Month-Year</p>
            }
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <h4>{item?.name}</h4>
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <h4>{formatted}</h4>
        </div>

        <div className='Patientqueuecard_button' style={{width:'25%', justifyContent:'center'}}>
            <button onClick={handleDec} className='searchresultcard_view1' >
              <FaMinus/>
            </button>
                <h4>{item?.quantity}</h4>
            <button onClick={handleInc} className='searchresultcard_view2'>
              <FaPlus/>
            </button>
        </div>

        <button style={{width:'25%', backgroundColor:'red'}} onClick={()=> handleDelete(item?._id)} className='ADD_Cart_btn'>ADD TO CART</button>
      
    </div>
  )
}

export default DrugsBar