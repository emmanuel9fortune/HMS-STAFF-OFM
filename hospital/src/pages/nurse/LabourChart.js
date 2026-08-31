import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify';

function LabourChart() {
  //axios.defaults.withCredentials = true;
  const ip = useSelector(selectip)

  const id = useSelector(selectid);
  const uid = id?.id;

  const staffID = sessionStorage.getItem('staffID');
  const getDep = JSON.parse(staffID);

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const controller = new AbortController()
    const fetchVitals = async () => {
      try {
        const res = await axios.post(`http://${ip?.ip }:7700/labourChart`, { uid, signal: controller.signal });        
        
        if (res.data.status === 'success') {
          const vitals = res.data.labour?.labour || [];

          const formatted = vitals.length > 0
            ? vitals.map(item => ({
                _id: item?._id ,
                date: item?.date || new Date().getTime(),
                BP: item?.BP || '',
                PR: item?.PR || '',
                RR: item?.RR || '',
                temperature: item?.temperature || '',
                contraction: item?.contraction || '',
                intensity: item?.intensity || '',
                FHR: item?.FHR || '',
                VE: item?.VE || '',
                staffID: item?.staffID || getDep?.name, 
              }))
            : [{
                date: new Date().getTime(),
                BP: '',
                PR: '',
                RR: '',
                temperature: '',
                contraction: '',
                intensity: '',
                FHR: '',
                VE: '',
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
    setFormData(PRev => {
      const updated = [...PRev];
      updated[index][name] = value;

      return updated;
    });
  };

  const addRow = () => {
    setFormData(PRev => [
      ...PRev,
      {
        date: new Date().getTime(),
        PR: '',
        RR: '',
        temperature: '',
        contraction: '',
        intensity: '',
        BP: '',
        FHR: '',
        staffID: getDep?.name,
      },
    ]);
  };

  const removeRow = async({ index, id}) => {
    if (formData.length === 1) {
      return toast.error('At least one row is required.');
    }

    if(!id){
      setFormData(PRev => PRev.filter((_, i) => i !== index));
    }else{
      await axios.post(`http://${ip?.ip}:7700/deleteLabour`, { uid, id })
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

  const handleSuFHRt = async () => {
    try {
      const res = await axios.post(`http://${ip?.ip }:7700/AddLabour`, {
        uid,
        formFields: formData,
      });
      if (res.data.status === 'success') {
        toast.success('Upload successful');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h2 style={{margin:'10px 0'}} >LABOUR CHART</h2> 
      <p className="custome_table_guide">
        Edit table details, click Add to add new row, then click "Save changes".
      </p>
      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>B.P. (mmHg) </th>
            <th>PR</th>
            <th>RR</th>
            <th>TEMPERATURE (C°)</th>
            <th>CONTRACTIONS</th>
            <th>INTENSITY </th>
            <th>FHR </th>
            <th>V/E </th>
            <th>SIGN </th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody >
          {formData.map((row, index) => {
            
            const date = new Date(Number(row?.date))
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const date1 = new Date(Number(row?.date))
        
            let hours = date1.getHours()
            const minutes = date1.getMinutes()
            const ampm = hours >= 12 ? "PM" : "AM"
        
            hours = hours % 12
            hours = hours ? hours : 12
        
            const pad = (n) => n.toString().padStart(2, '0')
        
            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

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
                    value={row.BP} 
                    onChange={e => 
                    handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="PR" 
                    type='number' 
                    value={row.PR} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"     
                  />
              </td>
              <td>
                  <input 
                    name="RR" 
                    type='number' 
                    value={row.RR} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"     
                  />
              </td>
              <td>
                  <input 
                    name="temperature" 
                    type='number' 
                    value={row.temperature} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"     
                  />
              </td>
              <td>
                <input 
                    name="contraction" 
                    type='number'
                    value={row.contraction} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"   
                />
              </td>
              <td style={{height:'70px'}} >
                  <select name='intensity' style={{height:'70px'}} value={row.intensity} onChange={(e) => handleChange(index, e)} >
                    <option value=''>SELECT ROUTE</option>
                    <option value='MILD'>MILD</option>
                    <option value='MODERATE'>MODERATE</option>
                    <option value='STRONG'>STRONG</option>
                  </select>
              </td>
              <td>
                  <input 
                    name="FHR" 
                    value={row.FHR} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="VE" 
                    value={row.VE} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px', wordBreak: 'break-all'}} >{row.staffID}</p>
                </div>
              </td>
              <td>
                <button className="delete_btn" onClick={() => removeRow({ index, id: row?._id })}>
                  Delete
                </button>
              </td>
            </tr>
          )}
          )}
        </tbody>
      </table> 

      <div className="custome_table_btn">
        <button className="custome_table_btn1" onClick={addRow}>ADD</button>
        <button className="custome_table_btn2" onClick={handleSuFHRt}>SAVE CHANGES</button>
      </div>
    </>
  );
}

export default LabourChart;
