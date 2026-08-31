import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'

function Audit() {
    const ip = useSelector(selectip)

    const [getPending, setgetPending] = useState([])
    const [getComplete, setgetComplete] = useState([])
    const [getPatient, setgetPatient] = useState([])
    const [mode, setmode] = useState('')
    const [date, setdate] = useState('')
    const [enddate, setenddate] = useState('')
    const [xdate, setxdate] = useState('')
    const [expenses, setexpenses] = useState([])
    const [staffs, setstaffs] = useState([])
    const [staff, setstaff] = useState('')

    useEffect(()=>{
        const toady = new Date()
        const formattedDate = toady.toISOString().split('T')[0]
        setxdate(formattedDate)
        const setToday = new Date().setHours(0, 0, 0, 0)
        const now = Date.now()
        setdate(setToday);
        setenddate(now);
    },[])

    const [sort, setsort] = useState('')

    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{            
            try {
                await axios.post(`http://${ip?.ip}:7700/audit`, {unix: date, eunix: enddate, sorts: sort, mode, staff, signal: controller.signal}).then((res)=>{
                    console.log(res);
                    
                    if(res.data.status === 'success'){
                        setgetPending(res.data.pendingBills)
                        setgetPatient(res.data.getPatients)
                        setgetComplete(res.data.paidBlls)
                        setexpenses(res.data.expense)
                        setstaffs(res.data.staffs)
                    }
                })
            } catch (error) {
                //console.log(error);
            }
        }
        func()
        return ()=> controller.abort()
    },[date, enddate, ip, sort, mode, staff])

    const handleDate = (e) => {
        const raw = e.target.value;
        setxdate(raw);

        const start = new Date(raw);
        const end = new Date(raw);
        end.setHours(23, 59, 59, 999);

        setdate(start.getTime());
        setenddate(end.getTime());
    };

    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        let total = 0;

        getComplete?.forEach((entry) => {
            try {
            const parsed = JSON.parse(entry.services);

            // Case 1: Array (lab services)
            if (Array.isArray(parsed)) {
                parsed.forEach(service => {
                if (service.totalPrice) {
                    total += service.totalPrice;
                } else if (service.price) {
                    total += service.price;
                }
                });

            // Case 2: Object with .items (pharmacy)
            }else if (parsed && typeof parsed === 'object') {
                if (parsed.totalPrice) {
                total += parsed.totalPrice;
                } else if (parsed.actualPrice) {
                total += parsed.actualPrice;
                } else if (parsed.price) {
                total += parsed.price;
                }
            }


            } catch (e) {
            console.warn(`Invalid JSON in services for ID ${entry._id}`);
            }
        });

        setTotalPrice(total);
    }, [getComplete]); 


    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //

    const [totalPrice1, setTotalPrice1] = useState(0)

    useEffect(() => {
        let total = 0;

        getPending.forEach(entry => {
            try {
            const parsed = JSON.parse(entry.services);

            // Case 1: Single object (e.g. scan)
            if (!Array.isArray(parsed) && parsed?.price) {
                total += parsed.price;

            // Case 2: Array of lab services
            } else if (Array.isArray(parsed)) {
                parsed.forEach(service => {
                if (service.price) {
                    total += service.price;
                }
                });

            // Case 3: Pharmacy with .items array
            } 

            } catch (e) {
            console.warn(`Failed to parse services for ID ${entry._id}`);
            }
        });

        setTotalPrice1(total);
    }, [getPending]);

    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //
    
    const totalFormatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
    

    const handlePeriod =(e) => {
        const raw = e.target.value;
        const now = Date.now()

        const DaysAgo = now - raw * 24 * 60 * 60 * 1000

        setdate(DaysAgo);
        setenddate(now);
    }

    const handleService=(e)=>{
        setsort(e.target.value)
    }

    const handlePeriodByMonth = async(e) => {
        const month = Number(e.target.value);
        const year = new Date().getFullYear();

        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        setdate(start);
        setenddate(end);
        setsort(prev => prev); // ensure sort is preserved
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${ip?.ip }:7700/audit/month`, { year, month, sorts: sort })
        .then(res => {
            if (res.data.status === 'success') {
                setgetPending(res.data.pendingBills);
                setgetPatient(res.data.patients);
                setgetComplete(res.data.paidBills);
                setstaffs(res.data.staffs)
            }
        });
    };

    const handleStaff = async(e) => {
        const staff = e.target.value

        setstaff(staff);
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${ip?.ip }:7700/audit`, {staff, unix: date, eunix: enddate, sorts: sort, mode})
        .then(res => {
            console.log(res);
            
            if (res.data.status === 'success') {
                setgetPending(res.data.pendingBills);
                setgetPatient(res.data.patients);
                setgetComplete(res.data.paidBills);
                setstaffs(res.data.staffs)
            }
        });
    };

  
    const [cardTotal, setcardTotal] = useState()
    const [consultationTotal, setconsultationTotal] = useState()
    const [othersTotal, setothersTotal] = useState()
    const [utilsTotal, setutilsTotal] = useState()
    const [consumeTotal, setconsumeTotal] = useState()
    const [docTotal, setdocTotal] = useState()

    
    useEffect(()=>{
        let fsttotal = 0
        let sectotal = 0
        let trdtotal = 0
        let frttotal = 0
        let fiftotal = 0
        let sixtotal = 0

        getComplete?.forEach(obj =>{
            const items = JSON.parse(obj.services)
            
            items?.items?.forEach(item => {
                const name = item?.name ? item?.name?.toLowerCase() : item?.drugs?.toLowerCase()
                
                if(name.includes('card')){
                    fsttotal += item?.totalPrice
                }else if(name.includes('consultation')){
                    sectotal += item?.totalPrice
                }else if(items?.profit === 0 && items?.actualPrice === 0){
                    frttotal += item?.price * item?.quantity
                }else if(items?.profit !== 0 && items?.actualPrice !== 0 && sort === 'consumables'){
                    fiftotal += item?.price * item?.quantity
                }else if(sort === 'drugs' && item?.day){
                    sixtotal += item?.totalPrice
                }else{
                    if (item.totalPrice) {
                        trdtotal += item.totalPrice;
                    } else if (item.actualPrice) {
                        trdtotal += item.actualPrice;
                    } else if (item.price) {
                        trdtotal += item.price;
                    }
                }
            })
        })
        
        setcardTotal(fsttotal)
        setutilsTotal(frttotal)
        setconsumeTotal(fiftotal)
        setconsultationTotal(sectotal)
        setothersTotal(trdtotal)
        setdocTotal(sixtotal)
    },[getComplete, sort])

    
    const [Total, setTotal] = useState()
    
    useEffect(()=>{
        let fsttotal = 0
        expenses?.forEach(obj =>{ 
            fsttotal += obj.approve;
        })
        
        setTotal(fsttotal)
    },[expenses])
    
  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body' >
            <h3>COMPLETED TRANSACTION HISTORY</h3>

            <div style={{display:'flex', alignItems:'center', width:'100%'}}>
                <div className='patient_details_input_field1_in_' >
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE DATE</h4>
                        <input value={xdate} onChange={handleDate} type='date' />
                    </div>  
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE PERIOD</h4>
                        <select onChange={handlePeriod} >
                            <option value={7} >SELECT PERIOD</option>
                            <option value={7} >LAST WEEK</option>
                            <option value={31} >LAST MONTH </option>
                            <option value={62}>LAST TWO MONTH</option>
                            <option value={186}>LAST SIX MONTHS</option>
                            <option value={356}>YEAR</option>
                        </select>
                    </div>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE STAFF</h4>
                        <select onChange={handleStaff} >
                            <option value={''} >SELECT STAFF</option>
                            {
                                staffs?.length > 0 &&
                                staffs?.map((itm, i)=>(
                                    <option value={itm?._id} key={i} >{itm?.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE MONTH</h4>
                        <select onChange={handlePeriodByMonth} >
                            <option value={1}>SELECT MONTH</option>
                            <option value={1}>JANUARY</option>
                            <option value={2}>FEBUARY</option>
                            <option value={3}>MARCH</option>
                            <option value={4}>APRIL</option>
                            <option value={5}>MAY</option>
                            <option value={6}>JUNE</option>
                            <option value={7}>JULY</option>
                            <option value={8}>AUGUST</option>
                            <option value={9}>SEPTEMBER</option>
                            <option value={10}>OCTOBER</option>
                            <option value={11}>NOVEMBER</option>
                            <option value={12}>DECEMBER</option>
                        </select>

                    </div>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE SERVICES</h4>
                        <select onChange={handleService} >
                            <option value={''}>ALL</option>
                            <option value={'drugs'} >DRUGS</option>
                            <option value={'utils'}>UTILITIES </option>
                            <option value={'consumables'}>CONSUMABLES</option>
                            <option value={'cards'}>CARDS</option>
                            <option value={'consultation'}>CONSULTATIONS</option>
                            <option value={'lab'} >TESTS</option>
                            <option value={'scan'}>SCANS</option>
                            <option value={'payout'}>PAY OUTS</option>
                        </select>
                    </div>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>MODE OF PAYMENT</h4>
                        <select onChange={(e)=> setmode(e.target.value)} >
                            <option value={''}>ALL</option>
                            <option value={'pos'} >POS</option>
                            <option value={'transfer'}>TRANSFER </option>
                            <option value={'cash'}>CASH</option>
                            <option value={'CHURCH'}>CHURCH</option>
                        </select>
                    </div>
                </div>
            </div>


            <div style={{padding:'10px 0', borderBottom:'.3px solid #c3c3c3', color:'green'}}>
                {
                    sort === 'cards' ?
                        <h4>Total Income Made {totalFormatted.format(cardTotal)}</h4>
                    : sort === 'consultation' ?
                        <h4>Total Income Made {totalFormatted.format(consultationTotal)}</h4>
                    : sort === 'drugs' ?
                        <h4>Total Income Made {totalFormatted.format(othersTotal)}</h4>
                    : sort === 'utils' ?
                        <h4>Total Income Made {totalFormatted.format(utilsTotal)}</h4>
                    : sort === 'consumables' ?
                        <h4>Total Income Made {totalFormatted.format(consumeTotal)}</h4>
                    : sort === 'drugs' ?
                        <h4>Total Income Made {totalFormatted.format(docTotal)}</h4>
                    : <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                        <h4 style={{margin:'0 10px'}}>Total Income Made {totalFormatted.format(totalPrice)}</h4>
                        <h4 style={{color:'red', margin:'0 10px'}}>Total Expenses {totalFormatted.format(Total)}</h4>
                        <h4 style={{margin:'0 10px'}}>Total Profit {totalFormatted.format(totalPrice - Total)}</h4>
                    </div>
                }
            </div>      

            <table className='custome_table'>
                <thead>
                <tr>
                    <th>TIME</th>
                    <th>Patient Name</th>
                    <th>PURPOSE OF PAYMENT</th>
                    <th>AMOUNT PAID</th>
                    <th>MODE OF PAID</th>
                </tr>
                </thead>
            {   
                getComplete?.length > 0 ?
                getComplete?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{

                    if(item?.type !== 'lab' && item?.type !== 'scan' && item?.type ){
                        
                        const getBill = JSON.parse(item?.services)

                        const formatted = new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })

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

                        const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                        const getcard = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('card'))
                        const getconsult = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('consultation'))
                        const getdrugs = getBill?.items?.filter((items)=> !items?.name?.toLowerCase().includes('consultation') && !items?.name?.toLowerCase().includes('card'))

                        if(getcard?.length > 0 && sort === 'cards'){
                            return(
                                <tbody key={i}>
                                    <tr>
                                        
                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                        <td><p>{item?.name || patient?.name}</p></td>
                                        <td>
                                            {getBill?.items?.map((items, index) => (
                                                <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                            ))}
                                        </td>
                                        <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                        <td><p>{item?.mode}</p></td>
                                    </tr>
                                </tbody>
                            )  
                        }else if(getconsult?.length > 0 && sort === 'consultation'){
                            return(
                                <tbody key={i}>
                                    <tr>
                                        
                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                        <td><p>{item?.name || patient?.name}</p></td>
                                        <td>
                                            {getBill?.items?.map((items, index) => (
                                                <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                            ))}
                                        </td>
                                        <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                        <td><p>{item?.mode}</p></td>
                                    </tr>
                                </tbody>
                            )  
                        }else if(sort === 'payout'){
                            return(
                                <tbody key={i}>
                                    <tr>
                                        
                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                        <td><p>{item?.name || patient?.name}</p></td>
                                        <td>
                                            {getBill?.items?.map((items, index) => (
                                                <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                            ))}
                                        </td>
                                        <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                        <td><p>{item?.mode}</p></td>
                                    </tr>
                                </tbody>
                            )  
                        }else if(getdrugs?.length > 0 && sort === 'drugs' && item?.doctorID){
                            return(
                                <tbody key={i}>
                                    <tr>
                                        
                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                        <td><p>{item?.name || patient?.name}</p></td>
                                        <td>
                                            {getBill?.items?.map((items, index) => (
                                                <span key={index} style={{margin:'2px 0'}}>{items?.name || items?.drugs}, </span>
                                            ))}
                                        </td>
                                        <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                        <td><p>{item?.mode}</p></td>
                                    </tr>
                                </tbody>
                            )  
                        }else if(sort === 'utils' && getBill?.profit === 0){
                            return(
                                <tbody key={i}>
                                    <tr>
                                        
                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                        <td><p>{item?.name || patient?.name}</p></td>
                                        <td>
                                            {getBill?.items?.map((items, index) => (
                                                <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                            ))}
                                        </td>
                                        <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                        <td><p>{item?.mode}</p></td>
                                    </tr>
                                </tbody>
                            )  
                        }else if(sort === 'consumables' && getBill?.profit !== 0){
                            return(
                                <tbody key={i}>
                                    <tr>
                                        
                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                        <td><p>{item?.name || patient?.name}</p></td>
                                        <td>
                                            {getBill?.items?.map((items, index) => (
                                                <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                            ))}
                                        </td>
                                        <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                        <td><p>{item?.mode}</p></td>
                                    </tr>
                                </tbody>
                            )  
                        }else if(sort === ''){
                            return(
                                <tbody key={i}>
                                    <tr>
                                        
                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                        <td><p>{item?.name || patient?.name}</p></td>
                                        <td>
                                            {getBill?.items?.map((items, index) => (
                                                <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                            ))}
                                        </td>
                                        <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                        <td><p>{item?.mode}</p></td>
                                    </tr>
                                </tbody>
                            )  
                        }else{
                            return null
                        }

                                            
                    }else if(item?.type === 'lab'){
                        const getBill = JSON.parse(item?.services) 
                        const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                        const formatted5 = new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(getTotal);


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
                        const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 
                        return(
                            <tbody key={i}>
                                <tr>
                                    
                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                    <td><p>{item?.name || patient?.name}</p></td>
                                    <td>
                                        {   getBill?.length > 0 &&
                                            getBill?.map((items, index) => (
                                                <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                            ))
                                        }
                                    </td>
                                    <td><p>{formatted5}</p></td>
                                    <td><p>{item?.mode}</p></td>
                                </tr>
                            </tbody>
                        ) 
                    }else if(item.type === 'scan'){
                        const getBill = JSON.parse(item?.services) 
                        const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : getBill?.price

                        const formatted5 = new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(getTotal);
                        
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
                        const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                        return(
                            <tbody key={i}>
                                <tr>
                                    
                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                    <td><p>{item?.name || patient?.name}</p></td>
                                    <td>
                                        <div>
                                            {   getBill?.length > 0 ?
                                                getBill?.map((items, index) => (
                                                    <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                ))
                                                :
                                                <span>{getBill?.testname}</span>
                                            }
                                        </div>
                                    </td>
                                    <td><p>{formatted5}</p></td>
                                    <td><p>{item?.mode}</p></td>
                                </tr>
                            </tbody>
                        )  
                    }
                })
                : null
            }
            </table>
        </div>
    </div>
  )
}

export default Audit