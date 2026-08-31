import React from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Patientqueue from './Patientqueue'
import Newpatient from './Newpatient'
import Paymentdesk from './Paymentdesk'
import Searchpatient from './Searchpatient'
import TransactionHistory from './TransactionHistory'
import PayOut from './PayOut'
import InpatientRequest from './InpatientRequest'
import Audit from './Audit'
import Expenses from './Expenses'

function Receptionist() {

  //axios.defaults.withCredentials = true
  

  return (
    <Router>
      <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/patientqueue' element={<Patientqueue/>} />
          <Route path='/newpatient' element={<Newpatient/>} />
          <Route path='/paymentdesk' element={<Paymentdesk/>} />
          <Route path='/searchpatient' element={<Searchpatient />} />
          <Route path='/history' element={<TransactionHistory />} />
          <Route path='/payout' element={<PayOut />} />
          <Route path='/inpatientApprove' element={<InpatientRequest />} />
          <Route path='/expenses' element={<Expenses />} />
          <Route path='/audit' element={<Audit />} />
      </Routes>
    </Router>
  )
}

export default Receptionist