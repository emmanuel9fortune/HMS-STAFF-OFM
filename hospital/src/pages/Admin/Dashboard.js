import React, { useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { MdNotificationImportant } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import { selectip } from '../../features/ipSlice'
import axios from 'axios'

function Dashboard() {

    const info = useSelector(selectinfo)
    const ip = useSelector(selectip)
    
    const Formatted1 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.invoice);
    
    const Formatted2 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.numberOfutils);
    
    const Formatted3 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.numberOfPatients);
    
    const Formatted4 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.staffs?.length);

    // ================================================== //
    // |||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ================================================== //

    const formatted = info?.batches?.map(batch=>({
        label: batch
    }))

    const [getbatch, setgetbatch] = useState(null)
    const [getbatches, setgetbatches] = useState([])

    const handleBatch =async(e)=>{
        const batch = e.target.value
        if(!batch){
            return setgetbatch(null)
        }
        setgetbatches(batch)
        try{
            await axios.post(`http://${ip?.ip }:7700/batchanalist`, {batch}).then((res)=>{
                if(res.data.status === 'success'){
                    setgetbatch(res.data.analytics[0])
                }
            })
        }catch(error){
            console.log(error)
        }
    }
    
    const Formatted5 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format( info?.analytics?.totalOriginalQuantity);
    
    const Formatted15 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalOriginalQuantity);

    const Formatted6 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalQuantity);

    const Formatted16 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalQuantity);

    const getSold = info?.analytics?.totalOriginalQuantity - info?.analytics?.totalQuantity
    const getSold1 = getbatch?.totalOriginalQuantity - getbatch?.totalQuantity 
    
    const Formatted7 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getSold);
    
    const Formatted17 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getSold1);
    
    const Formatted8 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalAmount);
    
    const Formatted18 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalAmount);
    
    const Formatted9 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalActualAmount);
    
    const Formatted19 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalActualAmount);
    
    const Formatted10 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalAmount - info?.analytics?.totalActualAmount);
    
    const Formatted110 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format( getbatch?.totalAmount - getbatch?.totalActualAmount);


  return (
    <div className='dashboard_container'>
        <AdminBar/> 

        <div className='dashboard_body' >
            <h1>Dashboard</h1>

            <div className='admin_dashboard_boxes' >
                <div className='admin_dashboard_box' >
                    <h4>Total Invoice</h4>
                    <h2>{Formatted1}</h2>
                    <p>Total number of completed transaction</p>
                </div>
                
                <div className='admin_dashboard_box' >
                    <h4>Stocks Available</h4>
                    <h2>{Formatted2}</h2>
                    <p>Total number of stocks (utilities) available</p>
                </div>

                <div className='admin_dashboard_box' >
                    <h4>Total Patient</h4>
                    <h2>{Formatted3}</h2>
                    <p>Total number of patients</p>
                </div>

                <div className='admin_dashboard_box' >
                    <h4>Total Staff</h4>
                    <h2>{Formatted4}</h2>
                    <p>Total number of Staffs </p>
                </div>

            </div>

            <div className='admin_dashboard_body' >
                <div className='admin_dashboard_body_box' >
                    <div className="calcl_bar" >
                        <h3 style={{margin:'0'}} >STOCK ANALYTICS</h3>
                        <select value={getbatches} onChange={handleBatch}>
                            <option value=''>Select Batch</option>
                            {   formatted &&
                                formatted?.map((item, i)=>(
                                    <option key={i} value={item?.label} >{item?.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Original Quantity Of Utilities</h4>
                        <h2>{getbatch !== null ? Formatted15 : Formatted5}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Utilities Left</h4>
                        <h2>{getbatch !== null ? Formatted16 : Formatted6}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Utilities Sold</h4>
                        <h2>{getbatch !== null ? Formatted17 : Formatted7}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Amount Made</h4>
                        <h2>{getbatch !== null ? Formatted18 : Formatted8}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Orignal Amount</h4>
                        <h2>{getbatch !== null ? Formatted19 : Formatted9}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Profit</h4>
                        <h2>{getbatch !== null ? Formatted110 : Formatted10}</h2>
                    </div>
                </div>
                <div className='admin_dashboard_body_box' >
                    <h3>STAFFS ON DUTY</h3>

                    {
                        info?.staffs?.length > 0 ?
                            info?.staffs?.map((item, i)=>(
                                <div key={i} className='recentpatientdashcard' >
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>{item?.name}</h4>
                                        <p>{item?.title}</p>
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <p>{item?.status}</p>
                                    </div>
                                </div>
                            ))
                        : null
                    }
                </div>
                <div className='admin_dashboard_body_box' >
                    <h3>STOCK ALERT</h3>    
                    {
                        info?.stocksExpire?.length > 0 ?
                            Object.values(info?.stocksExpire)?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>{
                                const date = new Date(Number(item?.expireDate * 1000))
                                const day = date.getDate()
                                const month = date.getMonth()
                                const year = date.getFullYear()

                                
                                const now = new Date()
                                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                                const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1

                                const expires = item?.expireDate * 1000
                                const today = expires >= start && expires <= end || expires < start

                                return (
                                <div key={i} className='recentpatientdashcard' style={{border:'.3px solid red'}}>
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>{item?.name}</h4>
                                        {
                                            today ?
                                            <h4>Drugs Expired</h4>
                                            :
                                            <p>Drugs will expire {`${day}-${month}-${year}`}</p>
                                        }
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <MdNotificationImportant size={22} color='red' />
                                    </div>
                                </div>
                            )})
                        : null
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard