import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { selectip } from '../../features/ipSlice'
import { setfids } from '../../features/fidSlice';
import { useParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';

function Vitals({handleBack, setCurrentIndex, currenIndex}) {
    //axios.defaults.withCredentials = true

      const ip = useSelector(selectip)
      
      const {id} = useParams()

      const uid = id;
    
      const staffID = sessionStorage.getItem('staffID');
      const getDep = JSON.parse(staffID);
    
      const [formData, setFormData] = useState([]);

      
    
      useEffect(() => {
        const controller = new AbortController()
        const fetchVitals = async () => {
          try {
            const res = await axios.post(`http://${ip?.ip }:7700/getvitals`, { uid, signal: controller.signal });
            if (res.data.status === 'success') {
              const vitals = res.data.vitals?.vitals || [];
              
            const formatted = vitals.length > 0
              ? vitals.map(item => ({
                  _id: item?._id,
                  date: item?.date || '',
                  BP: item?.BP || '',
                  pulse: item?.pulse || '',
                  repiratory: item?.repiratory || '',
                  temperature: item?.temperature || '',
                  weight: item?.weight || '',
                  height: item?.height || '',
                  BMI: item?.BMI || '',
                  spo: item?.spo || '',
                  RBS: item?.RBS || '',
                  staffID: item?.staffID || getDep?._id, 
                }))
              : [{
                  date: '',
                  BP: '',
                  pulse: '',
                  repiratory: '',
                  temperature: '',
                  weight: '',
                  height: '',
                  BMI: '',
                  spo: '',
                  RBS: '',
                  staffID: getDep?._id,
                }];
    
              setFormData(formatted);
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        if (uid) fetchVitals();
        return ()=> controller.abort()
      }, [uid]);

      
    const dispatch = useDispatch()

    const handleView =(id)=>{
        dispatch(
            setfids({
                id:''
            })
        )
        window.history.back()
    }

    const [currentPage, setCurrentPage] = useState(1)
      
    const itemsPerPage = 10;
  
    const reversedData = [...formData].reverse()
  
    const totalPages = Math.ceil(reversedData.length / itemsPerPage)
  
    const startIndex = (currentPage - 1)*itemsPerPage;
    const currentItems = reversedData
    .slice(startIndex, startIndex + itemsPerPage)
    .map(row => ({
      ...row,
      originalIndex: formData.findIndex(item => item === row)
    }));

  return (
      <div className='dashboard_body' style={{width:'100%', marginTop:'100px'}}>
          
          <div className='back_btn_' onClick={handleView}>
              <FaChevronLeft />
              <h4>BACK</h4>
          </div>
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setCurrentIndex(0)}>PATIENT DETAILS</button>
            <button className={currenIndex === 1 && 'dashboard_body_patient_details_btns_'} >VITALS</button>
            <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setCurrentIndex(3)}>PRESCRIPTION</button>
            <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setCurrentIndex(4)}>TRANSACTION HISTORY</button>
            <button onClick={()=>setCurrentIndex(6)}>URINE CHART</button>
            <button onClick={()=>setCurrentIndex(7)}>UTILITIES | CONSUMABLES</button>
            
        </div>
          <p className='custome_table_guide'>Edit table details, Click Add button to add new table row and Click the button "Save changes" to save</p>
          
      <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', margin:'30px 0'}} >
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />        
      </div>

      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>B.P.</th>
            <th>PULSE</th>
            <th>REPIRATORY RATE</th>
            <th>TEMPERATURE</th>
            <th>HEIGHT</th>
            <th>WEIGHT</th>
            <th>BMI</th>
            <th>SPO²</th>
            <th>RBS</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, index) => {
            
            const getBPhigh = ( input, high='120/80' )=>{
              const [refh, refhdia] = high.split('/').map(Number)
              const [refin, refindia] = input.split('/').map(Number)

              return refin > refh || (refin === refhdia && refindia > refhdia)
            }

            const getBPlow = ( input, low = '90/60' )=>{
              const [refl, refldia] = low.split('/').map(Number)
              const [refin, refindia] = input.split('/').map(Number)

              return refin < refl || (refin === refldia && refindia < refldia)
            }

            const gethighs = getBPhigh(row.BP)
            const getlowss = getBPlow(row.BP)


            function parseDateValue(value) {
              if (!value) return null;
              if (!isNaN(value) && value.toString().length > 10)
                return new Date(Number(value)); // timestamp
              if (/^\d{4}-\d{2}-\d{2}$/.test(value))
                return new Date(`${value}T00:00:00Z`); // YYYY-MM-DD
              const date = new Date(value);
              return isNaN(date.getTime()) ? null : date;
            }

            const date = parseDateValue(row?.date);

            let day = "--",
              month = "--",
              year = "--",
              timeString = "--:-- --";

            if (date && !isNaN(date.getTime())) {
              day = date.getDate();
              month = date.getMonth() + 1;
              year = date.getFullYear();

              let hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12 || 12;

              const pad = (n) => n.toString().padStart(2, "0");
              timeString = `${pad(hours)}:${pad(minutes)} ${ampm} `;
            }


            return(
            <tr key={index} >
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px'}} >{day} | {month} | {year}</p>
                    <p>{timeString}</p>
                </div>
              </td>
              <td>
                  <p style={gethighs || getlowss ? {color: 'red'} : {}}  >{row.BP} mmHg</p>
              </td>
              <td>
                  <p style={row.pulse >= 100 || row.pulse <= 60 ? {color: 'red'} : {}} >{row.pulse} B/M</p>
              </td>
              <td>
                <p>{row.repiratory} c/m</p>
              </td>
              <td>
                  <p style={row.temperature >= 37 || row.temperature <= 35 ? {color: 'red'} : {}} >{row.temperature} C°</p>
              </td>
              <td>
                  <p>{row.height} m</p>
              </td>
              <td>
                  <p>{row.weight} kg
                  <br/>
                  <small>{row.weight * 2.205} Pound</small>
                  </p>
              </td>
              <td>
                <p>{row.BMI} kg/m²</p>
              </td>
              <td>
                <p>{row.spo} %</p>
              </td>
              <td>
                <p>{row.RBS} mg/dl</p>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
      <div style={{height:'700px', width:'100%'}}></div>
      <div style={{height:'700px', width:'100%'}}></div>
      </div>
  )
}

export default Vitals