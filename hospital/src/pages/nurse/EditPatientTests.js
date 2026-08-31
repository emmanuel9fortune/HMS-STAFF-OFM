import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify';
import { selectfid } from '../../features/fidSlice';
import { useRef } from 'react';
import Pagination from '../../components/Pagination';

function EditPatientTests({ handleBack, currentIndex, setcurrentIndex }) {
  //axios.defaults.withCredentials = true;
  const ip = useSelector(selectip)

  const id = useSelector(selectid);
      const fid = useSelector(selectfid);
      const uid = fid?.id || id?.id;

  const staffID = sessionStorage.getItem('staffID');
  const getDep = JSON.parse(staffID);

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const controller = new AbortController()
    const fetchVitals = async () => {
      try {
        const res = await axios.post(`http://${ip?.ip }:7700/getvitals`, { uid: uid, signal: controller.signal });
        
        if (res.data.status === 'success') {
          const vitals = res.data.vitals?.vitals || [];
          // console.log(vitals);
          
          const formatted = vitals.length > 0
            ? vitals.map(item => ({
                _id: item?._id ,
                date: item?.date || new Date().getTime(),
                BP: item?.BP || '',
                pulse: item?.pulse || '',
                repiratory: item?.repiratory || '',
                temperature: item?.temperature || '',
                weight: item?.weight || '',
                height: item?.height || '',
                BMI: item?.BMI || '', 
                spo: item?.spo || '',
                oxygen: item?.oxygen || '',
                RBS: item?.RBS || '',
                staffID: item?.staffID, 
              }))
            : [{
                date: new Date().getTime(),
                BP: '',
                pulse: '',
                repiratory: '',
                temperature: '',
                weight: '',
                height: '',
                BMI: '',
                spo: '',
                oxygen: '',
                RBS: '',
                staffID: getDep?.name,
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

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = [...prev];
      updated[index][name] = value;
      const weight = name === 'weight' ?
      value : 
      updated[index].weight
      const height = updated[index].height
      updated[index].BMI = weight / (height * height)

      return updated;
    });
  };

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

  const containerRef = useRef(null);

  const addRow = () => {
    setCurrentPage(1)
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setFormData(prev => [
      ...prev,
      {
        date: new Date().getTime(),
        BP: '',
        pulse: '',
        repiratory: '',
        temperature: '',
        weight: '',
        height: '',
        BMI: '',
        spo: '',
        oxygen: '',
        RBS: '',
        staffID: getDep?.name,
      },
    ]);
  };

  const removeRow = async({ index, id }) => {
    if (formData.length === 1) {
      return toast.error('At least one row is required.');
    }

    if(!id){
      setFormData(PRev => PRev.filter((_, i) => i !== index));
      toast.success('Entry deleted');
    }else{
      await axios.post(`http://${ip?.ip}:7700/deleteVitals`, { uid: uid, id })
      .then(res => {
        if(res.data.status === 'success'){
          toast.success('Entry deleted');
          setFormData(PRev => PRev.filter((_, i) => i !== index));
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Error deleting entry');
      });
    }

  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://${ip?.ip }:7700/setvitals`, {
        uid: uid,
        formFields: formData,
      });
      if (res.data.status === 'success') {
        toast.success('Upload successful');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const isMobileDevice = window.innerWidth <= 768   

  return (
    <div className="dashboard_body" ref={containerRef} style={isMobileDevice ? {width:'100%', padding:'5px'} : {}}>
      <div className="back_btn_" onClick={handleBack}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>
        <div className='dashboard_body_patient_details_btns' style={isMobileDevice ? {width:'100%', padding:'5px', flexWrap:'nowrap', display:'flex', flexDirection:'row'} : {}}>
            <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
            <button className={currentIndex === 2 && 'dashboard_body_patient_details_btns_'}>PATIENT VITALS</button> 
            <button onClick={()=>setcurrentIndex(3)}>UTILITIES | CONSUMABLES</button>
            <button onClick={()=>setcurrentIndex(4)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setcurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button>
            <button onClick={()=>setcurrentIndex(7)}>URINE CHART</button>
            <button onClick={()=>setcurrentIndex(8)}>PATIENT RECENT BILLS</button>
        </div>
      <h2 style={{margin:'10px 0'}} >PATIENT VITALS</h2> 
      <p className="custome_table_guide">
        Edit table details, click Add to add new row, then click "Save changes".
      </p>
      
      <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', margin:'30px 0'}} >
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />        
      </div>

      {
        currentItems?.length > 6 ?
          <div className="custome_table_btn">
            <button className="custome_table_btn1" onClick={addRow}>ADD</button>
            <button className="custome_table_btn2" onClick={handleSubmit}>SAVE CHANGES</button>
          </div>
        : null
      }

      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>B.P. (mmHg) </th>
            <th>PULSE (B/M)</th>
            <th>REPIRATORY RATE (c/m) </th>
            <th>TEMPERATURE (C°)</th>
            <th>HEIGHT (m) </th>
            <th>WEIGHT (kg) </th>
            <th>BMI (kg/m²) </th>
            <th>SPO² (%)</th>
            <th>OXYGEN</th>
            <th>RBS</th>
            <th>SIGN</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody >
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
              const minutes = date.getUTCMinutes();
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12 || 12;


              const pad = (n) => n.toString().padStart(2, "0");
              timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`;
            }

            return (
            <tr key={index}  >
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px'}} >{day} | {month} | {year}</p>
                    <p>{timeString}</p>
                </div>
              </td>
              <td>
                  <input 
                    name="BP" 
                    style={gethighs || getlowss ? {color: 'red'} : {}} 
                    value={row.BP} 
                    onChange={e => 
                    handleChange(row.originalIndex, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="pulse" 
                    type='number' 
                    style={row.pulse >= 100 || row.pulse <= 60 ? {color: 'red'} : {}} 
                    value={row.pulse} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details" 
                  />
              </td>
              <td>
                  <input 
                  name="repiratory"
                  type='number'
                  style={row.repiratory >= 25 || row.repiratory <= 12 ? {color: 'red'} : {}} 
                  value={row.repiratory} 
                  onChange={e => 
                  handleChange(row.originalIndex, e)} 
                  placeholder="details" />
              </td>
              <td>
                  <input 
                    name="temperature" 
                    type='number' 
                    style={row.temperature >= 37 || row.temperature <= 35 ? {color: 'red'} : {}} 
                    value={row.temperature} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details"     
                  />
              </td>
              <td>
                  <input 
                    name="height" 
                    type='number'
                    value={row.height} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details"   
                  />
              </td>
              <td>
                <div className='test_nurse'>
                  <input 
                    name="weight" 
                    type='number'
                    value={row.weight} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details"   
                  />
                </div>
                <div className='test_nurse' >
                  <p>{row.weight * 2.205}</p>
                  <p style={{margin:'15px'}} >Pound</p>
                </div>
              </td>
              <td>
                  <input 
                    name="BMI" 
                    value={row.BMI} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="spo"
                    type='number'
                    style={row.spo >= 100 || row.spo <= 88 ? {color: 'red'} : {}} 
                    value={row.spo} 
                    onChange={e => 
                    handleChange(row.originalIndex, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="oxygen"
                    type='number'
                    value={row.oxygen} 
                    onChange={e => 
                    handleChange(row.originalIndex, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                  name="RBS"
                  value={row.RBS} 
                  onChange={e => 
                  handleChange(row.originalIndex, e)} 
                  placeholder="details" />
              </td>
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px', wordBreak: 'break-all'}} >{row.staffID}</p>
                </div>
              </td>
              <td>
                <button className="delete_btn" onClick={() => removeRow({ index: row.originalIndex, id: row?._id })}>
                  Delete
                </button>
              </td>
            </tr>
          )}
          )}
        </tbody>
      </table>

      
      <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', margin:'30px 0'}} >
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />        
      </div>


      <div className="custome_table_btn">
        <button className="custome_table_btn1" onClick={addRow}>ADD</button>
        <button className="custome_table_btn2" onClick={handleSubmit}>SAVE CHANGES</button>
      </div>
    </div>
  );
}

export default EditPatientTests;
