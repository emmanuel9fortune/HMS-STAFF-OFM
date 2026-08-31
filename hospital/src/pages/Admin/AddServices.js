import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { selectip } from '../../features/ipSlice'
import { useSelector } from 'react-redux'

function AddServices() {

  //axios.defaults.withCredentials = true
  const ip = useSelector(selectip)

  const [utilities, setutilities] = useState([])
  const [reload, setreload] = useState(0)

  useEffect(()=>{
    const func =async()=>{
      try {
        await axios.post(`http://${ip?.ip }:7700/getService`).then((res)=>{          
          if(res.data.status === 'success'){
            setutilities(res.data.services)
            setreload(0)
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
    func()
  },[reload, ip])
  
  const [name, setname] = useState('')
  const [originalPrice, setoriginalPrice] = useState('')
  const [sellingPrice, setsellingPrice] = useState('')
  
  const handleDelete =async(id)=>{
    try {
      await axios.post(`http://${ip?.ip }:7700/deleteService`, {serveID: id}).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddUtils =async()=>{

    const value ={
      name,
      price: originalPrice,
      type: sellingPrice,
    }

    try {
      await axios.post(`http://${ip?.ip }:7700/AddService`, value).then((res)=>{
        if(res.data.status === 'success'){
          toast.success('SERVICE ADDED SUCCESSFULLY')
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='dashboard_container'>
      <AdminBar/> 

      <div className='dashboard_body' >
        <div className='payment_desk' >
            <h3>ADD SERVICES</h3>


          <div className='payment_desk_input_fields add_utilities'>

            <div className='patient_details_input_field1_' >
              <h4>SERVICE NAME</h4>
              <input value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Service Name' />
            </div>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                    <h4>PRICE</h4>
                    <input value={originalPrice} onChange={(e)=>setoriginalPrice(e.target.value)} type='number'  placeholder='Enter Price' />
                </div>
                <div className='patient_details_input_field1_in' >
                    <h4>SERVICE TYPE</h4>
                    <select style={{width:'100%', padding:'15px'}} value={sellingPrice} onChange={(e)=>setsellingPrice(e.target.value)}>
                        <option >SELECT SERVICE TYPE</option>
                        <option value={'scan'} >SCAN</option>
                        <option value={'test'}>TEST</option>
                    </select>
                </div>
            </div>
            
            <button onClick={handleAddUtils} className='add_staff_contaimer_button' >UPLOAD SERVICES</button>
          </div>

          
          <div className='payment_desk_input_fields add_utilities' >
            <h4>RECENTLY ADDED SERVICES</h4>
            <div className='display_all_utilities_contianer'>
              <div className='display_all_utilities' >
                {
                  utilities?.length > 0 ?
                    utilities?.map((cat, i)=>{
                    return(
                    <div key={i} >
                      <div>
                        <p>Name: {cat?.name}</p>
                        <p>Service Type:  ({cat?.type})</p>
                        <h4>Quantity: {cat?.price}</h4>
                      </div>
                      <button onClick={()=>handleDelete(cat?._id)} >DELETE</button>
                    </div>
                    )})
                  : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddServices