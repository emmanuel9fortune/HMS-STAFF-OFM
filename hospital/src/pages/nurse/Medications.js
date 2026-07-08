import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify';
import { selectfid } from '../../features/fidSlice';
import Pagination from '../../components/Pagination';
import { useRef } from 'react';

function Medications({ handleBack, currentIndex, setcurrentIndex }) {
  //axios.defaults.withCredentials = true;
  const ip = useSelector(selectip)

  

  const id = useSelector(selectid);
  const fid = useSelector(selectfid);
  const uid = fid?.id || id?.id;

  const staffID = sessionStorage.getItem('staffID');
  const getDep = JSON.parse(staffID);

  const staffName = getDep?.name

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const controller = new AbortController()
    const fetchVitals = async () => {
      try {
        const res = await axios.post(`http://${ip?.ip }:7700/getmedications`, { uid: uid, signal: controller.signal });
        console.log(res);
        
        if (res.data.status === 'success') {
          const medication = res.data.medication?.medications || [];

          const formatted = medication.length > 0
            ? medication.map(item => ({
                _id: item?._id,
                timeStamp: item?.timeStamp || '',
                medication: item?.medication || '',
                dosage: item?.dosage || '',
                route: item?.route || '',
                oxygen: item?.oxygen , 
                staffID: item?.staffID || `${staffName}`, 
                remark: item?.remark , 
              }))
            : [{
                timeStamp: '',
                medication: '',
                dosage: '',
                route: '',
                oxygen: '',
                staffID: `${staffName}`,
                remark: '',
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
        timeStamp: '',
        medication: '',
        dosage: '',
        route: '',
        oxygen: '',
        staffID: `${staffName}`,
        remark: '',
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
      await axios.post(`http://${ip?.ip}:7700/deleteMedication`, { uid: uid, id })
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
      const res = await axios.post(`http://${ip?.ip}:7700/medications`, {
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
    <div className="dashboard_body" ref={containerRef}>
      <div className="back_btn_" onClick={handleBack}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>
        <div className='dashboard_body_patient_details_btns' style={isMobileDevice ? {width:'100%', padding:'5px', flexWrap:'nowrap', display:'flex', flexDirection:'row'} : {}}>
            <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
            <button onClick={()=>setcurrentIndex(2)}>PATIENT VITALS</button> 
            <button onClick={()=>setcurrentIndex(3)}>UTILITIES | CONSUMABLES</button>
            <button onClick={()=>setcurrentIndex(4)}>LAB RESULTS | SCAN</button>
            <button className={currentIndex === 5 && 'dashboard_body_patient_details_btns_'}>MEDICATIONS</button>
            <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button>
            <button onClick={()=>setcurrentIndex(7)}>URINE CHART</button>
            <button onClick={()=>setcurrentIndex(8)}>PATIENT RECENT BILLS</button>
        </div>
      <h2 style={{margin:'10px 0'}} >MEDICATION CHART</h2>
      <p className="custome_table_guide">
        Edit table details, click Add to add new row, then click "Save changes".
      </p>

      <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', margin:'30px 0'}} >
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />        
      </div>

      <div className="custome_table_btn">
        <button className="custome_table_btn1" onClick={addRow}>ADD</button>
        <button className="custome_table_btn2" onClick={handleSubmit}>SAVE CHANGES</button>
      </div>
        
      

      <table className="custome_table">
        <thead>
          <tr> 
            <th>DATE</th>
            <th>MEDICATIONS </th>
            <th>DOSAGE</th>
            <th>ROUTE</th>
            <th>OXYGEN</th>
            <th>SIGN</th>
            <th>REMARK</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody >
          {currentItems.map((row, index) => {
                        
            const date1 = new Date(Number(row?.timeStamp))
        
            let hours = date1.getHours()
            const minutes = date1.getMinutes() 
            const ampm = hours >= 12 ? "PM" : "AM"
        
            hours = hours % 12
            hours = hours ? hours : 12
        
            const pad = (n) => n.toString().padStart(2, '0')
        
            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

            const unixTest = !/^\d+$/.test(row.timeStamp)

            return (
            <tr key={index}  >
              <td style={{height:'70px'}} >
                <input 
                    name="timeStamp" 
                    style={{height:'70px'}}
                    value={!unixTest ?  timeString : row.timeStamp} 
                    onChange={e => 
                    handleChange(row.originalIndex, e)} 
                    placeholder="details" 
                  />
              </td>
              <td style={{height:'70px'}} >
                  <input 
                    name="medication" 
                    style={{height:'70px'}}
                    value={row.medication} 
                    onChange={e => 
                    handleChange(row.originalIndex, e)} 
                    placeholder="details" />
              </td>
              <td style={{height:'70px'}} >
                  <input 
                    name="dosage" 
                    value={row.dosage} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details" 
                    style={{height:'70px'}}
                  />
              </td>
              <td style={{height:'70px'}} >
                  <select name='route' style={{height:'70px'}} value={row.route} onChange={(e) => handleChange(row.originalIndex, e)} >
                    <option value=''>SELECT ROUTE</option>
                    <option value='INTRADERMAL'>INTRADERMAL</option>
                    <option value='INTRAMUSCULAR'>INTRAMUSCULAR</option>
                    <option value='INTRAVENOUS'>INTRAVENOUS</option>
                    <option value='P|0-ORAL'>P|O-ORAL</option>
                    <option value='INTRAVAGINAL'>INTRAVAGINAL</option>
                    <option value='RECTAL'>RECTAL</option>
                    <option value='SUBTANGUAL'>SUBLINGUAL</option>
                    <option value='INTRALATIONAL'>INHALATIONAL</option>
                    <option value='SUBCUTANEOUS'>SUBCUTANEOUS</option>
                  </select>
              </td>
              <td style={{height:'70px'}} >
                  <select name="oxygen"  style={{height:'70px'}} value={row.oxygen} onChange={(e) => handleChange(row.originalIndex, e)} >
                    <option value=''>SELECT OXYGEN</option>
                    <option value='LESS THAN 30m'>LESS THAN 30m</option>
                    <option value='ABOVE 30-60m'>ABOVE 30-60m</option>
                    <option value='HOURLY'>HOURLY</option>
                    <option value='ABOVE 6 HOURS'>ABOVE 6 HOURS</option>
                    <option value='24 HOURS'>24 HOURS</option>
                  </select>
              </td>
              <td style={{height:'70px'}} >
                  <p style={{width:'100px'}}>{row.staffID}</p>
              </td>
              <td style={{height:'70px'}} >
                <input 
                    name="remark" 
                    value={row.remark} 
                    onChange={e => handleChange(row.originalIndex, e)} 
                    placeholder="details"   
                    style={{height:'70px'}}
                />
              </td>
              <td style={{height:'70px'}} >
                {
                    row.staffID &&
                    <button 
                        style={{height:'70px'}} className="delete_btn" onClick={() => removeRow({ index: row.originalIndex, id: row?._id })}>
                    Delete
                    </button>
                }
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

export default Medications