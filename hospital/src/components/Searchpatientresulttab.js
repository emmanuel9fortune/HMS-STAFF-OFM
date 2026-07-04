import axios from 'axios'
import React from 'react'
import { setids } from '../features/idSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { selectip } from '../features/ipSlice'
import { toast } from 'react-toastify'

function Searchpatientresulttab({setview, srch, admin}) {

  //axios.defaults.withCredentials = true

  const dispatch = useDispatch()
  const ip = useSelector(selectip)

  const handleView =()=>{
    dispatch(
      setids({
        uid: srch?._id,
        id: srch?._id,
      })
    )
    if(admin){
      setview(1)
    }else{
      setview(true)
    }
  }
  

  const handleAddToQueue = async()=>{
    try {
      await axios.post(`http://${ip?.ip }:7700/addToQueue`,{uid: srch?._id}).then((res)=>{
        if(res.data.status === 'success'){
          toast.success('Patient added to queue')
        }
      })
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc'>
            <h4>{srch?.name}</h4>
            <p>{srch?.center ? 'Ante Natal Patient' : srch?.family || srch?.familyid ? 'Family Card' : 'Regular Patient'} {srch?.hop && `(${srch?.hop})`}</p>
        </div>

        <div className='Patientqueuecard_button'>
            <button className='searchresultcard_view' onClick={handleView}>VIEW</button>
            {
              !admin &&
              <button className='searchresultcard_view2' onClick={handleAddToQueue} >ADD TO QUEUE</button>
            }
        </div>
    </div>
  )
}

export default Searchpatientresulttab;