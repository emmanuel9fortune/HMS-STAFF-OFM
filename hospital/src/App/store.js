import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../features/patientSlice';
import antenatalReducer from '../features/antenatalSlice';
import idReducer from '../features/idSlice';
import fidReducer from '../features/fidSlice';
import infoReducer from '../features/infoSlice';
import cartReducer from '../features/cartSlice';
import payReducer from '../features/paySlice';
import PrescribeReducer from '../features/prescibeSlice';
import consumeReducer from '../features/consumables';
import reloadReducer from '../features/reloadSlice';
import ipReducer from '../features/ipSlice';
import utilsReducer from '../features/utilsSlice';
import serveripReducer from '../features/antenatalSlice';

export const store = configureStore({
  reducer: {
    info: infoReducer,
    id: idReducer,
    fid: fidReducer,
    antenatal: antenatalReducer,
    patient: patientReducer,
    ip: ipReducer,
    reload: reloadReducer,
    serverip: serveripReducer,
    cart: cartReducer,
    Consume: consumeReducer,
    Pay: payReducer,
    Utils: utilsReducer,
    prescribe: PrescribeReducer,
  },
});