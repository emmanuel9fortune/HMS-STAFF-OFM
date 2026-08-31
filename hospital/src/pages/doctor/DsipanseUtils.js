import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import UtilsCard from '../nurse/UtilsCard'
import ConsumableCard from '../nurse/ConsumableCard'
import { emptyConsume, selectConsumeactualPrice, selectConsumeTotalPrice } from '../../features/consumables'
import { emptyUtils, selectUtilsTotalPrice } from '../../features/utilsSlice'
import { setfids } from '../../features/fidSlice'
import { useParams } from 'react-router-dom'

function DispanseUtils({handleBack, currentIndex, setcurrentIndex}) {

    const ip = useSelector(selectip)
    
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

    const handleSearch = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${ip?.ip }:7700/nurseSearch`, value);
                setsearch(response.data.utils)                 
                
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    const handleSearch2 = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${ip?.ip }:7700/nurseSearch`, value);
                setsearch(response.data.consumables)                 
                
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    const consumeItems = useSelector(state => state.Consume.items);
    const utilsItems = useSelector(state => state.Utils.items);

    const [utils, setutils] = useState([])
    const [consumables, setconsumables] = useState([])
    const [reload, setreload] = useState(0)

    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
            try {
                await axios.post(`http://${ip?.ip }:7700/nurseUtils`, {signal: controller.signal}).then((res)=>{                
                    if(res.data.status === 'success'){
                        setutils(res.data.utils)
                        setconsumables(res.data.consumable)
                        setreload(0)
                    }
                })
            } catch (error) {
                //console.log(error);
            }
        }
        func()
        return ()=> controller.abort()
    },[ip, reload])
      
    const totalPrice = useSelector(selectConsumeTotalPrice);
    const actualPrice = useSelector(selectConsumeactualPrice);
    const profit = totalPrice - actualPrice
      
    const totalPrice1 = useSelector(selectUtilsTotalPrice);

    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
    
    const {id, fid} = useParams()

    const uid = id;
    
    const [patient, setpatient] = useState({})

    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
            try {
                await axios.post(`http://${ip?.ip}:7700/getprescription`, {uid: uid, signal: controller.signal}).then((res)=>{    
                    //console.log(res)            
                    if(res.data.status === 'success'){
                        setpatient(res.data.getPatient)
                        setreload(0)
                    }
                })
            } catch (error) {
                //console.log(error);
            }
        }
        func()
        return ()=> controller.abort()  
    },[ip, uid, reload, id, fid])

    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)
    const [stats, setstats] = useState(false)
    

    const dispatch = useDispatch()

    const handleSubmit=async(type, id)=>{
        const getservices = {
            totalPrice: totalPrice,
            actualPrice: actualPrice, 
            profit: profit,
            items: id ? utilsItems : consumeItems
        }
        const value ={
            uid : fid || uid,
            nurseID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems: id ? utilsItems : consumeItems,
            type,
            oid: id
        }
        
        setstats(true)

        try {
            await axios.post(`http://${ip?.ip}:7700/nurseBill`, value).then((res)=>{     
                // console.log(res);
                setstats(false)
                           
                if(res.data.status === 'success'){
                    toast.success('REQUEST SENT')
                    localStorage.removeItem('Consume')
                    dispatch(emptyConsume())
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

    const [dispenseIndex, setdispenseIndex] = useState(0) 
    const [getitems, setgetitems] = useState([])
    const [getStaff, setgetStaff] = useState([])

    useEffect(()=>{
        const controller = new AbortController()
        const func=async()=>{
            await axios.post(`http://${ip?.ip }:7700/getItems`, {uid: fid || uid, signal: controller.signal}).then((res)=>{
                //console.log(res);
                
                if(res.data.status === 'success'){
                    setgetitems(res.data.getpatientItems)
                    setgetStaff(res.data.getStaff)
                    setreload(0)
                    setdispenseIndex(dispenseIndex)
                }
            })
        }

        func()
        return ()=> controller.abort()
    },[uid, ip, reload, dispenseIndex, id, fid])
    

    const isMobileDevice = window.innerWidth <= 768   
    
    const handleView =(id)=>{
        dispatch(
            setfids({
                id:''
            })
        )
        window.history.back()
    }


  return (
    <div className="dashboard_body"  style={isMobileDevice ? {width:'100%', padding:'5px', marginTop:'100px'} : {width:'100%', marginTop:'100px'}}>
        <div className="back_btn_" onClick={handleView}>
            <FaChevronLeft />
            <h4>BACK</h4> 
        </div>

        <div className='dashboard_body_patient_details_btns' style={isMobileDevice ? {width:'100%', padding:'5px', flexWrap:'nowrap', display:'flex', flexDirection:'row'} : {}}>
            <button onClick={()=>{setcurrentIndex(0); dispatch(setfids({id:'', fid:''}))}} >PATIENT DETAILS</button>
            <button onClick={()=>{setcurrentIndex(1); dispatch(setfids({id:'', fid:''}))}} >VITALS</button>
            <button onClick={()=>{setcurrentIndex(2); dispatch(setfids({id:'', fid:''}))}} >LAB RESULTS | SCAN</button>
            <button onClick={()=>{setcurrentIndex(3); dispatch(setfids({id:'', fid:''}))}} >PRESCRIPTION</button>
            <button onClick={()=>{setcurrentIndex(5); dispatch(setfids({id:'', fid:''}))}} >MEDICATION CHART</button>
            <button onClick={()=>{setcurrentIndex(4); dispatch(setfids({id:'', fid:''}))}} >TRANSACTION HISTORY</button>
            <button onClick={()=>{setcurrentIndex(6); dispatch(setfids({id:'', fid:''}))}} >URINE CHART</button>
            <button className={currentIndex === 7 && 'dashboard_body_patient_details_btns_'} >UTILITIES | CONSUMABLES</button>
        </div>

        <div className='dashboard_body_patient_details_btns'>
            <button className={dispenseIndex === 0 && 'dashboard_body_patient_details_btns_'} onClick={()=>[setdispenseIndex(0), setreload(reload + 1)]}>CONSUMABLES | UTILITIES</button> 
            <button className={dispenseIndex === 1 && 'dashboard_body_patient_details_btns_'} style={{width:'fit-content'}} onClick={()=>[setdispenseIndex(1), dispatch(setfids({id:id?.id, fid:id?.fid}))]} >ADD CONSUMABLES</button> 
            <button className={dispenseIndex === 2 && 'dashboard_body_patient_details_btns_'} style={{width:'fit-content'}} onClick={()=>[setdispenseIndex(2), dispatch(setfids({id:id?.id, fid:id?.fid}))]} >ADD UTILITIES</button> 
        </div>

        {
            dispenseIndex === 0 &&
            <div className='dashboard_body cart_container_body'>
                <table className="custome_table">
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>CONSUMABLES | UTILITIES </th>
                            <th>QUANTITY</th>
                            <th>PRICE</th>
                            <th>SIGN</th>
                        </tr>
                    </thead>
                    <tbody >
                        {   getitems?.length > 0 &&
                            getitems?.map((item, i)=>{
                            
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

                                const arr = JSON.parse(item?.services) || []

                                const getstaffs = getStaff?.find((res)=> res._id === item?.nurseID)

                                if(fid === item?.uid){
                                    if(item?.oid && fid === item?.oid){
                                        return (
                                            arr?.items?.length > 0 && 
                                            arr?.items?.map((res, idx) => (
                                                <tr key={`${i}-${idx}`}>
                                                    {/* {idx === 0 && (
                                                        <td style={{height:'auto'}} rowSpan={arr?.items?.length}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }} className='test_nurse'>
                                                                <p style={{ width: '100px' }}>{day} | {month} | {year}</p>
                                                                <p style={{ width: '100px' }}>{timeString}</p>
                                                            </div>
                                                        </td>
                                                    )} */}
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <p style={{ width: '100px' }}>{day} | {month} | {year}</p>
                                                            <p style={{ width: '100px' }}>{timeString}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <strong>{res?.name || '-'}</strong>
                                                    </td>
                                                    <td>
                                                        <strong>{res?.quantity || '-'}</strong>
                                                    </td>
                                                    <td>
                                                        <strong>{res?.price || '-'}</strong>
                                                    </td>
                                                    <td>
                                                        <strong>{getstaffs?.name}</strong>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    }
                                }else{
                                    return (
                                            arr?.items?.length > 0 && 
                                            arr?.items?.map((res, idx) => (
                                                <tr key={`${i}-${idx}`}>
                                                    {/* {idx === 0 && (
                                                        <td style={{height:'auto'}} rowSpan={arr?.items?.length}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }} className='test_nurse'>
                                                                <p style={{ width: '100px' }}>{day} | {month} | {year}</p>
                                                                <p style={{ width: '100px' }}>{timeString}</p>
                                                            </div>
                                                        </td>
                                                    )} */}
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <p style={{ width: '100px' }}>{day} | {month} | {year}</p>
                                                            <p style={{ width: '100px' }}>{timeString}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <strong>{res?.name || '-'}</strong>
                                                    </td>
                                                    <td>
                                                        <strong>{res?.quantity || '-'}</strong>
                                                    </td>
                                                    <td>
                                                        <strong>{res?.price || '-'}</strong>
                                                    </td>
                                                    <td>
                                                        <strong>{getstaffs?.name}</strong>
                                                    </td>
                                                </tr>
                                            ))
                                    )
                                }
                            })
                        }
                    </tbody>
                </table>
            </div>
        }
        
        {
            dispenseIndex === 1 &&
            <div className='dashboard_body cart_container_body' style={isMobileDevice ? {width:'1000px', padding:'5px'} : {height:'fit-content'}}>
                <div className='cart_container' style={{margin:'10px'}} >
                    <h2>SEARCH & DISPENCE CONSUMABLES</h2>

                    <div className='dashboard_body_header' >
                        <div className='dashboard_body_header_search'>
                            <FaSearch/>
                            <input value={getsearch} onChange={handleSearch2} placeholder='Search' />
                        </div>
                    </div>
                    <h3> DISPLAY</h3>
                    <div className='drug_top_label' style={{width:'100%'}} >
                        <h4 style={{width:'25%', textAlign:'center'}} >CONSUMABLES</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >SELLING PRICE</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >AMOUNT LEFT</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >QUANTITY</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
                    </div>

                    
                    {
                        search?.length > 0 ?
                            search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <ConsumableCard key={i} item={item} setreload={setreload} reload={reload} />
                            ))
                        : 
                        consumables?.length > 0 ?
                        consumables?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <ConsumableCard key={i} item={item} setreload={setreload} reload={reload}/>
                            ))
                        : null
                    }
                </div>

                <div className='cart_checkout' > 
                    <div className='sidebar_spacer' ></div>              
                <h3>CHECK OUT</h3>

                {
                    consumeItems?.length > 0 ?
                        consumeItems?.map((item, i)=>(
                            <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                <h4>{item?.name}</h4>
                                <h4>{item.quantity}</h4>
                            </div>
                        ))
                    : null
                }

                <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(totalPrice)}</h3>
                </div>
                    
                <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(actualPrice)}</h3>
                </div>
                    
                <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(profit)}</h3>
                </div>
                

                { 
                    consumeItems?.length > 0  ?
                        <>
                            {
                            !stats ?
                                patient?.status === 'admitted' ?
                                    <button className='custome_table_btn2' onClick={()=>handleSubmit('adm', '')}>REQUEST CONSUMABLES</button>
                                : patient?.status === 'emergency' ?
                                    <button className='custome_table_btn2' onClick={()=>handleSubmit('con', '')}>REQUEST CONSUMABLES</button>
                                : 
                                    <button className='custome_table_btn2' onClick={()=>handleSubmit('consume', '')}>REQUEST CONSUMABLES</button>
                                :
                                <button style={{opacity:.3}} className='custome_table_btn2'>REQUEST CONSUMABLES</button>
                            }
                            <button className='custome_table_btn2' style={{backgroundColor:'#fff', color:'blue', margin:'5px 0', border:'1px solid blue'}} onClick={()=> dispatch(emptyConsume())}>CLEAR CONSUMABLES</button>
                        </>
                    :
                    <button style={{opacity:.3}} className='custome_table_btn2'>REQUEST CONSUMABLES</button>
                }
                </div>
            </div>
        }
        
        {
            dispenseIndex === 2 &&
            <div className='dashboard_body cart_container_body' style={isMobileDevice ? {width:'1000px', padding:'5px'} : {height:'fit-content'}}>
                <div className='cart_container' style={{margin:'10px'}} >
                    <h2>SEARCH & DISPENCE UTILITIES</h2>

                    <div className='dashboard_body_header' >
                        <div className='dashboard_body_header_search'>
                            <FaSearch/>
                            <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                        </div>
                    </div>
                    <h3>UTILS DISPLAY</h3>
                    <div className='drug_top_label' style={{width:'100%'}} >
                        <h4 style={{width:'25%', textAlign:'center'}} >UTILITY NAME</h4> 
                        <h4 style={{width:'25%', textAlign:'center'}} >SELLING PRICE</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >QUANTITY</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
                    </div>

                    
                    {
                        search?.length > 0 ?
                            search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <UtilsCard key={i} item={item} setreload={setreload} reload={reload}/>
                            ))
                        : 
                        utils?.length > 0 ?
                            utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <UtilsCard key={i} item={item} setreload={setreload} reload={reload}/>
                            ))
                        : null
                    }
                </div>

                <div className='cart_checkout' >
                    <div className='sidebar_spacer' ></div>              
                <h3>CHECK OUT</h3>

                {
                    utilsItems?.length > 0 ?
                        utilsItems?.map((item, i)=>(
                            <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                <h4>{item?.name}</h4>
                                <h4>{item.quantity}</h4>
                            </div>
                        ))
                    : null
                }
                    
                <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(totalPrice1)}</h3>
                </div>

                {
                    consumeItems?.length > 0  ?
                        <>
                            <button className='custome_table_btn2' onClick={()=>handleSubmit('utils', 'ut')}>REQUEST UTILITIES</button>

                            <button className='custome_table_btn2' style={{backgroundColor:'#fff', color:'blue', margin:'5px 0', border:'1px solid blue'}} onClick={()=> dispatch(emptyUtils())}>CLEAR UTILITIES</button>
                        </>
                    :
                    <button style={{opacity:.3}} className='custome_table_btn2'>REQUEST UTILITIES</button>
                }
                </div>
            </div>
        }
      <div style={{height:'700px', width:'100%'}}></div>
      <div style={{height:'700px', width:'100%'}}></div>
    </div>
  )
}

export default DispanseUtils