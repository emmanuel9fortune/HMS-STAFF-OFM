import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'

function ChurchBills() {

    const ip = useSelector(selectip)
    const [bills, setbills] = useState([])
    const [reload, setreload] = useState(0)

    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
            try {
                await axios.post(`http://${ip?.ip }:7700/getChruchBill`, {signal: controller.signal}).then((res)=>{
                    if(res.data.status === 'success'){
                        setbills(res.data.church)
                        setreload(reload + 1)
                    }
                }) 
            } catch (error) {
                console.log(error)
            }
        }

        func()
        
        return ()=> controller.abort()
    },[reload])

    const format = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })


    const handleStatus = async(row, status) =>{
      try {
        await axios.post(`http://${ip?.ip}:7700/updatechurchbill`, {id:row?._id, status}).then((res)=>{
          if(res.data.status === 'success'){
            setreload(reload + 1)
          }
        })
      } catch (error) {
        console.log(error);
        
      }
    }

  return (
    < >
        <h3>CHURCH BILLS</h3>
      <table className="custome_table">
        <thead>
          <tr> 
            <th>DATE</th>
            <th>PATIENT NAME </th>
            <th>AMMOUNT</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody >
          {bills.map((row, index) => {
            
            const date = new Date(Number(row?.timestamp))
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const date1 = new Date(Number(row?.timestamp))
        
            let hours = date1.getHours()
            const minutes = date1.getMinutes()
            const ampm = hours >= 12 ? "PM" : "AM"
        
            hours = hours % 12
            hours = hours ? hours : 12
        
            const pad = (n) => n.toString().padStart(2, '0')
        
            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

            return (
            <tr key={index}  >
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px'}} >{day} | {month} | {year}</p>
                    <p>{timeString}</p>
                </div>
              </td>
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px'}} >{row.patient}</p>
                </div>
              </td>
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px'}} >{format?.format(row?.amount)}</p>
                </div>
              </td>
              <td style={{padding:'10px'}}>
                {
                  row?.status === 'PAID' ? <button style={{backgroundColor:'green', color:'white', padding:'10px 15px'}} onClick={()=>handleStatus(row, 'UNPAID')} >PAID</button> :
                  <button style={{backgroundColor:'red', color:'white', padding:'10px 15px'}} onClick={()=>handleStatus(row, 'PAID')} >UNPAID</button>
                }
              </td>
            </tr>
          )}
          )}
        </tbody>
      </table> 
    </>
  )
}

export default ChurchBills