import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import Vitals from './Vitals'
import LabResult from './LabResult'
import Prescriptions from './Prescriptions'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setids } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'
import TransactionHistory from './TransactionHistory'
import { toast } from 'react-toastify'
import LabourChart from '../nurse/LabourChart'
import BabyVitals from '../nurse/BabyVitals'
import Medications from './MedicationChart'
import UrineOutput from './UrineOutput'
import DispanseUtils from './DsipanseUtils'
import { setfids } from '../../features/fidSlice'
import { useNavigate, useParams } from 'react-router-dom'
// import Recorder from './Recorder'


function PatientDetails({handleBack, admin}) {

    const [currenIndex, setCurrentIndex] = useState(0)
    const ip = useSelector(selectip)

    
        //axios.defaults.withCredentials = true
    
    const [notes, setnotes] = useState('')
    const [timeStamp, settimeStamp] = useState('')
    const [hop, sethop] = useState('')
    const [subscribe, setsubscribe] = useState('')
    const [deposit, setdeposit] = useState('')
    const [sex, setsex] = useState('')
    const [phone, setphone] = useState('')
    const [name, setname] = useState('')
    const [religion, setreligion] = useState('')
    const [address, setaddress] = useState( '')
    const [specialPoints, setspecialPoints] = useState( '')
    const [dateOfBirth, setdateOfBirth] = useState('')
    const [sect, setsect] = useState('')
    const [tribe, settribe] = useState('')
    const [spousePhone, setspousePhone] = useState('')
    const [nextOfKinAddress, setnextOfKinAddress] = useState('')
    const [nextOfKin, setnextOfKin] = useState('')
    const [age, setage] = useState('')
    const [AgeType, setAgeType] = useState('')
    const [nextOfKinPhone, setnextOfKinPhone] = useState('')
    const [center, setcenter] = useState('')
    const [dateOfBooking, setdateOfBooking] = useState('')
    const [occupation, setoccupation] = useState('')
    const [educationLevel, seteducationLevel] = useState('')
    const [maritalStatus, setmaritalStatus] = useState('')
    const [ageAtMarriage, setageAtMarriage] = useState('')
    const [LMP, setLMP] = useState('')
    const [eddByUss, seteddByUss] = useState('')
    const [eddDate, seteddDate] = useState('')
    const [AverageMonthlyFamilyIncome, setAverageMonthlyFamilyIncome] = useState('')
    
    const [heartDisease, setheartDisease] = useState('')
    const [kidneyDisease, setkidneyDisease] = useState('')
    const [Diabetes, setDiabetes] = useState('')
    const [ChestDisease, setChestDisease] = useState('')
    const [Covid, setCovid] = useState('')
    const [PreviousePregnancies, setPreviousePregnancies] = useState('')
    const [NoOfLivingChildren, setNoOfLivingChildren] = useState('')
    const [NumberOfOperations, setNumberOfOperations] = useState('')

    const [letter, setletter] = useState('')
    const [specialInvestigation, setspecialInvestigation] = useState('')
    const [generalCondition, setgeneralCondition] = useState('')

    const [urinarySymptoms, seturinarySymptoms] = useState('')
    const [historyPreg, sethistoryPreg] = useState('')
    const [vomiting, setvomiting] = useState('')
    const [vaginalDischarge, setvaginalDischarge] = useState('')
    const [swellingOfAnkles, setswellingOfAnkles] = useState('')
    const [bleeding, setbleeding] = useState('')
    const [otherSymptoms, setotherSymptoms] = useState('')
    
    const [oedema, setoedema] = useState('')
    const [anaemia, setanaemia] = useState('')
    const [respiratorySystem, setrespiratorySystem] = useState('')
    const [cardiovascularSystem, setcardiovascularSystem] = useState('')
    const [abdomen, setabdomen] = useState('')
    const [spleen, setspleen] = useState('')
    const [liver, setliver] = useState('')
    const [preliminary, setpreliminary] = useState('')
    const [height, setheight] = useState('')
    const [weight, setweight] = useState('')
    const [feet, setfeet] = useState('')
    const [inches, setinches] = useState('')
    const [ST, setST] = useState('')
    const [LBS, setLBS] = useState('')
    const [BP, setBP] = useState('')
    const [albumin, setalbumin] = useState('')
    const [sugar, setsugar] = useState('')
    const [breastNipples, setbreastNipples] = useState('')
    const [HB, setHB] = useState('')
    const [RB, setRB] = useState('')
    const [genotype, setgenotype] = useState('')
    const [USS, setUSS] = useState('')
    const [bloodGroup, setbloodGroup] = useState('')
    const [chestXray, setchestXray] = useState('')
    const [dcount, setdcount] = useState('')
        
    const [comments, setcomments] = useState('')
    const [pelvicAssessment, setpelvicAssessment] = useState('')
    const [specialInstruction, setspecialInstruction] = useState('')
    const [status, setstatus] = useState('')
    const [operation, setoperation] = useState([])
    const [antenatal, setantenatal] = useState([])
    const [reload, setreload] = useState(0)
    const [visists, setvisists] = useState(0)
    const [family, setfamily] = useState(false)
    const [members, setmembers] = useState(0)
    const [getFamilyMembers, setgetFamilyMembers] = useState([])
    const [familyName, setfamilyName] = useState({})
    const [pid, setpid] = useState('')

    const editorRef = useRef(null);

    const dispatch = useDispatch()


    const [originalValues, setOriginalValues] = useState({})
    const [originalValuee2, setOriginalValuee2] = useState({})
          
    const {id, fid} = useParams()
    
    const handlePrevious=()=>{
        window.history.back()

        dispatch(
            setids({
                id:''
            })
        )
    }
 
    
    useEffect(()=>{
        const controller = new AbortController()
        const func=async()=>{
            try {
                await axios.post(`http://${ip?.ip }:7700/getPatientDetails`, {uid: pid || fid || id, signal: controller.signal}).then((res)=>{
                    // // console.log(res);
                    
                    if(res.data.status === 'success'){
                        const getpatient = res.data?.getPatient
                        const getantenatal = res.data?.getantenatal
                        setOriginalValues(getpatient)
                        setOriginalValuee2(getantenatal)

                        setname(res.data?.getPatient?.name || '')
                        setvisists(res.data?.visists || 0)
                        setstatus(res.data?.getPatient?.status || '')
                        setdcount(res.data?.getPatient?.discount || '')
                        settimeStamp(res.data?.getPatient?.timeStamp || '')
                        setfamily(res.data?.getPatient?.family || '')
                        setnotes(res.data?.getPatient?.notes || '')
                        setmembers(res.data?.getPatient?.members || '')
                        sethop(res.data?.getPatient?.hop || '')
                        setdeposit(res.data?.getPatient?.deposit || '')
                        setsubscribe(res.data?.getPatient?.subscribe || '')
                        setsex(res.data?.getPatient?.sex || '')
                        setphone(res.data?.getPatient?.phone || '')
                        setreligion(res.data?.getPatient?.religion || '')
                        setaddress(res.data?.getPatient?.address || '')
                        setspecialPoints(res.data?.getPatient?.specialPoints || '')
                        setdateOfBirth(res.data?.getPatient?.dateOfBirth || '')
                        setsect(res.data?.getPatient?.sect || '')
                        settribe(res.data?.getPatient?.tribe || '')
                        setspousePhone(res.data?.getPatient?.spousePhone || '')
                        setnextOfKinAddress(res.data?.getPatient?.nextOfKinAddress || '')
                        setnextOfKin(res.data?.getPatient?.nextOfKin || '')
                        setage(res.data?.getPatient?.age || '')
                        setAgeType(res.data?.getPatient?.AgeType || '')
                        setnextOfKinPhone(res.data?.getPatient?.nextOfKinPhone || '')
                        setcenter(res.data?.getPatient?.center || '')
                        setdateOfBooking(res.data?.getPatient?.dateOfBooking || '')
                        setoccupation(res.data?.getPatient?.occupation || '')
                        seteducationLevel(res.data?.getPatient?.educationLevel || '')
                        setmaritalStatus(res.data?.getPatient?.maritalStatus || '')
                        setageAtMarriage(res.data?.getPatient?.ageAtMarriage || '')
                        setLMP(res.data?.getPatient?.LMP || '')
                        seteddByUss(res.data?.getPatient?.eddByUss || '')
                        seteddDate(res.data?.getPatient?.eddDate || '')
                        setAverageMonthlyFamilyIncome(res.data?.getPatient?.AverageMonthlyFamilyIncome || '')
                        
                        setheartDisease(res.data?.getPatient?.heartDisease || '')
                        setkidneyDisease(res.data?.getPatient?.kidneyDisease || '')
                        setDiabetes(res.data?.getPatient?.Diabetes || '')
                        setChestDisease(res.data?.getPatient?.ChestDisease || '')
                        setCovid(res.data?.getPatient?.Covid || '')
                        setPreviousePregnancies(res.data?.getPatient?.PreviousePregnancies || '')
                        setNoOfLivingChildren(res.data?.getPatient?.NoOfLivingChildren || '')
                        setNumberOfOperations(res.data?.getPatient?.NumberOfOperations || '')

                        setletter(res.data?.getantenatal?.letter || '')
                        setspecialInvestigation(res.data?.getantenatal?.specialInvestigation || '')
                        setgeneralCondition(res.data?.getantenatal?.generalCondition || '')

                        seturinarySymptoms(res.data?.getantenatal?.urinarySymptoms || '')
                        sethistoryPreg(res.data?.getantenatal?.historyPreg || '')
                        setvomiting(res.data?.getantenatal?.vomiting || '')
                        setvaginalDischarge(res.data?.getantenatal?.vaginalDischarge || '')
                        setswellingOfAnkles(res.data?.getantenatal?.swellingOfAnkles || '')
                        setbleeding(res.data?.getantenatal?.bleeding || '')
                        setotherSymptoms(res.data?.getantenatal?.otherSymptoms || '')

                        setoedema(res.data?.getantenatal?.oedema || '')
                        setanaemia(res.data?.getantenatal?.anaemia || '')
                        setrespiratorySystem(res.data?.getantenatal?.respiratorySystem || '')
                        setcardiovascularSystem(res.data?.getantenatal?.cardiovascularSystem || '')
                        setabdomen(res.data?.getantenatal?.abdomen || '')
                        setspleen(res.data?.getantenatal?.spleen || '')
                        setliver(res.data?.getantenatal?.liver || '')
                        setpreliminary(res.data?.getantenatal?.preliminary || '')
                        setheight(res.data?.getantenatal?.height || '')
                        setweight(res.data?.getantenatal?.weight || '')
                        setfeet(res.data?.getantenatal?.feet || '')
                        setinches(res.data?.getantenatal?.inches || '')
                        setST(res.data?.getantenatal?.ST || '')
                        setLBS(res.data?.getantenatal?.LBS || '')
                        setBP(res.data?.getantenatal?.BP || '')
                        setalbumin(res.data?.getantenatal?.albumin || '')
                        setsugar(res.data?.getantenatal?.sugar || '')
                        setbreastNipples(res.data?.getantenatal?.breastNipples || '')
                        setHB(res.data?.getantenatal?.HB || '')
                        setRB(res.data?.getantenatal?.RH || '')
                        setgenotype(res.data?.getantenatal?.genotype || '')
                        setUSS(res.data?.getantenatal?.USS || '')
                        setbloodGroup(res.data?.getantenatal?.bloodGroup || '')
                        setchestXray(res.data?.getantenatal?.chestXray || '')
                        
                        setcomments(res.data?.getantenatal?.comments || '')
                        setpelvicAssessment(res.data?.getantenatal?.pelvicAssessment || '')
                        setspecialInstruction(res.data?.getantenatal?.specialInstruction || '')
                        setoperation(res.data?.getPatient?.operations || '')
                        setantenatal(res.data?.getPatient?.anteNatalRecords || '')
                        setgetFamilyMembers(res.data?.getFamilyMembers || [])
                        setfamilyName(res.data?.getFamily || {})
                        setreload(reload + 1)
                    }
                })
            } catch (error) {
                //console.log(error);
            }
        }
        func()
        
        return ()=> controller.abort()
    },[id, reload, ip, pid, fid])


    const hasChanges = () => {
        const changes = {};

        if (name && name !== originalValues.name) changes.name = name;
        if (notes && notes !== originalValues.notes) changes.notes = notes;
        if (hop && hop !== originalValues.hop) changes.hop = hop;
        if (subscribe && subscribe !== originalValues.subscribe) changes.subscribe = subscribe;
        if (phone && phone !== originalValues.phone) changes.phone = phone;
        if (sex && sex !== originalValues.sex) changes.sex = sex;
        if (religion && religion !== originalValues.religion) changes.religion = religion;
        if (address && address !== originalValues.address) changes.address = address;
        if (specialPoints && specialPoints !== originalValues.specialPoints) changes.specialPoints = specialPoints;
        if (dateOfBirth && dateOfBirth !== originalValues.dateOfBirth) changes.dateOfBirth = dateOfBirth;
        if (sect && sect !== originalValues.sect) changes.sect = sect;
        if (tribe && tribe !== originalValues.tribe) changes.tribe = tribe;
        if (spousePhone && spousePhone !== originalValues.spousePhone) changes.spousePhone = spousePhone;
        if (nextOfKinAddress && nextOfKinAddress !== originalValues.nextOfKinAddress) changes.nextOfKinAddress = nextOfKinAddress;
        if (nextOfKin && nextOfKin !== originalValues.nextOfKin) changes.nextOfKin = nextOfKin;
        if (age && age !== originalValues.age) changes.age = age;
        if (members && members !== originalValues.members) changes.members = members;
        if (AgeType && AgeType !== originalValues.AgeType) changes.AgeType = AgeType;
        if (dcount && dcount !== originalValues.discount) changes.discount = dcount;
        if (nextOfKinPhone && nextOfKinPhone !== originalValues.nextOfKinPhone) changes.nextOfKinPhone = nextOfKinPhone;
        if (center && center !== originalValues.center) changes.center = center;
        if (dateOfBooking && dateOfBooking !== originalValues.dateOfBooking) changes.dateOfBooking = dateOfBooking;
        if (occupation && occupation !== originalValues.occupation) changes.occupation = occupation;
        if (educationLevel && educationLevel !== originalValues.educationLevel) changes.educationLevel = educationLevel;
        if (maritalStatus && maritalStatus !== originalValues.maritalStatus) changes.maritalStatus = maritalStatus;
        if (ageAtMarriage && ageAtMarriage !== originalValues.ageAtMarriage) changes.ageAtMarriage = ageAtMarriage;
        if (LMP && LMP !== originalValues.LMP) changes.LMP = LMP;
        if (eddByUss && eddByUss !== originalValues.eddByUss) changes.eddByUss = eddByUss;
        if (eddDate && eddDate !== originalValues.eddDate) changes.eddDate = eddDate;
        if (AverageMonthlyFamilyIncome && AverageMonthlyFamilyIncome !== originalValues.AverageMonthlyFamilyIncome) changes.AverageMonthlyFamilyIncome = AverageMonthlyFamilyIncome;
        if (heartDisease && heartDisease !== originalValues.heartDisease) changes.heartDisease = heartDisease;
        if (kidneyDisease && kidneyDisease !== originalValues.kidneyDisease) changes.kidneyDisease = kidneyDisease;
        if (Diabetes && Diabetes !== originalValues.Diabetes) changes.Diabetes = Diabetes;
        if (ChestDisease && ChestDisease !== originalValues.ChestDisease) changes.ChestDisease = ChestDisease;
        if (Covid && Covid !== originalValues.Covid) changes.Covid = Covid;
        if (PreviousePregnancies && PreviousePregnancies !== originalValues.PreviousePregnancies) changes.PreviousePregnancies = PreviousePregnancies;
        if (NoOfLivingChildren && NoOfLivingChildren !== originalValues.NoOfLivingChildren) changes.NoOfLivingChildren = NoOfLivingChildren;
        if (NumberOfOperations && NumberOfOperations !== originalValues.NumberOfOperations) changes.NumberOfOperations = NumberOfOperations;
        if (letter && letter !== originalValuee2.letter) changes.letter = letter;
        if (specialInvestigation && specialInvestigation !== originalValuee2.specialInvestigation) changes.specialInvestigation = specialInvestigation;
        if (generalCondition && generalCondition !== originalValuee2.generalCondition) changes.generalCondition = generalCondition;
        if (urinarySymptoms && urinarySymptoms !== originalValuee2.urinarySymptoms) changes.urinarySymptoms = urinarySymptoms;
        if (historyPreg && historyPreg !== originalValuee2.historyPreg) changes.historyPreg = historyPreg;
        if (vomiting && vomiting !== originalValuee2.vomiting) changes.vomiting = vomiting;
        if (vaginalDischarge && vaginalDischarge !== originalValuee2.vaginalDischarge) changes.vaginalDischarge = vaginalDischarge;
        if (swellingOfAnkles && swellingOfAnkles !== originalValuee2.swellingOfAnkles) changes.swellingOfAnkles = swellingOfAnkles;
        if (bleeding && bleeding !== originalValuee2.bleeding) changes.bleeding = bleeding;
        if (otherSymptoms && otherSymptoms !== originalValuee2.otherSymptoms) changes.otherSymptoms = otherSymptoms;
        if (oedema && oedema !== originalValuee2.oedema) changes.oedema = oedema;
        if (anaemia && anaemia !== originalValuee2.anaemia) changes.anaemia = anaemia;
        if (respiratorySystem && respiratorySystem !== originalValuee2.respiratorySystem) changes.respiratorySystem = respiratorySystem;
        if (cardiovascularSystem && cardiovascularSystem !== originalValuee2.cardiovascularSystem) changes.cardiovascularSystem = cardiovascularSystem;
        if (abdomen && abdomen !== originalValuee2.abdomen) changes.abdomen = abdomen;
        if (spleen && spleen !== originalValuee2.spleen) changes.spleen = spleen;
        if (liver && liver !== originalValuee2.liver) changes.liver = liver;
        if (preliminary && preliminary !== originalValuee2.preliminary) changes.preliminary = preliminary;
        if (height && height !== originalValuee2.height) changes.height = height;
        if (weight && weight !== originalValuee2.weight) changes.weight = weight;
        if (feet && feet !== originalValuee2.feet) changes.feet = feet;
        if (inches && inches !== originalValuee2.inches) changes.inches = inches;
        if (ST && ST !== originalValuee2.ST) changes.ST = ST;
        if (LBS && LBS !== originalValuee2.LBS) changes.LBS = LBS;
        if (BP && BP !== originalValuee2.BP) changes.BP = BP;
        if (albumin && albumin !== originalValuee2.albumin) changes.albumin = albumin;
        if (sugar && sugar !== originalValuee2.sugar) changes.sugar = sugar;
        if (breastNipples && breastNipples !== originalValuee2.breastNipples) changes.breastNipples = breastNipples;
        if (HB && HB !== originalValuee2.HB) changes.HB = HB;
        if (RB && RB !== originalValuee2.RH) changes.RB = RB;
        if (genotype && genotype !== originalValuee2.genotype) changes.genotype = genotype;
        if (USS && USS !== originalValuee2.USS) changes.USS = USS;
        if (bloodGroup && bloodGroup !== originalValuee2.bloodGroup) changes.bloodGroup = bloodGroup;
        if (chestXray && chestXray !== originalValuee2.chestXray) changes.chestXray = chestXray;
        if (comments && comments !== originalValuee2.comments) changes.comments = comments;
        if (pelvicAssessment && pelvicAssessment !== originalValuee2.pelvicAssessment) changes.pelvicAssessment = pelvicAssessment;
        if (specialInstruction && specialInstruction !== originalValuee2.specialInstruction) changes.specialInstruction = specialInstruction;

        return changes;
    };
    
    
    const changes = hasChanges()
    
        
    
    const handleSave =async()=>{
        try {
            await axios.post(`http://${ip?.ip }:7700/editPatientDetails`, {changes: changes, uid: pid || id}).then((res)=>{
                if(res.data.status === 'success'){
                    setreload(reload + 1)
                    toast.success('Changes Saved')
                }
            })
        } catch (error) {
            //console.log(error);
        }
    }
    
    
    // ======================================================================//
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
    // ======================================================================//

    const emptyRow = {
        dateOfBirth: '',
        durationOfPregnancy: '',
        birthWeight: '',
        complicationInPregnancy: '',
        complicationInLabour: '',
        puerPremium: '',
        ageAtDeath: '',
        causeOfDeath: '',
    };

    const [formData, setFormData] = useState([emptyRow]);

    useEffect(() => {
        if (operation?.length > 0) {
        const formatted = operation.map(item => ({
            dateOfBirth: item?.dateOfBirth || '',
            durationOfPregnancy: item?.durationOfPregnancy || '',
            birthWeight: item?.birthWeight || '',
            complicationInPregnancy: item?.complicationInPregnancy || '',
            complicationInLabour: item?.complicationInLabour || '',
            puerPremium: item?.puerPremium || '',
            ageAtDeath: item?.ageAtDeath || '',
            causeOfDeath: item?.causeOfDeath || '',
            opId: item?._id || null, // Assuming backend gives an _id for deletion
            _id: item?._id || null // Assuming backend gives an _id for deletion
        }));
        setFormData(formatted);
        }
    }, [operation]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...formData];
        updated[index][name] = value;
        setFormData(updated);
    };
  
    const uid = id

    const addRow = () => {
        setFormData(prev => [...prev, emptyRow]);
    };

    const removeRow = async ({ index, opId }) => {
        if (formData.length === 1) {
        return toast.error("At least one row is required.");
        }

        const updated = formData.filter((_, i) => i !== index);
        setFormData(updated);

        if (opId) {
        try {
            await axios.post(`http://${ip?.ip }:7700/deleteTable`, { opId, uid });
        } catch (error) {
            console.error(error);
        }
        }
    };

    
    const handleSubmit = async () => {
        try {
        const res = await axios.post(`http://${ip?.ip }:7700/operations`, {
            formFields: formData,
            uid
        });

        if (res.data.status === 'success') {
            setreload(reload + 1);
        }
        } catch (error) {
        console.error(error);
        }
    };

    // ======================================================================//
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
    // ======================================================================//
    
    
      
    
      
    const [formData1, setFormData1] = useState([]);

    useEffect(() => {
        if (antenatal?.length > 0) {
            const formattedData = antenatal.map(item => ({
            _id: item?._id,
            date: item?.date || '',
            heightOfFundus: item?.heightOfFundus || '',
            presentingPartToBrim: item?.presentingPartToBrim || '',
            presentationAndPosition: item?.presentationAndPosition || '',
            oedema: item?.oedema || '',
            foetalHeart: item?.foetalHeart || '',
            urine: item?.urine || '',
            BP: item?.BP || '',
            weight: item?.weight || '',
            HB: item?.HB || '',
            remark: item?.remark || '',
            initialOfExaminer: item?.initialOfExaminer || '',
            Return: item?.Return || '',
            }));
            setFormData1(formattedData);
        } else {
            setFormData1([{
            date: '',
            heightOfFundus: '',
            presentingPartToBrim: '',
            presentationAndPosition: '',
            oedema: '',
            foetalHeart: '',
            urine: '',
            BP: '',
            weight: '',
            HB: '',
            remark: '',
            initialOfExaminer: '',
            Return: '',
            }]);
        }
    }, [antenatal]);

    const handleChange1 = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData1];
    updated[index][name] = value;
    setFormData1(updated);
    };

    const addRow1 = () => {
    setFormData1(prev => [
        ...prev,
        {
        date: '',
        heightOfFundus: '',
        presentingPartToBrim: '',
        presentationAndPosition: '',
        oedema: '',
        foetalHeart: '',
        urine: '',
        BP: '',
        weight: '',
        HB: '',
        remark: '',
        initialOfExaminer: '',
        Return: '',
        },
    ]);
    };

    const removeRow1 = async (index, _id) => {
        if (formData1.length === 1) return toast.error('At least one row is required.');
        const updatedRows = formData1.filter((_, i) => i !== index);
        setFormData1(updatedRows);

        if (_id) {
        try {
            await axios.post(`http://${ip?.ip }:7700/deleteTable`, { uid, Id: _id });
        } catch (error) {
            //console.log(error);
        }
        }
    };

    const handleSubmit1 = async () => {
        try {
        await axios.post(`http://${ip?.ip }:7700/antenatal7`, {
            uid,
            formFields: formData1,
        }).then((res) => {
            ////// console.log(res);
            
            if (res.data.status === 'success') {
            setreload(reload + 1);
            }
        });
        } catch (error) {
        //console.log(error); 
        }
    };

    
    const date = new Date(Number(timeStamp))
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const date1 = new Date(Number(timeStamp))

    let hours = date1.getHours()
    const minutes = date1.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12

    const pad = (n) => n.toString().padStart(2, '0')

    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
 
    const [patientIndex, setpatientIndex] = useState(0)

    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(deposit);

    const format = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    const [getnotes, setgetnotes] = useState([])
    const [staff, setstaff] = useState([])

    useEffect(() => {
        adjustHeight(); // Set height on initial render

        const func=async()=>{
            try {
                await axios.post(`http://${ip?.ip}:7700/getClinicalNote`, {uid: pid || id}).then((res)=>{
                    // // console.log(res);
                    
                    if(res.data.status === 'success'){
                        setgetnotes(res.data.gettingNote)
                        setstaff(res.data.getStaffDetails)
                        setreload(0)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    }, [reload, ip, id, pid]);
    
    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const getNotes = getnotes?.clinicalnote?.find((item) => item?.staffID === getid?._id);

    

    useEffect(() => {
        if (editorRef.current && getNotes?.note && editorRef.current.innerHTML !== getNotes?.note) {
            editorRef.current.innerHTML = getNotes?.note;
        }
    }, [getNotes, currenIndex]);

    const getDateStamp =()=>{
        const now = new Date()
        return `[${now.toLocaleString()}]\n`
    }

    const moveCursor = (el)=>{
        const range = document.createRange()
        const sel = window.getSelection()

        range.selectNodeContents(el)
        range.collapse(false)

        sel.removeAllRanges()
        sel.addRange(range)
    }

    const handleEdit =()=>{
        const dateStamp = document.createElement("div")
        dateStamp.textContent = getDateStamp()

        const last = editorRef.current.innerText.trim().split("\n").pop()
        const space = document.createTextNode(" ")
        const lineBreak = document.createElement("br")
        if(!last.startsWith("[")){
            editorRef.current.appendChild(space)
            editorRef.current.appendChild(lineBreak)
            editorRef.current.appendChild(dateStamp)
            editorRef.current.appendChild(lineBreak)
            editorRef.current.focus()
        }
        moveCursor(editorRef.current)
    }


    const handleInput = async() => {
        try {
            await axios.post(`http://${ip?.ip}:7700/ClinicalNote`, {note: editorRef.current.innerHTML, uid: pid || id, staffid: getid?._id})
            
        } catch (error) {
            console.log(error);
        }
        
    };

    
    
    const adjustHeight = () => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.style.height = '700px';
        editor.style.height = editor.scrollHeight + 'px';
    };


     const handleChanges1 = async (e) => {
        // Update local state
            setcomments(e.target.value)

            // Send updated value to server
            try {
                const response = await axios.post(`http://${ip?.ip}:7700/editPatientDetails`, {changes: {comments: e.target.value}, uid:  id}).then((res)=>{
                    if(res.data.status === 'success'){
                        // setreload(reload + 1)
                    }
                })
            console.log("Server response:", response.data);
            } catch (error) {
            console.error("Error sending data:", error);
            }
    };

     const handleChanges2 = async (e) => {
        // Update local state
            setpelvicAssessment(e.target.value)

            // Send updated value to server
            try {
                const response = await axios.post(`http://${ip?.ip}:7700/editPatientDetails`, {changes: {pelvicAssessment: e.target.value}, uid: id}).then((res)=>{
                    if(res.data.status === 'success'){
                        // setreload(reload + 1)
                    }
                })
            console.log("Server response:", response.data);
            } catch (error) {
            console.error("Error sending data:", error);
            }
    };

     const handleChanges3 = async (e) => {
        // Update local state
            setspecialInstruction(e.target.value)

            // Send updated value to server
            try {
                const response = await axios.post(`http://${ip?.ip}:7700/editPatientDetails`, {changes: {specialInstruction: e.target.value}, uid: id}).then((res)=>{
                    if(res.data.status === 'success'){
                        // setreload(reload + 1)
                    }
                })
            console.log("Server response:", response.data);
            } catch (error) {
            console.error("Error sending data:", error);
            }
    };


    
    
    const handleStatus = async(e) => {
        const status = e.target.value
        setstatus(status)
        try{
            await axios.post(`http://${ip?.ip}:7700/updatePatientStatus`, {uid: pid || id , status}).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('PATIENT STATUS UPDATED')
                    setreload((prev)=> prev + 1)
                }
            })
        }catch(error){
            console.log(error)
        }
    }

    const handleREquest =async(e)=>{
        const price = e.target.value
         try{
            await axios.post(`http://${ip?.ip}:7700/consultation`, {uid: fid || id, staffID: getid?._id, price }).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('PATIENT STATUS UPDATED')
                    setreload((prev)=> prev + 1)
                }
            })
        }catch(error){
            console.log(error)
        }
    }     

    const [discount, setdiscount] = useState(dcount)

    const handleDiscount =async(e)=>{
        const discount = e.target.value
        setdiscount(discount)

        try {
             await axios.post(`http://${ip?.ip}:7700/discount`, {uid: fid || id, discount }).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('PATIENT DISCOUNT ADDED')
                    setreload((prev)=> prev + 1)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const [fee, setfee] = useState('')

    const handleFee =async()=>{
        try {
            await axios.post(`http://${ip?.ip}:7700/procedure`, {uid: fid || id, price:fee, staffID: getid?._id }).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('PATIENT PROCEDURE SENT')
                    setreload((prev)=> prev + 1)
                    setfee('')
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const [diagnos, setdiagnos] = useState('')
    const [type, settype] = useState('')

    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

    const handleSearch = async(e) => {
        
        const searchQuery = typeof e === 'string' ? e : e?.target?.value || '';
        setgetsearch(searchQuery);

        if (searchQuery.trim().length === 0) {
            setsearch([]);
            return;
        }
        
        
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${ip?.ip}:7700/searchDiagnosis`, value);                
                setsearch(response.data.patients)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    const handleAddDiagnosis =async()=>{
        try {
            const value = {     
                name : diagnos,
                type,
                uid: pid || uid,
                staffID : getid?._id
            }

            const response = await axios.post(`http://${ip?.ip}:7700/Addpatientdiagnosis`, value);                
            setsearch(response.data.patients)        
            // // console.log(response)    
            if(response.data.status ==='success'){
                setreload(reload + 1)
                toast.success('DIAGNOSIS ADDED')
                setdiagnos('')
                setgetsearch('')
                settype('')
            }     
            
        } catch (err) {
            console.error('Error fetching search results', err);
        }
    }

    
    const [utilities, setutilities] = useState([])
    
    useEffect(()=>{
        const func =async()=>{
            try {
            await axios.post(`http://${ip?.ip}:7700/getpatientdiagnosis`, {uid: pid || uid}).then((res)=>{  
                // // console.log(res);
                        
                if(res.data.status === 'success'){
                setutilities(res.data.diagnos)
                setreload(0)
                }
            })
            } catch (error) {
            console.log(error); 
            }
        }
        func()
    },[reload, ip, uid, pid])
    
    const [delet, setdelet] = useState({})
    
      const handleDelete =async(id)=>{
        try {
          await axios.post(`http://${ip?.ip}:7700/deletpatientdiagnosis`, {serveID: id}).then((res)=>{
            if(res.data.status === 'success'){
              setreload(reload + 1)
              setdelet({})
            }
          })
        } catch (error) {
          console.log(error);
        }
      }

    const navigate = useNavigate()
      
    const handleView =(id, fid)=>{
        dispatch(
            setfids({
                id:id,
                fid: fid
            })
        )
        dispatch(
            setids({
                id:id,
                fid: fid
            })
        )
        
        const url = `/patientdetails/${id}/${fid}`
        navigate(url)
    }
    
    

  return (
    <div style={{position:'relative', overflow:'hidden', width:'100%'}} className='dashboard_body'>
    
        {
            !family ?
                <div style={{position:'absolute', top:'0', width:'100%', backgroundColor:'#fff', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 30px', boxSizing:'border-box'}}>
                    <h1 >{name}</h1>
                
                    <div className='patient_details_input_field1_' >
                        <h3 style={{color:'red', margin:'10px 0'}} >currecnt status {status === 'admitted' ? 'In Patient' : status === 'discharged' ? 'Out Patient' : status === 'In Patient' ? 'In Patient' : status === 'emergency' ? 'Emergency Patient' : 'Out Patient'}</h3>
                        <select  onChange={handleStatus}>
                            <option >Change status</option>
                            <option value={'admitted'} >In patient</option>
                            <option value={'Out Patient'}>Out Patient</option>
                            <option value={'emergency'}>emergency</option>
                        </select>
                    </div>            

                    <div className='patient_details_input_field1_' >
                        <h3 style={{ margin:'10px 0'}}>Add Discount {format.format(dcount)}</h3>
                        <input value={discount} onChange={handleDiscount} placeholder='Enter Discount Amount' />
                    </div>

                    <div className='patient_details_input_field1_' >
                        <h3 style={{ margin:'10px 0'}}>Consultation Bill</h3>
                        <select onChange={handleREquest}>
                            <option >SELECT CONSULTATION BILL</option>
                            <option value={500} >Consultation ₦500</option>
                            <option value={1000}>Consultation ₦1,000</option>
                            <option value={2000}>Consultation ₦2,000</option>
                        </select>
                    </div>

                    <div className='patient_details_input_field1_' >
                        <h3 style={{ margin:'10px 0'}}>PROCEDURE FEE</h3>
                        
                        <div>
                            <input style={{padding:'10px'}} value={fee} onChange={(e)=>setfee(e.target.value)} placeholder='Enter Procedure Fee' />
                            {
                                fee &&
                                <button style={{padding:'10px'}} onClick={handleFee} >SEND</button>
                            }
                        </div>
                    </div>
                </div>
            : null
        }

        {  
            center ?
                currenIndex === 0 &&
                <div className='dashboard_body' style={{width:'100%', marginTop:'100px'}}>
                    <div className='back_btn_' onClick={handlePrevious}>
                        <FaChevronLeft />
                        <h4>BACK</h4>
                    </div>
                    <div className='dashboard_body_patient_details_btns'>
                        <button className={currenIndex === 0 && 'dashboard_body_patient_details_btns_'}>PATIENT DETAILS</button>
                        <button onClick={()=>setCurrentIndex(1)} >VITALS</button>
                        <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS | SCAN</button>
                        {/* <button onClick={()=>setCurrentIndex(3)}>PREVIOUS VISITS</button> */}
                        <button onClick={()=>setCurrentIndex(3)}>PRESCRIPTION</button>
                        <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
                        <button onClick={()=>setCurrentIndex(4)}>TRANSACTION HISTORY</button>
                        <button onClick={()=>setCurrentIndex(6)}>URINE CHART</button>
                        <button onClick={()=>setCurrentIndex(7)}>UTILITIES | CONSUMABLES</button>
                    </div>

                    
                    {
                        Object.keys(changes)?.length > 0 &&
                        <div className='changes_count' >
                            <p>{Object.keys(changes)?.length} Changes detected. Click to save changes</p>
                            <button onClick={handleSave} >SAVE</button>
                        </div> 
                    }
                    
                    <div className='dashboard_body_header' style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between'}} >
                        <div style={{margin:'20px 0'}}>
                            <h4>CARD CREATED AT:</h4>
                            <h4>{timeString}, {day} | {month} | {year}</h4>
                        </div>
                
                        <div className='dashboard_body_patient_details_btns' style={{justifyContent:'flex-end', width:'50%', display:'flex'}}>
                            { patientIndex === 1 || patientIndex === 2 ?
                                <button onClick={()=>setpatientIndex(0)}>
                                    VIEW CARD
                                </button>
                                : 
                                <div style={{flex:1}} ></div>
                            }
                            <button onClick={()=>setpatientIndex(1)} className={patientIndex === 1 && 'dashboard_body_patient_details_btns_'}>
                                LABOUR CHART
                            </button>
                            <button onClick={()=>setpatientIndex(2)} className={patientIndex === 2 && 'dashboard_body_patient_details_btns_'}>
                                BABY VITALS
                            </button>
                        </div>
                    </div>

                    {
                        patientIndex === 0 &&
                        <>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='patient_details_' >
                                <div className='patient_details_input_field1' >
                                    {
                                        deposit &&
                                        <div className='patient_details_input_field1_'>
                                            <h4>DEPOSIT</h4>
                                            <h2>{formatted}</h2>
                                        </div>
                                    }
                                    <div className='patient_details_input_field1_' >
                                        <h4>PATIENT NAME</h4>
                                        <input placeholder='Enter Patient Name' value={name} onChange={(e)=>setname(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>CENTER</h4>
                                        <input placeholder='Enter center' value={center} onChange={(e)=>setcenter(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>CENTER</h4>
                                        <input placeholder='Enter center' value={center} onChange={(e)=>setcenter(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>SPECIAL POINTS</h4>
                                        <input placeholder='Enter special Point' value={specialPoints} onChange={(e)=>setspecialPoints(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>ADDRESS</h4>
                                        <input value={address} onChange={(e)=>setaddress(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>SECT</h4>
                                        <input value={sect} onChange={(e)=>setsect(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>DATE OF BIRTH</h4>
                                        <input type='date' value={dateOfBirth} onChange={(e)=>setdateOfBirth(e.target.value)} />
                                    </div>
                                    
                                    <div className='patient_details_input_field1_in_'>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>AGE</h4>
                                            <input type='number' value={age} onChange={(e)=>setage(e.target.value)} />
                                        </div>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>TRIBE</h4>
                                            <input value={tribe} onChange={(e)=>settribe(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className='patient_details_input_field1_' >
                                        <h4>SPOUSE PHONE NUMBER</h4>
                                        <input type='number' value={spousePhone} onChange={(e)=>setspousePhone(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>NEXT OF KIN</h4>
                                        <input value={nextOfKin} onChange={(e)=>setnextOfKin(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>NEXT OF KIN'S PHONE</h4>
                                        <input value={nextOfKinPhone} onChange={(e)=>setnextOfKinPhone(e.target.value)} />
                                    </div>
                                </div>
                                
                                <div className='patient_details_input_field1'>
                                    <div className='patient_details_input_field1_' >
                                        <h4>ANTE NATAL SUBSCRIPTION</h4>
                                        <select value={subscribe} onChange={(e)=>setsubscribe(e.target.value)}>
                                            <option>Select Subscription</option>
                                            <option value={'BASIC'}>BASIC</option>
                                            <option value={'SILVER'}>SILVER</option>
                                            <option value={'GOLD'}>GOLD</option>
                                        </select>
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>NEXT OF KIN'S ADDRESS</h4>
                                        <input value={nextOfKinAddress} onChange={(e)=>setnextOfKinAddress(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>DATE OF BOOKING</h4>
                                        <input type='date' value={dateOfBooking} onChange={(e)=>setdateOfBooking(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>OCCUPATION</h4>
                                        <input value={occupation} onChange={(e)=>setoccupation(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>LEVEL OF EDUCATION</h4>
                                        <input value={educationLevel} onChange={(e)=>seteducationLevel(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>MARITA STATUS</h4>
                                        <select value={maritalStatus} onChange={(e)=>setmaritalStatus(e.target.value)}>
                                            <option>Select Marital status</option>
                                            <option value={'married'}>Married</option>
                                            <option value={'divorce'}>Divorce</option>
                                            <option value={'single'}>Single</option>
                                            <option value={'widow'}>Widow</option>
                                        </select>
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>AGE AT MARRIAGE</h4>
                                        <input value={ageAtMarriage} onChange={(e)=>setageAtMarriage(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>L.M.P</h4>
                                        <input value={LMP} onChange={(e)=>setLMP(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>EDD BY USS</h4>
                                        <input value={eddByUss} onChange={(e)=>seteddByUss(e.target.value)} />
                                    </div>

                                    <div className='patient_details_input_field1_' >
                                        <h4>EDD DATE</h4>
                                        <input value={eddDate} onChange={(e)=>seteddDate(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>AVERAGE MONTHLY FAMILY INCOME</h4>
                                        <input value={AverageMonthlyFamilyIncome} onChange={(e)=>setAverageMonthlyFamilyIncome(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}

                            <div className='sidebar_spacer' ></div>

                                     {
                                    getnotes?.clinicalnote?.length > 0 &&
                                    getnotes?.clinicalnote?.map((note, i)=>{
                                        if(note?.staffID === getid?._id){
                                            return null
                                        }

                                        const getstattName = staff?.find((it)=> it._id === note?.staffID)
                                        
                                        return (
                                            <>
                                                <h3>Doctor {getstattName?.name}'s Clinical Note</h3>
                                                <div 
                                                    contentEditable={false}
                                                    suppressContentEditableWarning
                                                    dangerouslySetInnerHTML={{ __html: note?.note }}
                                                    key={i}
                                                    style={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    minHeight: '200px',
                                                    padding: '10px',
                                                    backgroundColor: 'whitesmoke',
                                                    width: '100%',
                                                    overflowY: 'scroll',
                                                    fontSize: '16px',
                                                    whiteSpace: 'pre-wrap',
                                                    height:'700px',
                                                    }}
                                                >
                                                </div>
                                            </>
                                    )})
                                }

                                <h3>YOUR CLINICAL NOTE</h3>                        
                                <div style={{width:'100%', display:'flex', alignItems:'center'}} >
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={handleInput}
                                        onFocus={handleEdit}
                                        style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        minHeight: '200px',
                                        padding: '10px',
                                        backgroundColor: '#fff',
                                        width: '70%',
                                        overflowY: 'scroll',
                                        fontSize: '16px',
                                        whiteSpace: 'pre-wrap',
                                        height:'700px',
                                        }}
                                    >
                                    </div>

                                    <div style={{width:'30%', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', height:'700px', overflowY:'scroll'}}>
                                        <div className='patient_details_input_field1_' style={{width:'95%'}}>
                                            <h4>SEARCH DIAGNOSIS</h4>
                                            <input value={getsearch} onChange={handleSearch} type='text'/>
                                        </div>
                                    <div className='display_all_utilities' style={{width:'95%', margin:'20px 0'}}>
                                        {
                                            search?.length > 0 &&
                                            search?.map((srch, i)=>(
                                                <div key={i} onClick={()=> {setdiagnos(srch?.name); setgetsearch(srch?.name); setsearch([])}} style={{width:'100%', backgroundColor:'#d1d1d1ff', cursor:'pointer'}}>
                                                    <div >
                                                        <p style={{fontWeight:'800', fontSize:'18px'}}>Name: {srch?.name}</p>
                                                        <p>Type: {srch?.type}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                        <div className='patient_details_input_field1_' style={{width:'95%'}}>
                                            <h4>CHOOSE CONFIRMATION METHOD</h4>
                                            <select value={type} onChange={(e)=> settype(e.target.value)} >
                                                <option >Select Confirmation Type</option>
                                                <option value={'TEST'} >TEST</option>
                                                <option value={'HISTORY'}>HISTORY</option>
                                            </select>
                                        </div>

                                        {
                                            diagnos === getsearch && type ?
                                                <button onClick={handleAddDiagnosis} className='add_staff_contaimer_button' >UPLOAD DIAGNOSIS</button>
                                            : null
                                        }

                                        <h3>PREVIOUS DIAGNOSIS</h3>

                                        <div className='display_all_utilities' style={{width:'95%', margin:'20px 0'}}>
                                            {
                                                utilities?.length > 0 ?
                                                utilities?.sort((a, b)=> b.timeStamp - a.timeStamp).map((cat, i)=>{
                                                    const date = new Date(cat?.timeStamp)
                                                    const day = date.getDate()
                                                    const month = date.getMonth() + 1
                                                    const year = date.getFullYear()
                                                    let hours = date.getHours()
                                                    const minutes = date.getMinutes()
                                                    const ampm = hours >= 12 ? "PM" : "AM"
                                                
                                                    hours = hours % 12
                                                    hours = hours ? hours : 12
                                                
                                                    const pad = (n) => n.toString().padStart(2, '0')
                                                
                                                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                                return(
                                                <div key={i} style={{width:'100%', backgroundColor:'#d1d1d1ff', cursor:'pointer'}}>
                                                <div>
                                                    <p>Name: {cat?.name}</p>
                                                    <p>Type: {cat?.type}</p>
                                                    <p>{`${day}-${month}-${year}`}, {timeString}</p>
                                                </div>
                                                    {
                                                        getid?._id === cat?.staffID &&
                                                        <button onClick={()=>setdelet(cat)} style={{padding:'10px', backgroundColor:'red', color:'white'}} >DELETE</button>
                                                    }
                                                </div>
                                                )})
                                            : null
                                            }
                                        </div>

                                        
                                        {  delet?.name &&
                                            <div style={{position:'absolute', width:'100%', height:'100%',  display:'flex', flexDirection:'column', backgroundColor:'transparent', top:'0', left:'0', alignItems:'center', justifyContent:'center'}}>
                                                <div style={{width:'400px', height:'300px', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}>
                                                
                                                    <div className='patient_details_input_field1_'  >
                                                        <h1>Want to Delete {delet?.name} ?</h1>
                                                    </div>
                                                    
                                                    <button className='add_staff_contaimer_button' onClick={()=>handleDelete(delet?._id)} style={{color:'white', background:'red'}}>CONFIRM</button>
                                                    <button className='add_staff_contaimer_button' onClick={()=>setdelet('')} style={{color:'blue', background:'Whitesmoke'}}>CANCEL EDIT</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                            <div className='sidebar_spacer' ></div>

                            <h3>PREVIOUS MEDICAL HISTORY</h3>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='previouse_medicals_checkbox' >
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>HEART DISEASE</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={heartDisease === 'yes' ? true : false} onChange={(e)=> setheartDisease('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={heartDisease === 'no' ? true : false} onChange={(e)=> setheartDisease('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>KIDNEY DISEASE</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={kidneyDisease === 'yes' ? true : false} onChange={(e)=> setkidneyDisease('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input type='checkbox' checked={kidneyDisease === 'no' ? true : false} onChange={(e)=> setkidneyDisease('no')} />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>DIABETES</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={Diabetes === 'yes' ? true : false} onChange={(e)=> setDiabetes('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={Diabetes === 'no' ? true : false} onChange={(e)=> setDiabetes('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>CHEST DISEASE</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={ChestDisease === 'yes' ? true : false} onChange={(e)=> setChestDisease('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={ChestDisease === 'no' ? true : false} onChange={(e)=> setChestDisease('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>COVID</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={Covid === 'yes' ? true : false} onChange={(e)=> setCovid('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={Covid === 'no' ? true : false} onChange={(e)=> setCovid('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='patient_details_input_field1_operations'>
                                <div className='patient_details_input_field1_' >
                                    <h4>OPERATIONS</h4>
                                    <input value={NumberOfOperations} onChange={(e)=>setNumberOfOperations(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>PREVIOUS PREGNANCIES TOTAL</h4>
                                    <input value={PreviousePregnancies} onChange={(e)=>setPreviousePregnancies(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>NO. OF LIVING CHILDREN</h4>
                                    <input value={NoOfLivingChildren} onChange={(e)=>setNoOfLivingChildren(e.target.value)} />
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='sidebar_spacer' ></div>

                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <table className='custome_table'>
                                <thead>
                                <tr>
                                    <th>DATE OF BIRTH</th>
                                    <th>DURATION OF PREGNANCY</th>
                                    <th>BIRTH WEIGHT</th>
                                    <th>COMPLICATION IN PREGNANCY</th>
                                    <th>COMPLICATION IN LABOUR</th>
                                    <th>PUER PERIUM</th>
                                    <th>AGE AT DEATH</th>
                                    <th>CAUSE OF DEATH</th>
                                    <th>ACTION</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    formData?.map((row, index) => (
                                    <tr key={index}>
                                    <td><input name='dateOfBirth' value={row.dateOfBirth} onChange={(e) => handleChange(index, e)} type='date' /></td>
                                    <td><input name='durationOfPregnancy' value={row.durationOfPregnancy} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='birthWeight' value={row.birthWeight} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='complicationInPregnancy' value={row.complicationInPregnancy} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='complicationIInLabour' value={row.complicationIInLabour} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='puerPremium' value={row.puerPremium} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='ageAtDeath' value={row.ageAtDeath} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='causeOfDeath' value={row.causeOfDeath} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td>
                                        <button onClick={() => removeRow({ index, opId: row.opId })} className='delete_btn'>Delete</button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className='custome_table_btn'>
                                <button className='custome_table_btn1' onClick={addRow}>ADD</button>
                                <button className='custome_table_btn2' onClick={handleSubmit}>NEXT</button>
                            </div>
                            
                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <div className='sidebar_spacer' ></div>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='previouse_medicals_textareas' >
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>ATTACH LETTER AND SUMMARIES HERE</h4>
                                        <textarea value={letter} onChange={(e)=>setletter(e.target.value)} />
                                    </div>
                                </div>
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>ATTACH REPORT OF SPECIAL INVESTIGATION HERE</h4>
                                        <textarea value={specialInvestigation} onChange={(e)=>setspecialInvestigation(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            
                        
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='patient_details_' >
                                <div className='patient_details_input_field1' >
                                <h3>PRIMARY ASSESSMENT</h3>
                                <div className='patient_details_input_field1_' >
                                    <h4>HISTORY OF PREGNANCY</h4>
                                    <input value={historyPreg} onChange={(e)=>sethistoryPreg(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>URINARY SYMPTOMS</h4>
                                    <input value={urinarySymptoms} onChange={(e)=>seturinarySymptoms(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>VOMITING</h4>
                                    <input value={vomiting} onChange={(e)=>setvomiting(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' > 
                                    <h4>VAGINAL DISCHARGE</h4>
                                    <input value={vaginalDischarge} onChange={(e)=>setvaginalDischarge(e.target.value)} />
                                </div>
                            </div>

                            <div className='patient_details_input_field1'>
                                <div className='patient_details_input_field1_' >
                                    <h4>SWELLING OF ANKLES</h4>
                                    <input value={swellingOfAnkles} onChange={(e)=>setswellingOfAnkles(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>BLEEDING</h4>
                                    <input value={bleeding} onChange={(e)=>setbleeding(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>OTHER SYMPTOMS</h4>
                                    <input value={otherSymptoms} onChange={(e)=>setotherSymptoms(e.target.value)} />
                                </div>
                            </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='sidebar_spacer' ></div>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='patient_details_' >
                                <div className='patient_details_input_field1' >
                                    <h3>PHYSICAL EXAMINATION</h3>
                                    <div className='patient_details_input_field1_' >
                                        <h4>GENERAL CONDITION</h4>
                                        <input value={generalCondition} onChange={(e)=>setgeneralCondition(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>OEDEMA</h4>
                                        <input value={oedema} onChange={(e)=>setoedema(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>ANAEMIA</h4>
                                        <input value={anaemia} onChange={(e)=>setanaemia(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>RESPIRATORY SYSTEM</h4>
                                        <input value={respiratorySystem} onChange={(e)=>setrespiratorySystem(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>CARDIOVASCULAR SYSTEM</h4>
                                        <input value={cardiovascularSystem} onChange={(e)=>setcardiovascularSystem(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>ABDOMEN</h4>
                                        <input value={abdomen} onChange={(e)=>setabdomen(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>SPLEEN</h4>
                                        <input value={spleen} onChange={(e)=>setspleen(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>LIVER</h4>
                                        <input value={liver} onChange={(e)=>setliver(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>PRELIMINARY PELVIC ASSESSMENT</h4>
                                        <input value={preliminary} onChange={(e)=>setpreliminary(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>HEIGHT</h4>
                                        <input value={height} onChange={(e)=>setheight(e.target.value)} />
                                    </div>
                                    
                                    <div className='patient_details_input_field1_in_'>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>FT</h4>
                                            <input value={feet} onChange={(e)=>setfeet(e.target.value)} />
                                        </div>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>INS</h4>
                                            <input value={inches} onChange={(e)=>setinches(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='patient_details_input_field1'>

                                    <div className='patient_details_input_field1_' >
                                        <h4>WEIGHT</h4>
                                        <input value={weight} onChange={(e)=>setweight(e.target.value)} />
                                    </div>
                                    
                                    <div className='patient_details_input_field1_in_'>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>ST</h4>
                                            <input value={ST} onChange={(e)=>setST(e.target.value)} />
                                        </div>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>IBS</h4>
                                            <input value={LBS} onChange={(e)=>setLBS(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className='patient_details_input_field1_' >
                                        <h4>B.P</h4>
                                        <input value={BP} onChange={(e)=>setBP(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>URINE</h4>
                                        
                                        <div className='patient_details_input_field1_in_'>
                                            <div className='patient_details_input_field1_in' >
                                                <h4>ALBUMIN</h4>
                                                <input value={albumin} onChange={(e)=>setalbumin(e.target.value)} />
                                            </div>
                                            <div className='patient_details_input_field1_in' >
                                                <h4>SUGAR</h4>
                                                <input value={sugar} onChange={(e)=>setsugar(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='patient_details_input_field1_' >
                                        <h4>BREAST AND NIPPLES</h4>
                                        <input value={breastNipples} onChange={(e)=>setbreastNipples(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>HB</h4>
                                        <input value={HB} onChange={(e)=>setHB(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>GENOTYPE</h4>
                                        <input value={genotype} onChange={(e)=>setgenotype(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>USS</h4>
                                        <input value={USS} onChange={(e)=>setUSS(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>BLOOD GROUP</h4>
                                        <input value={bloodGroup} onChange={(e)=>setbloodGroup(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>RH</h4>
                                        <input value={RB} onChange={(e)=>setRB(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>CHEST X-RAY</h4>
                                        <input value={chestXray} onChange={(e)=>setchestXray(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            
                            <div className='sidebar_spacer' ></div>
                        
                            <h3>OTHER ABNORMALITIES</h3>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='previouse_medicals_textareas' >
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>COMMENTS</h4>
                                        <textarea value={comments} onChange={handleChanges1} />
                                    </div>
                                </div>
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>PELVIC ASSESSMENT AT 36 WEEKS</h4>
                                        <textarea value={pelvicAssessment} onChange={handleChanges2} />
                                    </div>
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            
                            <div className='sidebar_spacer' ></div>

                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <h3>ANTE NATAL RECORDS</h3>
                            
                            <p className='custome_table_guide'>Edit table details, Click Add button to add new table row and Click the button "Save changes" to save</p>
                            <table className='custome_table'>
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>HEIGHT OF FUNFUS ABOVE PUBIS</th>
                                        <th>RELATION OF PRESENTING PART TO BRIM</th>
                                        <th>PRESENTATION AND POSITION</th>
                                        <th>FOETAL HEART</th>
                                        <th>URINE</th>
                                        <th>B.P.</th>
                                        <th>WEIGHT</th>
                                        <th>HB</th>
                                        <th>OEDEMA</th>
                                        <th>REMARKS</th>
                                        <th>INITIAL OF EXAMINER</th>
                                        <th>RETURN</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>                  
                                    {formData1.map((row, index) => (
                                    <tr key={index}>
                                        <td><input name='date' value={row.date} onChange={(e) => handleChange1(index, e)} type='date' /></td>
                                        <td><input name='heightOfFundus' value={row.heightOfFundus} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='presentingPartToBrim' value={row.presentingPartToBrim} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='presentationAndPosition' value={row.presentationAndPosition} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='foetalHeart' value={row.foetalHeart} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='urine' value={row.urine} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='BP' value={row.BP} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='weight' value={row.weight} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='HB' value={row.HB} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='oedema' value={row.oedema} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='remark' value={row.remark} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='initialOfExaminer' value={row.initialOfExaminer} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='Return' value={row.Return} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td>
                                        <button onClick={() => removeRow1({index, Id:row?._id})} className='delete_btn'>Delete</button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className='custome_table_btn'>
                                <button className='custome_table_btn1' onClick={addRow1}>ADD</button>
                                <button className='custome_table_btn2' onClick={handleSubmit1}>SAVE</button>
                            </div>
                            
                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <div className='sidebar_spacer' ></div>

                            <div className='previouse_medicals_textareas_NOTE' >
                                <div >
                                    <h4>SPECIAL INSTRUCTIONS</h4>
                                    <textarea value={specialInstruction} onChange={handleChanges3} />
                                </div>
                            </div>
                        </>
                    }

                    {
                        patientIndex === 1 &&
                        <LabourChart/>
                    }

                    { 
                        patientIndex === 2 &&
                        <BabyVitals/>
                    }
                    
                    <div className='sidebar_spacer' ></div>
                </div>
            : 
            currenIndex === 0 &&
                <div className='dashboard_body' style={!family ? {width:'100%', marginTop:'100px'} : {width:'100%'}}>
                    <div className='back_btn_' onClick={()=> {handlePrevious(); setpid('')}}>
                        <FaChevronLeft />
                        <h4>BACK</h4>
                    </div>

                    <h3>PATIENT RECORDS</h3>
                    {
                        family &&
                        <h1>{name}</h1>
                    }

                    {
                        familyName?.name &&
                        <h1>{familyName?.name}</h1>
                    }

                    {
                        !family ?
                        <div className='dashboard_body_patient_details_btns'>
                            <button className={currenIndex === 0 && 'dashboard_body_patient_details_btns_'}>PATIENT DETAILS</button>
                            <button onClick={()=>{setCurrentIndex(1); setreload(reload + 1)}} >VITALS</button>
                            <button onClick={()=>{setCurrentIndex(2); setreload(reload + 1)}}>LAB RESULTS | SCAN</button>
                            <button onClick={()=>{setCurrentIndex(3); setreload(reload + 1)}}>PRESCRIPTION</button>
                            <button onClick={()=>{setCurrentIndex(5); setreload(reload + 1)}}>MEDICATION CHART</button>
                            <button onClick={()=>{setCurrentIndex(4); setreload(reload + 1)}}>TRANSACTION HISTORY</button>
                            <button onClick={()=>{setCurrentIndex(6); setreload(reload + 1)}}>URINE CHART</button>
                            <button onClick={()=>{setCurrentIndex(7); setreload(reload + 1)}}>UTILITIES | CONSUMABLES</button>
                        </div>
                    : null
                    }

                    {
                        Object.keys(changes)?.length > 0 &&
                        <div className='changes_count' style={{zIndex:20000, top:'120px'}} >
                            <p>{Object.keys(changes)?.length} Changes detected. Click to save changes</p>
                            <button onClick={handleSave} >SAVE</button>
                        </div>
                    }
                    
                    <div className='dashboard_body_patient_details_btns'>

                        {
                            getFamilyMembers?.length > 0 ?
                                getFamilyMembers?.map((item, i)=>(
                                    <button onClick={()=>{setpid(item?._id); handleView(item?._id, item?.familyid)}} style={{textTransform:'uppercase'}} key={i} >{item?.name} ( {item?.status === 'admitted' ? 'In Patient' : item?.status === 'discharged' ? 'Out Patient' : item?.status === 'emergency' ? 'Emergency Patient' : 'Out Patient'} )</button>
                                ))
                            : null 
                        }
                    </div>

                    <div style={{margin:'20px 0'}}>
                        <h4>CARD CREATED AT:</h4>
                        <h4>{timeString}, {day} | {month} | {year}</h4>
                    </div>
                    
                    <div className='patient_details_' >
                        <div className='patient_details_input_field1' >
                            <div className='patient_details_input_field1_' style={{display:'flex', alignItems:'center', margin:'30px 0'}}>
                                <h2>VISITS : </h2>
                                <h2 style={{margin:'0 10px', color:'red'}}>{visists}</h2>
                            </div>
                            <div className='patient_details_input_field1_'>
                                <h4>PATIENT NAME</h4>
                                <input value={name} onChange={(e)=> setname(e.target.value)} placeholder='Enter Patient Name' />
                            </div>
                            <div className='patient_details_input_field1_'>
                                <h4>ADDRESS</h4>
                                <input value={address} onChange={(e)=> setaddress(e.target.value)} placeholder='Enter Patient Address' />
                            </div>
                            <div className='patient_details_input_field1_'>
                                <h4>RELIGION</h4>
                                <select value={religion} onChange={(e)=> setreligion(e.target.value)} >
                                    <option >Select Religion</option>
                                    <option value={'christian'} >Christian</option>
                                    <option value={'islam'}>Islam</option>
                                    <option value={'other'}>Other</option>
                                </select>
                            </div>
                            {
                                deposit &&
                                <div className='patient_details_input_field1_'>
                                    <h4>DEPOSIT</h4>
                                    <h2>{formatted}</h2>
                                </div>
                            }
                        </div>

                        <div className='patient_details_input_field1' >
                            <div className='patient_details_input_field1_'>
                                <h4>HOP NO.</h4>
                                <p>{hop}</p>
                            </div>
                            {
                                !family ?
                                <div className='patient_details_input_field1_in_'>
                                    <div className='patient_details_input_field1_in' >
                                        <h4>DATE OF BIRTH</h4>
                                        <input  value={dateOfBirth} onChange={(e)=> setdateOfBirth(e.target.value)}  type='date'/>
                                    </div>
                                    <div className='patient_details_input_field1_in' >
                                        <h4>AGE</h4>
                                        <input type='number' placeholder='Enter Patient Age'  value={age} onChange={(e)=> setage(e.target.value)}  />
                                    </div>
                                    
                                    <div className='patient_details_input_field1_'>
                                        <h4>AGE TYPE</h4>
                                        <select value={AgeType} onChange={(e)=> setAgeType(e.target.value)} >
                                            <option >Select Age Type</option>
                                            <option value={'days'} >days</option>
                                            <option value={'weeks'}>weeks</option>
                                            <option value={'months'}>months</option>
                                            <option value={'years'}>years</option>
                                        </select>
                                    </div>
                                </div>
                                : null
                            }
                            <div className='patient_details_input_field1_in_'>
                                {
                                    !family ?
                                    <div className='patient_details_input_field1_in1' >
                                        <div className='previouse_medicals_checkbox_text'>
                                            <h4>SEX</h4>
                                            <div>
                                                <div>
                                                    <p>Male</p>
                                                    <input checked={sex === 'male' ? true : false} onChange={(e)=> setsex('male')}  type='checkbox' />
                                                </div>
                                                
                                                <div>
                                                    <p>Female</p>
                                                    <input checked={sex === 'female' ? true : false} onChange={(e)=> setsex('female')} type='checkbox' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : 
                                    <div className='patient_details_input_field1_in_'>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>N0. FAMILY MEMBERS</h4>
                                            <input type='number' placeholder='Enter number of family members'  value={members} onChange={(e)=> setmembers(e.target.value)}  />
                                        </div>
                                    </div>
                                }
                                <div className='patient_details_input_field1_in' >
                                    <h4>PATIENT PHONE NUMBER</h4>
                                    <input type='number' placeholder='Enter Patient Phone Number'  value={phone} onChange={(e)=> setphone(e.target.value)}  />
                                </div>
                            </div>
                            <div className='patient_details_input_field1_in_'>
                                <div className='patient_details_input_field1_in' >
                                    <h4>NEXT OF KIN</h4>
                                    <input placeholder='Enter Next Kin' value={nextOfKin} onChange={(e)=> setnextOfKin(e.target.value)}   />
                                </div>
                                <div className='patient_details_input_field1_in' >
                                    <h4>NEXT OF KIN PHONE NUMBER</h4>
                                    <input type='number' placeholder='Enter Next of kin Phone Number'  value={nextOfKinPhone} onChange={(e)=> setnextOfKinPhone(e.target.value)}  />
                                </div>
                            </div>
                        </div>
                    </div>
                        
        
                    {
                        !family ?
                        <div className='previouse_medicals_textareas_NOTE' >
                            <div >
                                <h4>CLINICAL NOTES</h4>

                                {
                                    notes !== '' &&
                                    <>
                                        <h3>PREVIOUS CLINICAL NOTE</h3>
                                        <div 
                                            contentEditable={false}
                                            suppressContentEditableWarning
                                            dangerouslySetInnerHTML={{ __html: notes }}
                                            style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            minHeight: '200px',
                                            padding: '10px',
                                            backgroundColor: 'whitesmoke',
                                            width: '100%',
                                            overflowY: 'scroll',
                                            fontSize: '16px',
                                            whiteSpace: 'pre-wrap',
                                            height:'700px',
                                            marginBottom:'20px'
                                            }}
                                        >
                                        </div>
                                    </>
                                }

                                {
                                    getnotes?.clinicalnote?.length > 0 &&
                                    getnotes?.clinicalnote?.map((note, i)=>{
                                        if(note?.staffID === getid?._id){
                                            return null
                                        }

                                        const getstattName = staff?.find((it)=> it._id === note?.staffID)
                                        
                                        return (
                                            <>
                                                <h3>Doctor {getstattName?.name}'s Clinical Note</h3>
                                                <div 
                                                    contentEditable={false}
                                                    suppressContentEditableWarning
                                                    dangerouslySetInnerHTML={{ __html: note?.note }}
                                                    key={i}
                                                    style={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    minHeight: '200px',
                                                    padding: '10px',
                                                    backgroundColor: 'whitesmoke',
                                                    width: '100%',
                                                    overflowY: 'scroll',
                                                    fontSize: '16px',
                                                    whiteSpace: 'pre-wrap',
                                                    height:'700px',
                                                    }}
                                                >
                                                </div>
                                            </>
                                    )})
                                }

                                <h3>YOUR CLINICAL NOTE</h3>                        
                                <div style={{width:'100%', display:'flex', alignItems:'center'}} >
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={handleInput}
                                        onFocus={handleEdit}
                                        style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        minHeight: '200px',
                                        padding: '10px',
                                        backgroundColor: '#fff',
                                        width: '70%',
                                        overflowY: 'scroll',
                                        fontSize: '16px',
                                        whiteSpace: 'pre-wrap',
                                        height:'700px',
                                        }}
                                    >
                                    </div>

                                    <div style={{width:'30%', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', height:'700px', overflowY:'scroll'}}>
                                        <div className='patient_details_input_field1_' style={{width:'95%'}}>
                                            <h4>SEARCH DIAGNOSIS</h4>
                                            <input value={getsearch} onChange={handleSearch} type='text'/>
                                        </div>
                                    <div className='display_all_utilities' style={{width:'95%', margin:'20px 0'}}>
                                        {
                                            search?.length > 0 &&
                                            search?.map((srch, i)=>(
                                                <div key={i} onClick={()=> {setdiagnos(srch?.name); setgetsearch(srch?.name); setsearch([])}} style={{width:'100%', backgroundColor:'#d1d1d1ff', cursor:'pointer'}}>
                                                    <div >
                                                        <p style={{fontWeight:'800', fontSize:'18px'}}>Name: {srch?.name}</p>
                                                        <p>Type: {srch?.type}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                        <div className='patient_details_input_field1_' style={{width:'95%'}}>
                                            <h4>CHOOSE CONFIRMATION METHOD</h4>
                                            <select value={type} onChange={(e)=> settype(e.target.value)} >
                                                <option >Select Confirmation Type</option>
                                                <option value={'TEST'} >TEST</option>
                                                <option value={'HISTORY'}>HISTORY</option>
                                            </select>
                                        </div>

                                        {
                                            diagnos === getsearch && type ?
                                                <button onClick={handleAddDiagnosis} className='add_staff_contaimer_button' >UPLOAD DIAGNOSIS</button>
                                            : null
                                        }

                                        <h3>PREVIOUS DIAGNOSIS</h3>

                                        <div className='display_all_utilities' style={{width:'95%', margin:'20px 0'}}>
                                            {
                                                utilities?.length > 0 ?
                                                utilities?.sort((a, b)=> b.timeStamp - a.timeStamp).map((cat, i)=>{
                                                    const date = new Date(cat?.timeStamp)
                                                    const day = date.getDate()
                                                    const month = date.getMonth() + 1
                                                    const year = date.getFullYear()
                                                    let hours = date.getHours()
                                                    const minutes = date.getMinutes()
                                                    const ampm = hours >= 12 ? "PM" : "AM"
                                                
                                                    hours = hours % 12
                                                    hours = hours ? hours : 12
                                                
                                                    const pad = (n) => n.toString().padStart(2, '0')
                                                
                                                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                                return(
                                                <div key={i} style={{width:'100%', backgroundColor:'#d1d1d1ff', cursor:'pointer'}}>
                                                <div>
                                                    <p>Name: {cat?.name}</p>
                                                    <p>Type: {cat?.type}</p>
                                                    <p>{`${day}-${month}-${year}`}, {timeString}</p>
                                                </div>
                                                    {
                                                        getid?._id === cat?.staffID &&
                                                        <button onClick={()=>setdelet(cat)} style={{padding:'10px', backgroundColor:'red', color:'white'}} >DELETE</button>
                                                    }
                                                </div>
                                                )})
                                            : null
                                            }
                                        </div>

                                        
                                        {  delet?.name &&
                                            <div style={{position:'absolute', width:'100%', height:'100%',  display:'flex', flexDirection:'column', backgroundColor:'transparent', top:'0', left:'0', alignItems:'center', justifyContent:'center'}}>
                                                <div style={{width:'400px', height:'300px', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}>
                                                
                                                    <div className='patient_details_input_field1_'  >
                                                        <h1>Want to Delete {delet?.name} ?</h1>
                                                    </div>
                                                    
                                                    <button className='add_staff_contaimer_button' onClick={()=>handleDelete(delet?._id)} style={{color:'white', background:'red'}}>CONFIRM</button>
                                                    <button className='add_staff_contaimer_button' onClick={()=>setdelet('')} style={{color:'blue', background:'Whitesmoke'}}>CANCEL EDIT</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                    }

                    <div style={{height:'700px', width:'100%'}}></div>
                    <div style={{height:'700px', width:'100%'}}></div>
                </div>
        }

        { 
            currenIndex === 1 &&
            <Vitals handleBack={handleBack} currenIndex={currenIndex} setCurrentIndex={setCurrentIndex} />
        }

        {
            currenIndex === 2 &&
            <LabResult handleBack={handleBack} currenIndex={currenIndex} setCurrentIndex={setCurrentIndex} />
        }

        {
            currenIndex === 3 &&
            <Prescriptions admin={admin} handleBack={handleBack} currenIndex={currenIndex} reload={reload} setreload={setreload} setCurrentIndex={setCurrentIndex} />
        }

        {
            currenIndex === 4 &&
            <TransactionHistory handleBack={handleBack} currenIndex={currenIndex} setCurrentIndex={setCurrentIndex} />
        }
        
        {
            currenIndex === 5 &&
            <Medications currentIndex={currenIndex} setcurrentIndex={setCurrentIndex} handleBack={handleBack}/>
        }
        
        {
            currenIndex === 6 &&
            <UrineOutput currentIndex={currenIndex} setcurrentIndex={setCurrentIndex} handleBack={handleBack}/>
        }
        
        {
            currenIndex === 7 &&
            <DispanseUtils currentIndex={currenIndex} setcurrentIndex={setCurrentIndex} handleBack={handleBack}/>
        }
    </div>
  )
}

export default PatientDetails