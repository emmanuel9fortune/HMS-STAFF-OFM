import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify'

function Expenses() {
    const ip = useSelector(selectip)

    const [name, setname] = useState('')
    const [receiver, setreceiver] = useState('')
    const [amount, setamount] = useState('')
    const [approve, setapprove] = useState('')
    const [purpose, setpurpose] = useState('')
    const [allowance, setallowance] = useState('')
    const [date, setdate] = useState('')
    const [date1, setdate1] = useState('')
    const [enddate, setenddate] = useState('')
    const [catalog, setcatalog] = useState('')
    const [xdate, setxdate] = useState('')
    const [staff, setstaff] = useState('')

    useEffect(()=>{
        const toady = new Date()
        const formattedDate = toady.toISOString().split('T')[0]
        setxdate(formattedDate)
        const setToday = new Date().setHours(0, 0, 0, 0)
        const now = Date.now()
        setdate1(setToday);
        setenddate(now);
    },[])

    const [count, setcount] = useState(0)
    const [reload, setreload] = useState(0)

    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const handleSubmit =async()=>{
        try {
            await axios.post(`http://${ip?.ip}:7700/expenses`, {staffID: getid?._id, name, receiver, amount, approve, purpose, date, allowance, catalog}).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('Expense Recorded Successfully')
                    setname('')
                    setreceiver('')
                    setamount('')
                    setapprove('')
                    setpurpose('')
                    setdate('')
                    setallowance('')
                    setcatalog('')
                    window.location.reload()
                }
            })
        } catch (error) {
            console.log(error);
        }
    } 

    const [getexpens, setgetexpens] = useState([])
    const [getstaff, setgetstaff] = useState([])

    useEffect(()=>{
        const func=async()=>{
            try {
                axios.post(`http://${ip?.ip}:7700/expenses/getexpenses`,{unix: date1, eunix: enddate, staff}).then((res)=>{                    
                    if(res.data.status === 'success'){
                        setgetexpens(res.data.expense)
                        setgetstaff(res.data.getStaffs)
                        setreload(0)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    }, [ip, reload, date1, enddate, staff])

    const handleDeleteExpense = (row) => async () => {
        try {
            await axios.post(`http://${ip?.ip}:7700/expenses/deleteexpense`, {id: row._id}).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('Expense Deleted Successfully')
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const [Total, setTotal] = useState()
    
    useEffect(()=>{
        let fsttotal = 0
        getexpens?.forEach(obj =>{ 
            fsttotal += obj.approve;
        })
        
        setTotal(fsttotal)
    },[getexpens])

    const totalFormatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    
    const handleDate = (e) => {
        const raw = e.target.value;
        setxdate(raw);

        const start = new Date(raw);
        const end = new Date(raw);
        end.setHours(23, 59, 59, 999);

        setdate1(start.getTime());
        setenddate(end.getTime());
    };

    const handlePeriod =(e) => {
        const raw = e.target.value;
        const now = Date.now()

        const DaysAgo = now - raw * 24 * 60 * 60 * 1000

        setdate1(DaysAgo);
        setenddate(now);
    }

    const [month, setmonth] = useState('')
    const [year, setyear] = useState('')

    const handlePeriodByMonth = async(e) => {
        const month = Number(e.target.value);
        const year = new Date().getFullYear();

        setmonth(month)
        setyear(year)

        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        setdate1(start);
        setenddate(end);
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${ip?.ip}:7700/expenses/month`, { year, month, id: staff})
        .then(res => {
            if (res.data.status === 'success') {
                setgetexpens(res.data.expense)
                setgetstaff(res.data.getStaffs)
            }
        });
    };

    const handleStaff = async(e) => {
        const staff = e.target.value

        setstaff(staff);
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${ip?.ip }:7700/expenses/getexpenses`, {staff, unix: date, eunix: enddate})
        .then(res => {
            // console.log(res);
            
            if (res.data.status === 'success') {
                setgetexpens(res.data.expense)
                setgetstaff(res.data.getStaffs)
            }
        });
    };

    const handleCatalog =async(e)=>{
        try {
            await axios.post(`http://${ip?.ip }:7700/expenses/catalog`, {catalog: e.target.value, year, month, id: staff})
            .then(res => {                
                // console.log(res);
                
                if (res.data.status === 'success') {
                    setgetexpens(res.data.expense)
                    setgetstaff(res.data.getStaffs)
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    
    const [utilities, setutilities] = useState([])

    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
          try {
            await axios.post(`http://${ip?.ip }:7700/getsubscriptions`, {signal: controller.signal}).then((res)=>{  
                // console.log(res);
                        
              if(res.data.status === 'success'){
                setutilities(res.data.diagnosis)
                setreload(0)
              }
            })
          } catch (error) {
            console.log(error); 
          }
        }
        func()
      return ()=> controller.abort()
      },[reload, ip])

  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body'>
            <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
                <button style={count !== 0 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>{setcount(0); setreload(reload + 1)}}>ENTER EXPENSES</button>
                <button style={count !== 1 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>{setcount(1); setreload(reload + 1)}}>VIEW EXPENSES</button>
            </div>

            {
                count === 0 &&
                <>
                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>EXPENSE DATE</h4>
                        <input placeholder='Enter Expense Date' type='date' value={date} onChange={(e)=>setdate(e.target.value)} />
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>STAFF NAME</h4>
                        <input placeholder='Enter Staff Name' type='text' value={name} onChange={(e)=>setname(e.target.value)} />
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>PURPOSE OF REQUEST</h4>
                        <input placeholder='Enter Purpose Of Request' type='text' value={purpose} onChange={(e)=>setpurpose(e.target.value)} />
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>AMOUNT REQUESTED</h4>
                        <input placeholder='Enter Amount Requested' type='number' value={amount} onChange={(e)=>setamount(e.target.value)} />
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>AMOUNT APPROVED</h4>
                        <input placeholder='Enter Amount Approved' type='number' value={approve} onChange={(e)=>setapprove(e.target.value)} />
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>ALLOWANCE</h4>
                        <input placeholder='Enter allowance' type='text' value={allowance} onChange={(e)=>setallowance(e.target.value)} />
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>RECEIVER NAME</h4>
                        <input placeholder='Enter Receiver Name' type='text' value={receiver} onChange={(e)=>setreceiver(e.target.value)} />
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'15px 0'}}>
                        <h4>CATALOG</h4>
                        <select value={catalog} onChange={(e)=> setcatalog(e.target.value)} >
                            <option>SELECT CATALOG</option>
                            <option value={"BACKLOG PAYMENT"}>BACKLOG PAYMENT</option>
                            <option value={"TRANSPORTATION & LOGISTICS"}>TRANSPORTATION & LOGISTICS</option>
                            <option value={"DRUGS & MEDICAL CONSUMABLES"}>DRUGS & MEDICAL CONSUMABLES</option>
                            <option value={"MEDICAL EQUIPMENTS"}>MEDICAL EQUIPMENTS</option>
                            <option value={"FUEL"}>FUEL</option>
                            <option value={"REPAIRS & MAINTENANCE"}>REPAIRS & MAINTENANCE</option>
                            <option value={"STAFF WELFARE & FEEDING"}>STAFF WELFARE & FEEDING</option>
                            <option value={"PATIENT WELFARE & REFUNDS"}>PATIENT WELFARE & REFUNDS</option>
                            <option value={"OFFICE EQUIPMENTS & ASSETS"}>OFFICE EQUIPMENTS & ASSETS</option>
                            <option value={"OFFICE STATIONARY & PRINTING"}>OFFICE STATIONARY & PRINTING</option>
                            <option value={"COMMUNICATION ICT"}>COMMUNICATION ICT</option>
                            <option value={"CLEANING, UTILITIES & GENERAL OPERATIONS"}>CLEANING, UTILITIES & GENERAL OPERATIONS</option>
                            <option value={"SALARY"}>SALARY</option>
                            {
                                utilities?.length > 0 ?
                                    utilities?.map((item, i)=> (
                                        <option key={i} value={item.name}>{item.name}</option>
                                    ))
                                : null
                            }
                        </select>
                    </div>

                    {
                        date === '' || name === '' || purpose === '' || amount === '' || approve === '' || receiver === '' ?
                        <button disabled style={{margin: '20px 0', width:'100%', backgroundColor:'grey', cursor:'not-allowed'}} className='custome_table_btn2' >APPROVE REQUEST</button>
                        :
                        <button onClick={handleSubmit} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >APPROVE REQUEST</button>
                    }
                    
                </>
            }
            {
                count === 1 &&
                <>
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
                                <h4>CHOOSE CATALOG</h4>
                                <select onChange={handleCatalog} >
                                    <option>SELECT CATALOG</option>
                                    <option value={"BACKLOG PAYMENT"}>BACKLOG PAYMENT</option>
                                    <option value={"TRANSPORTATION & LOGISTICS"}>TRANSPORTATION & LOGISTICS</option>
                                    <option value={"DRUGS & MEDICAL CONSUMABLES"}>DRUGS & MEDICAL CONSUMABLES</option>
                                    <option value={"MEDICAL EQUIPMENTS"}>MEDICAL EQUIPMENTS</option>
                                    <option value={"FUEL"}>FUEL</option>
                                    <option value={"REPAIRS & MAINTENANCE"}>REPAIRS & MAINTENANCE</option>
                                    <option value={"STAFF WELFARE & FEEDING"}>STAFF WELFARE & FEEDING</option>
                                    <option value={"PATIENT WELFARE & REFUNDS"}>PATIENT WELFARE & REFUNDS</option>
                                    <option value={"OFFICE EQUIPMENTS & ASSETS"}>OFFICE EQUIPMENTS & ASSETS</option>
                                    <option value={"OFFICE STATIONARY & PRINTING"}>OFFICE STATIONARY & PRINTING</option>
                                    <option value={"COMMUNICATION ICT"}>COMMUNICATION ICT</option>
                                    <option value={"CLEANING, UTILITIES & GENERAL OPERATIONS"}>CLEANING, UTILITIES & GENERAL OPERATIONS</option>
                                    <option value={"SALARY"}>SALARY</option>
                                    {
                                        utilities?.length > 0 ?
                                            utilities?.map((item, i)=> (
                                                <option key={i} value={item.name}>{item.name}</option>
                                            ))
                                        : null
                                    }
                                </select>
                            </div>
                            
                            <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                                <h4>CHOOSE STAFF</h4>
                                <select onChange={handleStaff} >
                                    <option value={''} >SELECT STAFF</option>
                                    {
                                        getstaff?.length > 0 &&
                                        getstaff?.map((itm, i)=>(
                                            <option value={itm?._id} key={i} >{itm?.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <h3 style={{color:'green', margin:'20px 0'}} >Total Expenses {totalFormatted.format(Total)}</h3>
                    <table className='custome_table'>
                        <thead>
                        <tr>
                            <th>DATE</th>
                            <th>STAFF NAME</th>
                            <th>PURPOSE OF REQUEST</th>
                            <th>AMOUNT REQUESTED</th>
                            <th>AMOUNT APPROVED</th>
                            <th>ALLOWANCE</th>
                            <th>RECEIVER NAME</th>
                            <th>STAFF NAME</th>
                            <th>CATALOGUE</th>
                            <th>ACTION</th>
                        </tr>
                        </thead>

                        <tbody>                  
                            {getexpens?.map((row, index) => {

                                const staffname = getstaff.find((staff) => staff._id === row.staffID);

                                return (
                                    <tr key={index}>
                                        <td><p>{row?.date}</p></td>
                                        <td><p>{row?.name}</p></td>
                                        <td><p>{row?.purpose}</p></td>
                                        <td><p>{row?.amount}</p></td>
                                        <td><p>{row?.approve}</p></td>
                                        <td><p>{row?.allowance}</p></td>
                                        <td><p>{row?.receiver}</p></td>
                                        <td><p>{staffname?.name}</p></td>
                                        <td><p>{row?.catalog}</p></td>
                                        <td>
                                        <button className='delete_btn' onClick={handleDeleteExpense(row)} >Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
            }
        </div>
    </div>
  )
}

export default Expenses