import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaSearch } from 'react-icons/fa'
import { selectip } from '../../features/ipSlice'
import DrugsBar from './DrugsBar';
import PreviousePrescribed from './PreviousePrescribed';
import { emptyPrescribe, removeFromPrescribe, selectPrescribeactualPrice, selectPrescribeTotalPrice } from '../../features/prescibeSlice';
import { setfids } from '../../features/fidSlice';
import { useParams } from 'react-router-dom';

function Prescriptions({handleBack, setCurrentIndex, currenIndex, admin, reload, setreload}) {

    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)
    
    const {id, fid} = useParams()

    const uid = id;  
        
     
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')
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

                const response = await axios.post(`http://${ip?.ip }:7700/docSearch`, value);
                setsearch(response.data.utils)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    const cartItems = useSelector(state => state.prescribe.items);

    // console.log(cartItems);
    

    const [utils, setutils] = useState([])
    const [patient, setpatient] = useState({})

    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
            try {
                await axios.post(`http://${ip?.ip }:7700/getprescription`, {uid: uid, signal: controller.signal}).then((res)=>{    
                    //console.log(res)            
                    if(res.data.status === 'success'){
                        setutils(res.data.utils)
                        setpatient(res.data.getPatient)
                        setreload(reload + 1)
                    }
                })
            } catch (error) {
                //console.log(error);
            }
        }
        func()
        return ()=> controller.abort()
    },[ip, uid, reload, id])
      
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
            uid: fid || uid ,
            docID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems,
            instruction,
            oid: id
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

    

    const handleSubmi3=async()=>{
        const getservices = {
            totalPrice: totalPrice,
            actualPrice: actualPrice, 
            profit: profit,
            items: cartItems
        }
        const value ={
            uid: fid || uid ,
            docID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems,
            instruction,
            oid: id
        }

        try {
            await axios.post(`http://${ip?.ip}:7700/emergencyBill`, value).then((res)=>{  
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
 

    const handleSubmit1=async()=>{
        const items = cartItems?.map((res)=> ({
                drugs : res.name,
                price : res.price,
                actualPrice : res.actualPrice,
                profit : res.totalPrice - res.actualPrice,
                days : res.days,
                time : res.time,
                dosage : res.dosage,
                id: res.id,
                quantity: res.quantity,
                timeStamp: new Date().getTime(),
                status: 'continue',
            })
        )

        const inst ={
            instruction,
            timeStamp: new Date().getTime()
        }

        const value ={
            uid: fid || uid ,
            instruction: inst,
            doctorID: getid?._id,
            items,
            oid: id
        }

        try {
            await axios.post(`http://${ip?.ip }:7700/PrescribeInPatient`, value).then((res)=>{     
                //console.log(res);
                           
                if(res.data.status === 'success'){
                    toast.success('PRESCRIPTION SENT')
                    localStorage.removeItem('Prescribe')
                    setinstruction('')
                    dispatch(emptyPrescribe())
                    setreload(reload + 1)
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
    
    
    const handleView =(id)=>{
        dispatch(
            setfids({
                id:''
            })
        )
        window.history.back()
    }

    // console.log(patient);
    

  return (
    <div className='dashboard_body' style={{width:'100%', marginTop:'100px'}}>
        <div className='back_btn_' onClick={handleView}>
            <FaChevronLeft /> 
            <h4>BACK</h4>
        </div>
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>{setCurrentIndex(0); dispatch(setfids({id:'', fid:''}))}} >PATIENT DETAILS</button>
            <button onClick={()=>{setCurrentIndex(1); dispatch(setfids({id:'', fid:''}))}} >VITALS</button>
            <button onClick={()=>{setCurrentIndex(2); dispatch(setfids({id:'', fid:''}))}} >LAB RESULTS | SCAN</button>
            <button className={currenIndex === 3 && 'dashboard_body_patient_details_btns_'} >PRESCRIPTION</button>
            <button onClick={()=>{setCurrentIndex(5); dispatch(setfids({id:'', fid:''}))}} >MEDICATION CHART</button>
            <button onClick={()=>{setCurrentIndex(4); dispatch(setfids({id:'', fid:''}))}} >TRANSACTION HISTORY</button>
            <button onClick={()=>{setCurrentIndex(6); dispatch(setfids({id:'', fid:''}))}} >URINE CHART</button>
            <button onClick={()=>{setCurrentIndex(7); dispatch(setfids({id:'', fid:''}))}} >UTILITIES | CONSUMABLES</button>
        </div>

        <div className='dashboard_body_patient_details_btns'>
            <button className={innerIndex === 0 && 'dashboard_body_patient_details_btns_'} onClick={()=>{setInnerIndex(0); dispatch(setfids({id:'', fid:''}))}}>NEW PRESCRIPTION</button>
            <button className={innerIndex === 1 && 'dashboard_body_patient_details_btns_'} onClick={()=>{setInnerIndex(1); dispatch(setfids({id:id?.id, fid:id?.fid}))}} >PREVIOUS PRESCRIPTION</button>
        </div>
        
        {
            innerIndex === 0 &&
            <div className='cart_container_body' style={{overflow:'hidden', width:'100%', padding:0}}>
                <div style={{margin:'10px', overflowY:'auto', flex:1}} >
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
                        : 
                        utils?.length > 0 ?
                            utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <DrugsBar admin={admin} key={i} item={item}/>
                            ))
                        : null
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
                            patient?.status === 'admitted' ?
                            <button className='custome_table_btn2' onClick={handleSubmit1}>SEND PRESCRIPTION</button>
                            : patient?.status === 'emergency' ?
                            <button className='custome_table_btn2' onClick={handleSubmi3}>SEND PRESCRIPTION</button>
                            : 
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
      <div style={{height:'200px', width:'100%'}}></div>
    </div>
  )
}

export default Prescriptions