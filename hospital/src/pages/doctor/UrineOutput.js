import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify';
import { FaChevronLeft } from 'react-icons/fa';
import { setfids } from '../../features/fidSlice';
import { useParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';

function UrineOutput({ handleBack, currentIndex, setcurrentIndex }) {
  const ip = useSelector(selectip)

      const {id} = useParams()

      const uid = id;

  const sign = sessionStorage.getItem('staffID');
  const getDep = JSON.parse(sign);

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const controller = new AbortController()
    const fetchVitals = async () => {
      try {
        const res = await axios.post(`http://${ip?.ip }:7700/geturineoutput`, { uid, signal: controller.signal });        
        
        if (res.data.status === 'success') {
          const vitals = res.data.urine?.urine || [];

          const formatted = vitals.length > 0
            ? vitals.map(item => ({
                _id: item?._id ,
                date: item?.date || new Date().getTime(),
                input: item?.input || '',
                output: item?.output || '',
                remark: item?.remark || '',
                sign: item?.sign || getDep?.name, 
              }))
            : [{
                date: new Date().getTime(),
                input: '',
                output: '',
                remark: '',
                sign: getDep?.name,
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

  const addRow = () => {
    setFormData(PRev => [
      ...PRev,
      {
        date: new Date().getTime(),
        input: '',
        output: '',
        remark: '',
        sign: getDep?.name,
      },
    ]);
  };

  const removeRow = ({ index }) => {
    if (formData.length === 1) {
      return toast.error('At least one row is required.');
    }
    setFormData(PRev => PRev.filter((_, i) => i !== index));
  };

  const handleSuFHRt = async () => {
    try {
      const res = await axios.post(`http://${ip?.ip }:7700/urineoutput`, {
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

  
  const dispatch = useDispatch()

  const handleView =(id)=>{
      dispatch(
          setfids({
              id:''
          })
      )
        window.history.back()
  }
  

  return (
      <div className="dashboard_body" style={{width:'100%', marginTop:'100px'}}>
        <div className="back_btn_" onClick={handleView}>
          <FaChevronLeft />
          <h4>BACK</h4>
        </div>
          <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setcurrentIndex(0)} >PATIENT DETAILS</button>
            <button onClick={()=>setcurrentIndex(1)} >VITALS</button>
            <button onClick={()=>setcurrentIndex(2)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setcurrentIndex(3)}>PRESCRIPTION</button>
            <button onClick={()=>setcurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setcurrentIndex(4)}>TRANSACTION HISTORY</button>
            <button className={currentIndex === 6 && 'dashboard_body_patient_details_btns_'} >URINE CHART</button>
            <button onClick={()=>setcurrentIndex(7)}>UTILITIES | CONSUMABLES</button>
          </div>
        <h2 style={{margin:'10px 0'}} >URINE OUTPUT</h2> 
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
            <button className="custome_table_btn2" onClick={handleSuFHRt}>SAVE CHANGES</button>
          </div>
        : null
      }

      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>INPUT (B/M)</th>
            <th>URINE OUTPUT</th>
            <th>REMARK</th>
            <th>SIGN</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody >
          {currentItems.map((row, index) => {

            
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
                    name="input" 
                    type='text' 
                    value={row.input} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details" 
                  />
              </td>
              <td>
                  <input 
                  name="output"
                  type='text'
                  value={row.output} 
                  onChange={e => 
                  handleChange(row.originalIndex, e)} 
                  placeholder="details" />
              </td>
              <td>
                  <select name='remark' value={row.remark} onChange={e => handleChange(row.originalIndex, e)} >
                    <option>SELECT REMARK</option>
                    <option value={'CLEAR'}>CLEAR</option>
                    <option value={'CLOWDY'}>CLOWDY</option>
                    <option value={'BLOODY'}>BLOODY</option>
                  </select>
              </td>
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px', wordBreak: 'break-all'}} >{row.sign}</p>
                </div>
              </td>
              <td>
                <button className="delete_btn" onClick={() => removeRow({ index: row.originalIndex})}>
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
        <button className="custome_table_btn2" onClick={handleSuFHRt}>SAVE CHANGES</button>
      </div>
      <div style={{height:'700px', width:'100%'}}></div>
      <div style={{height:'700px', width:'100%'}}></div>
    </div>
  );
}

export default UrineOutput