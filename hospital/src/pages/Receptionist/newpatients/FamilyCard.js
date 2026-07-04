import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'
import { selectip } from '../../../features/ipSlice'

function FamilyCard({setcurrentIndex}) {
    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)
    const staffID = sessionStorage.getItem('staffID')

    const getDep = JSON.parse(staffID)

    const [name, setname] = useState('')
    const [address, setaddress] = useState('')
    const [notes, setnotes] = useState('') 
    const [religion, setreligion] = useState('')
    const [dateOfBirth, setdateOfBirth] = useState('')
    const [sex, setsex] = useState('')
    const [nextOfKin, setnextOfKin] = useState('') 
    const [members, setmembers] = useState('')
    const [phone, setphone] = useState('')
    const [nextOfKinPhone, setnextOfKinPhone] = useState('')
    const [patientType1, setPatientType1] = useState('new')

    const handleSubmit=async()=>{
        const value={
            name,
            address,
            notes,
            religion,
            dateOfBirth,
            sex,
            nextOfKin,
            members,
            phone,
            nextOfKinPhone,
            staffID: getDep?._id,
            family : true,
            patientType1
        }
        try {
            await axios.post(`http://${ip?.ip }:7700/addPatient`, value).then((res)=>{
                console.log(res);
                
                if(res.data.status === 'success'){
                    toast.success('Upload Successfull')
                    setname('')
                    setaddress('')
                    setnotes('')
                    setreligion('')
                    setdateOfBirth('')
                    setsex('')
                    setnextOfKin('')
                    setmembers('')
                    setphone('')
                    setnextOfKinPhone('')
                    setcurrentIndex(0)
                    sessionStorage.removeItem('patient')
                    sessionStorage.removeItem('index')
                }else{
                    //console.log(res.data);
                    
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

    
  return (
    <>
        <h2 className='regular_patient_hd'>REGISTER NEW FAMILY</h2>

        <div className='patient_details_' >
            <div className='patient_details_input_field1' >
            
                <h3>TYPE OF PATIENT</h3>
                
                <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
                    <button style={patientType1 !== 'new' ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setPatientType1('new')}>NEW PATIENT</button>
                    <button style={patientType1 !== 'old' ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setPatientType1('old')}>RETURNING PATIENT</button>
                </div>
                
                <div className='patient_details_input_field1_'>
                    <h4>FAMILY NAME</h4>
                    <input value={name} onChange={(e)=> setname(e.target.value)} placeholder='Enter Patient Name' />
                </div>
                <div className='patient_details_input_field1_'>
                    <h4>ADDRESS</h4>
                    <input value={address} onChange={(e)=> setaddress(e.target.value)} placeholder='Enter Patient Address' />
                </div>
                <div className='patient_details_input_field1_'>
                    <h4>RELIGION</h4>
                    <select value={religion} onChange={(e)=> setreligion(e.target.value)} >
                        <option >Select Religion</option>
                        <option value={'christian'} >Christian</option>
                        <option value={'islam'}>Islam</option>
                        <option value={'other'}>Other</option>
                    </select>
                </div>
            </div>

            <div className='patient_details_input_field1' >
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_in' >
                        <h4>N0. FAMILY MEMBERS</h4>
                        <input type='number' placeholder='Enter number of family members'  value={members} onChange={(e)=> setmembers(e.target.value)}  />
                    </div>
                </div>
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_in' >
                        <h4>PATIENT PHONE NUMBER</h4>
                        <input type='number' placeholder='Enter Patient Phone Number'  value={phone} onChange={(e)=> setphone(e.target.value)}  />
                    </div>
                </div>
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_in' >
                        <h4>NEXT OF KIN</h4>
                        <input placeholder='Enter Next Kin'  value={nextOfKin} onChange={(e)=> setnextOfKin(e.target.value)}  />
                    </div>
                    <div className='patient_details_input_field1_in' >
                        <h4>NEXT OF KIN PHONE NUMBER</h4>
                        <input type='number' placeholder='Enter Next of kin Phone Number'  value={nextOfKinPhone} onChange={(e)=> setnextOfKinPhone(e.target.value)}  />
                    </div>
                </div>

            </div>
        </div>

        

        <div className='custome_table_btn' >
            <div className='back_btn_' onClick={()=>setcurrentIndex(0)}>
                <FaChevronLeft />
                <h4>BACK</h4>
            </div>

            {
                name ?
                    <button onClick={handleSubmit} className='custome_table_btn2' >SUBMIT</button>
                :
                <button style={{opacity:'.3px'}} onClick={()=>toast.error('PLEASE ENTER PATIENT NAME')} className='custome_table_btn2' >SUBMIT</button>
            }
        </div>
    </>
  )
}

export default FamilyCard