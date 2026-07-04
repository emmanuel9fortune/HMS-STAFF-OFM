import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import { addToCart, emptyCart, selectCartTotalPrice } from '../../features/cartSlice'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'
import { addToPay, removeFromPay, selectPayTotalPrice } from '../../features/paySlice'

function PayOut() {

    const ip = useSelector(selectip)

    const [service, setservice] = useState('')
    const [services, setservices] = useState('')

    useEffect(()=>{
    const controller = new AbortController()
        const func =async()=>{
        try{
            await axios.post(`http://${ip?.ip }:7700/getservices`, {signal: controller.signal}).then((res)=>{
            if(res.data.status === 'success'){
                setservices(res.data.services)
            }
            })
        }catch(error){
            //console.log(error)
        } 
        }
        func()
    return ()=> controller.abort()
    },[ip])

    const getPrice = services?.length > 0 ? services?.find((item)=> item?.name === service) : []
  
    const cartItems = useSelector(state => state.Pay.items);
    const [name, setname] = useState('')
    const [mode, setmode] = useState('')
    const [discount, setdiscount] = useState(0)

    const dispatch = useDispatch()
  
    const handleAddToCart = () => {
        const cartItem = {
            id: service,
            name: service,
            quantity: 1,
            price: getPrice?.price,
            totalPrice: 1 * getPrice?.price,
        };
        dispatch(addToPay(cartItem));
    };

    
    const handleRemove = (service) => {
        dispatch(removeFromPay(service));
    };
    
    const totalPrice = useSelector(selectPayTotalPrice);

    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const total = discount ? totalPrice - (totalPrice * discount)/100 : totalPrice

    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency', 
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(total);

    const handleCheckOut =async()=>{
        const getservices = {
            totalPrice: total,
            items: cartItems
        }
        const value ={
            name,
            mode,
            staffID: getid?._id,
            services: JSON.stringify(getservices),
        }
        try {
            await axios.post(`http://${ip?.ip }:7700/payout`, value).then((res)=>{     
                           
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    localStorage.removeItem('cart')
                    dispatch(emptyCart())
                    setname('')
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }

  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body'>
            <div className='payment_desk' >
                <div className='payment_desk_cart_fields' >
                    <div className='payment_desk_checkout'>
                        <div className='patient_details_input_field1_'>
                            <h4>SERVICE TYPE</h4>
                            <select value={service} onChange={(e)=> setservice(e.target.value)} >
                                <option >Select Service</option>
                                {[...services || []]?.sort((a, b)=> a?.name?.localeCompare(b?.name)).map((test, i) => (
                                    <option key={i} value={test.name}>
                                        {test.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                         
                        
                        <div className='cart_checkout_price' >
                            <h3 style={{margin:'20px 0', fontSize:'25px'}}>PRICE</h3>
                            <h3 style={{margin:'20px 0', fontSize:'25px'}}>{getPrice?.price}</h3>
                        </div>
                        
                        {
                            service &&
                            <button onClick={handleAddToCart} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >ADD SERVICE</button>
                        }
                    </div>
                </div>

                <div className='payment_desk_cart_fields' >
                    <div className='payment_desk_checkout'>
                        <div className='patient_details_input_field1_'>
                            <h4>PATIENT NAME</h4>
                            <input placeholder='Enter Patient Name' type='text' value={name} onChange={(e)=>setname(e.target.value)} />
                        </div>
                        <div className='patient_details_input_field1_' >
                            <h4>CHOOSE METHOD</h4>
                            <select value={mode} onChange={(e)=> setmode(e.target.value)} >
                                <option value=''>-- SELECT PAYMENT MODE ---</option>
                                <option value='cash' >-- CASH ---</option>
                                <option value='pos'>-- POS ---</option>
                                <option value='transfer'>-- TRANSFER ---</option>
                            </select>     
                        </div>   
                        
                        <div className='patient_details_input_field1_' >
                            <h3 style={{margin:'7px 0'}}>DISCOUNT</h3>
                            <select value={discount} onChange={(e)=>setdiscount(e.target.value)} >
                                <option>Select Discount</option>
                                <option value={5}>5%</option>
                                <option value={10}>10%</option>
                                <option value={20}>20%</option>
                                <option value={30}>30%</option>
                            </select>
                        </div>

                        {
                            cartItems?.length > 0 ?
                                cartItems?.map((item, i)=>{
                                    const formatted = new Intl.NumberFormat('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(item.price);
                                    return (
                                    <div key={i} style={{margin:'10px 0'}} className='cart_checkout_price' >
                                        <h4>{item?.name}</h4>
                                        <h4>{formatted}</h4>
                                        <button onClick={()=>handleRemove(item?.name)} ><FaTrash/> Delete</button>
                                    </div>
                                )})
                            : null
                        }
                        
                        <div className='cart_checkout_price' >
                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                            <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                        </div>

                        {
                            cartItems?.length > 0 && name && mode  &&
                            <button onClick={handleCheckOut} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PayOut