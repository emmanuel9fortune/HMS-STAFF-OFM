import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { selectid } from '../../features/idSlice'
import UtilsCard from './UtilsCard'
import ConsumableCard from './ConsumableCard'
import { emptyConsume, selectConsumeactualPrice, selectConsumeTotalPrice } from '../../features/consumables'
import { emptyUtils, selectUtilsactualPrice, selectUtilsTotalPrice } from '../../features/utilsSlice'
import { selectfid, setfids } from '../../features/fidSlice'
import Pagination from '../../components/Pagination'

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
                    setreload(reload + 1)               
                
                
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
                    setreload(reload + 1)                
                
                
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
                await axios.post(`http://${ip?.ip }:7700/nurseUtils`,{signal: controller.signal}).then((res)=>{     
                               
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
    const actualPrice1 = useSelector(selectUtilsactualPrice);
    const profit1 = totalPrice1 - actualPrice1

    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
    
    const id = useSelector(selectid);
    const fid = useSelector(selectfid);
    const uid = fid?.id || id?.id;
    
    const [patient, setpatient] = useState({})

    useEffect(()=>{
        const func =async()=>{
            try { 
                await axios.post(`http://${ip?.ip }:7700/getprescription`, {uid: uid}).then((res)=>{    
                    // console.log(res)            
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
    },[ip, uid, reload, id, fid])

    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const [stats, setstats] = useState(false)
    
    // console.log(fid?.fid || id?.fid || uid);
    

    const dispatch = useDispatch()

    const handleSubmit=async(type, id)=>{
        const getservices = {
            totalPrice: totalPrice || totalPrice1,
            actualPrice: actualPrice, 
            profit: profit,
            items: id ? utilsItems : consumeItems
        }
        const value ={
            uid: fid?.fid || id?.fid || uid ,
            nurseID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems: id ? utilsItems : consumeItems,
            type,
            oid: fid?.id
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
                    localStorage.removeItem('Utils')
                    dispatch(emptyUtils())
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
        const func=async()=>{
            await axios.post(`http://${ip?.ip }:7700/getItems`, {uid: fid?.fid || id?.fid || uid}).then((res)=>{
                // console.log(res);
                
                if(res.data.status === 'success'){
                    setgetitems(res.data.getpatientItems)
                    setgetStaff(res.data.getStaff)
                    setreload(0)
                    setdispenseIndex(dispenseIndex)
                }
            })
        }

        func() 
    },[uid, ip, reload, dispenseIndex, id, fid])

    const [currentPage, setCurrentPage] = useState(1)
      
    const itemsPerPage = 5;

    const reversedData = [...getitems].reverse()

    const totalPages = Math.ceil(reversedData.length / itemsPerPage)

    const startIndex = (currentPage - 1)*itemsPerPage;
    const currentItems = reversedData
    .slice(startIndex, startIndex + itemsPerPage)
    .map(row => ({
    ...row,
    originalIndex: getitems.findIndex(item => item === row)
    }));
     

    const isMobileDevice = window.innerWidth <= 768   

  return (
    <div className="dashboard_body" style={isMobileDevice ? {width:'100%', padding:'5px'} : {}}>
        <div className="back_btn_" onClick={handleBack}>
            <FaChevronLeft />
            <h4>BACK</h4> 
        </div> 

        <div className='dashboard_body_patient_details_btns' style={isMobileDevice ? {width:'100%', padding:'5px', flexWrap:'nowrap', display:'flex', flexDirection:'row'} : {}}>
            <button onClick={()=>{setcurrentIndex(1);dispatch(setfids({id:'', fid:''}))}} >PATIENT DETAILS</button> 
            <button onClick={()=>{setcurrentIndex(2);dispatch(setfids({id:'', fid:''}))}} >PATIENT VITALS</button> 
            <button className={currentIndex === 3 && 'dashboard_body_patient_details_btns_'} >UTILITIES | CONSUMABLES</button>
            <button onClick={()=>{setcurrentIndex(4);dispatch(setfids({id:'', fid:''}))}} >LAB RESULTS | SCAN</button>
            <button onClick={()=>{setcurrentIndex(5);dispatch(setfids({id:'', fid:''}))}} >MEDICATION CHART</button>
            <button onClick={()=>{setcurrentIndex(6);dispatch(setfids({id:'', fid:''}))}} >PRESCRIPTIONS</button> 
            <button onClick={()=>{setcurrentIndex(7);dispatch(setfids({id:'', fid:''}))}} >URINE CHART</button>
            <button onClick={()=>{setcurrentIndex(8);dispatch(setfids({id:'', fid:''}))}} >PATIENT RECENT BILLS</button>
        </div>

        <div className='dashboard_body_patient_details_btns'>
            <button className={dispenseIndex === 0 && 'dashboard_body_patient_details_btns_'} onClick={()=>[setdispenseIndex(0), setreload(reload + 1)]}>CONSUMABLES | UTILITIES</button> 
            <button className={dispenseIndex === 1 && 'dashboard_body_patient_details_btns_'} style={{width:'fit-content'}} onClick={()=>[setdispenseIndex(1), setreload(reload + 1), dispatch(setfids({id:id?.id, fid:id?.fid}))]}>ADD CONSUMABLES</button> 
            <button className={dispenseIndex === 2 && 'dashboard_body_patient_details_btns_'} style={{width:'fit-content'}} onClick={()=>[setdispenseIndex(2), setreload(reload + 1), dispatch(setfids({id:id?.id, fid:id?.fid}))]}>ADD UTILITIES</button> 
        </div>

    
      <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', margin:'30px 0'}} >
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />        
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
                        {   currentItems?.length > 0 &&
                            currentItems?.map((item, i)=>{
                            
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

                                
                                if(fid?.fid === item?.uid){
                                    if(item?.oid && fid?.id === item?.oid){
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
                                <ConsumableCard key={i} item={item}  reload={reload} setreload={setreload}/>
                            ))
                        : 
                        consumables?.length > 0 ?
                        consumables?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <ConsumableCard key={i} item={item}  reload={reload} setreload={setreload}/>
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
                    
                {/* <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(totalPrice)}</h3>
                </div> */}
                    
                <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(totalPrice)}</h3>
                </div>
                    
                {/* <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(profit)}</h3>
                </div> */}
                

                { 
                    consumeItems?.length > 0  ?
                        <>
                            {
                            !stats ?
                                patient?.status === 'admitted' ?
                                    <button className='custome_table_btn2' onClick={()=>handleSubmit('adm', '')}>REQUEST CONSUMABLES1</button>
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
                                <UtilsCard key={i} item={item} reload={reload} setreload={setreload}/>
                            ))
                        : 
                        utils?.length > 0 ?
                            utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <UtilsCard key={i} item={item} reload={reload} setreload={setreload}/>
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
                    <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(totalPrice1)}</h3>
                </div>
                    
                <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(actualPrice1)}</h3>
                </div>
                    
                <div className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted.format(profit1)}</h3>
                </div>
                

                {   
                    utilsItems?.length > 0  ?
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
    </div>
  )
}

export default DispanseUtils