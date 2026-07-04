import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { FaImage } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify'

function AddStaff() {

  //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

  const [staffs, setstaffs] = useState([])
  const [reload, setreload] = useState(0)

  useEffect(()=>{
    const func =async()=>{
      try {
        await axios.post(`http://${ip?.ip }:7700/getStaffs`).then((res)=>{
          if(res.data.status === 'success'){
            setstaffs(res.data.staffs)
            setreload(0)
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
    func()
  },[reload, ip])


  const handleDelete =async(id)=>{
    try {
      await axios.post(`http://${ip?.ip }:7700/deleteStaff`, {staffID: id}).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  
  const [img, setimg] = useState(null)
  const [name, setname] = useState('')
  const [title, settitle] = useState('')
  const [passkey, setpasskey] = useState('')

  const handleAddStaff =async()=>{
    if(!img && name !== '' && title !== '' && passkey !== '') return toast.error('Enter All Fields Remember To Include an Image')

    const formdata = new FormData();
    formdata.append('img', img)

    const value ={
      name,
      title,
      passkey
    }

    let serialString = JSON.stringify(value);
    formdata.append('value', serialString)

    try {
      await axios.post(`http://${ip?.ip }:7700/createStaff`, formdata).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
          setimg(null)
          setname('')
          settitle('')
          setpasskey('')
        }else{
          toast.error(res.data.message)
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
          <h3>ADD STAFF</h3> 

          <div className='add_staff_contaimer'>
            <input type='file' onChange={(e)=>setimg(e.target.files[0])} id='files' style={{display:'none'}} />
            <label htmlFor='files' >
              {
                !img ?
                <FaImage size={150} color='#c3c3c3' />
                :
                <img src={URL.createObjectURL(img)} alt='' />
              }
            </label>
              {
                !img ?
                  <p>Choose staff Photo</p>
                :
                  <p>Click to change Photo</p>
              }

            <div className='patient_details_input_field1_' >
                <h4>STAFF NAME</h4>
                <input placeholder='Staff Name' value={name} onChange={(e)=>setname(e.target.value)} />
            </div>

            <div className='patient_details_input_field1_' >
                <h4>DEPARTMENT</h4>
                <select value={title} onChange={(e)=>settitle(e.target.value)} >
                  <option>Select Department</option>
                  <option value={'receptionist'} >Receptionist</option>
                  <option value={'cashier'} >Cashier</option>
                  <option value={'nurse'} >Nurse</option>
                  <option value={'doctor'} >Doctor</option>
                  <option value={'pharmacy'} >Pharmacy</option>
                  <option value={'laboratory'} >Lab Scientist</option>
                </select>
            </div>

            <div className='patient_details_input_field1_' >
                <h4>PASSKEY</h4>
                <input placeholder='Enter Staff Passkey' value={passkey} onChange={(e)=>setpasskey(e.target.value)} />
            </div>

            <button className='add_staff_contaimer_button' onClick={handleAddStaff}>UPLOAD STAFF DETAILS</button>
          </div>

          
            <div className='payment_desk_cart_fields' >
              <h3>ALL STAFFS</h3>
              <div className='display_all_utilities' >
                {
                  staffs?.length > 0 ?
                    staffs?.map((staff, i)=>(
                    <div key={i} >
                      <img src={`http://${ip?.ip }:7700/${staff?.photo}`} alt='' />
                      <div>
                        <p>{staff?.name}</p>
                        <h4>{staff?.title}</h4>
                      </div>
                      <button onClick={()=>handleDelete(staff?._id)} >DELETE</button>
                    </div>
                    ))
                  : null
                }
                
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AddStaff