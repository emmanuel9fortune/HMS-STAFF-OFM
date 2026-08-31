import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify';
import { FaChevronLeft } from 'react-icons/fa';
import { selectfid } from '../../features/fidSlice';
import { useRef } from 'react';
import Pagination from '../../components/Pagination';

function UrineOutput({ handleBack, currentIndex, setcurrentIndex }) {
  const ip = useSelector(selectip)

  const id = useSelector(selectid);
  const fid = useSelector(selectfid);
  const uid = fid?.id || id?.id;

  const sign = sessionStorage.getItem('staffID');
  const getDep = JSON.parse(sign);

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const controller = new AbortController()
    const fetchVitals = async () => {
      try {
        const res = await axios.post(`http://${ip?.ip }:7700/geturineoutput`, { uid: uid, signal: controller.signal });        
          //console.log(res);
          
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

  const containerRef = useRef(null);

  const addRow = () => {
    setCurrentPage(1)
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  const removeRow = async({ index, id }) => {
    if (formData.length === 1) {
      return toast.error('At least one row is required.');
    } 

    if(!id){
      setFormData(PRev => PRev.filter((_, i) => i !== index));
      toast.success('Entry deleted');
    }else{
      await axios.post(`http://${ip?.ip}:7700/deleteUrine`, { uid: uid, id })
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
      const res = await axios.post(`http://${ip?.ip}:7700/urineoutput`, {
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
      <div className="dashboard_body">
        <div className="back_btn_" onClick={handleBack}>
          <FaChevronLeft /> 
          <h4>BACK</h4>
        </div>
          <div className='dashboard_body_patient_details_btns' style={isMobileDevice ? {width:'100%', padding:'5px', flexWrap:'nowrap', display:'flex', flexDirection:'row'} : {}}>
              <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
              <button onClick={()=>setcurrentIndex(2)}>PATIENT VITALS</button> 
              <button onClick={()=>setcurrentIndex(3)}>UTILITIES | CONSUMABLES</button>
              <button onClick={()=>setcurrentIndex(4)}>LAB RESULTS | SCAN</button>
              <button onClick={()=>setcurrentIndex(5)}>MEDICATION CHART</button>
              <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button>
              <button className={currentIndex === 7 && 'dashboard_body_patient_details_btns_'} >URINE CHART</button>
                        <button onClick={()=>setcurrentIndex(8)}>PATIENT RECENT BILLS</button>
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
                <button className="delete_btn" onClick={() => removeRow({ index:row.originalIndex, id: row?._id })}>
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
    </div>
  );
}

export default UrineOutput