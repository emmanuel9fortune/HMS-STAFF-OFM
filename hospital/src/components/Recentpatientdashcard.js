import React from 'react';
import '../pages/Allstyling.css';

function Recentpatientdashcard({res}) {

    const date = new Date(Number(res?.timeStamp))
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const date1 = new Date(Number(res?.timeStamp))

    let hours = date1.getHours()
    const minutes = date1.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12 

    const pad = (n) => n.toString().padStart(2, '0')

    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

   

  return (
    <div className='recentpatientdashcard'>
      <div className='recentpatientdashcard_desc'>
          <h4 className='recentpatientdashcard_name'>{res?.name}</h4>
          <p className='recentpatientdashcard_phoneNo'>{res?.center ? "Ante Natal Patient" : res?.family || res?.familyid ? 'Family Card' : "Regular Patient"} {res?.hop && `(${res?.hop})`}</p>
      </div>

      <div className='recentpatientdashcard_desc' style={{display:'flex', flexDirection:'column', alignItems:'flex-end', margin:'0 20px'}}>
          <p className='recentpatientdashcard_date'>{res?.status === 'admitted' ? 'In Patient' : res?.status === 'discharged' ? 'Out Patient' : res?.status}</p>
          <p className='recentpatientdashcard_time'>{timeString}, {`${day}-${month}-${year}`}</p>
      </div>
    </div>
  )
}

export default Recentpatientdashcard;