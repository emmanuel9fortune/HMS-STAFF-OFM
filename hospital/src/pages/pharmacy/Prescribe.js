import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectid } from '../../features/idSlice';
import { FaChevronLeft, FaSearch } from 'react-icons/fa'
import { selectip } from '../../features/ipSlice'
import { emptyPrescribe, removeFromPrescribe, selectPrescribeactualPrice, selectPrescribeTotalPrice } from '../../features/prescibeSlice';
import DrugsBar from '../doctor/DrugsBar';
import PreviousePrescribed from '../doctor/PreviousePrescribed';

function Prescribe({handleBack, setCurrentIndex, currenIndex, admin}) {

    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)
    const id = useSelector(selectid);
    const uid = id?.id;
    
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')
    const [reload, setreload] = useState(0)
    // const [instruction, setinstruction] = useState('')

    const handleSearch = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${ip?.ip }:7700/AntenatalDrugsearch`, value);
                setsearch(response.data.utils)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    const cartItems = useSelector(state => state.prescribe.items);
      
    const totalPrice = useSelector(selectPrescribeTotalPrice);

    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(totalPrice);
    
    const actualPrice = useSelector(selectPrescribeactualPrice);

    const profit = totalPrice - actualPrice

    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)
    

    const [instruction, setinstruction] = useState('')
    const dispatch = useDispatch()

    const handleSubmit=async()=>{
        const getservices = {
            totalPrice: totalPrice,
            actualPrice: actualPrice, 
            profit: profit,
            items: cartItems
        } 
        const value ={
            uid ,
            docID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems,
            instruction,
            tag: 'pharmacy'
        }

        try {
            await axios.post(`http://${ip?.ip}:7700/docBill`, value).then((res)=>{  
                if(res.data.status === 'success'){
                    toast.success('PRESCRIPTION SENT')
                    localStorage.removeItem('Prescribe')
                    setinstruction('')
                    setreload(reload + 1)
                    dispatch(emptyPrescribe())
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

    const [innerIndex, setInnerIndex] = useState(0)
    
    const handleRemove = (id) => {
        dispatch(removeFromPrescribe(id));
    };

  return (
    <div className='dashboard_body' >
        <div className='back_btn_' onClick={handleBack}>
            <FaChevronLeft /> 
            <h4>BACK</h4>
        </div>

        <div className='dashboard_body_patient_details_btns'>
            <button className={innerIndex === 0 && 'dashboard_body_patient_details_btns_'} onClick={()=>setInnerIndex(0)}>NEW PRESCRIPTION</button>
            <button className={innerIndex === 1 && 'dashboard_body_patient_details_btns_'} onClick={()=>setInnerIndex(1)} >PREVIOUS PRESCRIPTION</button>
        </div>
        
        {
            innerIndex === 0 &&
            <div className='dashboard_body cart_container_body' style={{overflow:'hidden', width:'100%', padding:0}}>
                <div className='cart_container' style={{margin:'10px', overflow:'auto'}} >
                    <h2>SEARCH & DISPENCE DRUGS</h2>

                    <div className='dashboard_body_header' >
                        <div className='dashboard_body_header_search'>
                            <FaSearch/>
                            <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                        </div>
                    </div>
                    <h3>UTILS DISPLAY</h3>
                    <div className='drug_top_label' style={{width:'100%'}} >
                        <h4 style={{width:'25%', textAlign:'center'}} >EXPIRING</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >DRUG</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >TIME</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >DAYS</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >AMOUNT LEFT</h4>
                        {
                            !admin &&
                            <h4 style={{width:'25%', textAlign:'center'}} >DOSAGE</h4>
                        }
                        {
                            !admin &&
                            <h4 style={{width:'25%', textAlign:'center'}} >QUANTITY</h4>
                        }
                        {
                            !admin &&
                            <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
                        }
                    </div>

                    
                    {
                        search?.length > 0 ?
                            search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <DrugsBar admin={admin} key={i} item={item}/>
                            ))
                        :  null
                    }
                </div>

                {
                    !admin &&
                    <div className='cart_checkout' style={{height:'fit-content'}}>
                        
                        <div className='previouse_medicals_textareas_NOTE' >
                            <div >
                                <h4>ENTER INSTRUCTION</h4>
                                <textarea placeholder='Enter Instruction' style={{height:'300px'}}  value={instruction} onChange={(e)=>setinstruction(e.target.value)} />
                            </div>
                        </div>
                        <h3>CHECK OUT</h3>


                        {
                        cartItems?.length > 0 ?
                            cartItems?.map((item, i)=>(
                                <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                    <h4>{item?.name}</h4>
                                   <div style={{display:'flex', alignItems:'center'}} >
                                        <h4>{item.quantity}</h4>
                                        <button style={{margin:'0 10px'}} onClick={()=>handleRemove(item?.id)} >DELETE</button>
                                   </div>
                                </div>
                            ))
                        : null
                        }
                        
                        <div className='cart_checkout_price' >
                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                            <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                        </div>

                        {
                            cartItems?.length > 0  ?
                                <button className='custome_table_btn2' onClick={handleSubmit}>SEND PRESCRIPTION</button>
                            :
                            <button style={{opacity:.3}} className='custome_table_btn2'>SEND PRESCRIPTION</button>
                        }
                    </div>
                }
            </div>
        }

        {
            innerIndex === 1 &&
            <PreviousePrescribed/>
        }
    </div>
  )
}

export default Prescribe