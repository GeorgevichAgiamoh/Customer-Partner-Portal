import { format } from "date-fns"
import { mCountry, mLga, mState } from "monagree-locs"
import {  myEles, spin_genders, spin_marital, spin_nok } from "../../helper/general"
import { mBanks } from "monagree-banks"



export class schoolBasicinfo{
    generalData:schoolGeneralinfo
    propData:schoolPropInfo
    data:any
    constructor(data:any){
        this.data = data
        this.generalData = new schoolGeneralinfo(null)
        this.propData = new schoolPropInfo(null)
    }
    getSchoolID(){
        return this.data['user_id']
    }
    getSchoolName(){
        return this.data['sname']
    }
    getEmail(){
        return this.data['eml'] ?? defVal
    }
    getPhone(){
        return this.data['phn']
    }
    getPartnerCode(){
        return this.data['pcode']
    }
    isVerified(){
        return this.data['verif']=='1'
    }
    isDeleted(){
        return this.data['verif']=='2'
    }
    isPaid(){ //One time reg fee
        return this.data['pay']=='1'
    }

    //---CUSTOM
    isNatural(){
        return this.data['pcode']=='0'
    }
    setGeneralData(generalData:schoolGeneralinfo){
        this.generalData = generalData;
    }
    setFinData(propData:schoolPropInfo){
        this.propData = propData
    }

    isPrepared(){
        return this.generalData?.data!=null && this.propData?.data!=null
    }

    getRegDate(){
        return getCreatedTime(this.data)
    }
}



export class partnerBasicinfo{
    generalData:partnerGeneralinfo
    finData:partnerFinancialinfo
    data:any
    constructor(data:any){
        this.data = data
        this.generalData = new partnerGeneralinfo(null)
        this.finData = new partnerFinancialinfo(null)
    }
    getPartnerID(){
        return this.data['user_id']
    }
    getFirstName(){
        return this.data['fname']
    }
    getMiddleName(){
        return this.data['mname']
    }
    getLastName(){
        return this.data['lname']
    }
    getEmail(){
        return this.data['eml'] ?? defVal
    }
    getPhone(){
        return this.data['phn']
    }
    isVerified(){
        return this.data['verif']=='1'
    }
    isDeleted(){
        return this.data['verif']=='2'
    }

    //--CUSTOM

    setGeneralData(generalData:partnerGeneralinfo){
        this.generalData = generalData;
    }
    setFinData(finData:partnerFinancialinfo){
        this.finData = finData
    }

    isPrepared(){
        return this.generalData?.data!=null && this.finData?.data!=null
    }
    getRegDate(){
        return getCreatedTime(this.data)
    }
}


export const defVal = 'NIL'

export class schoolGeneralinfo{
    data:any
    constructor(data:any){
        this.data = data
    }
    getSchoolID(){
        return !this.data?defVal:this.data['user_id']
    }
    isLocsCustom(){
        return mState.getStateByCode('NG',this.getState()) == undefined
    }
    getCountry(){
        return 'NG'
    }
    getState(){
        return !this.data?defVal:this.data['state']
    }
    getLga(){
        return !this.data?defVal:this.data['lga']
    }
    getAddr(){
        return !this.data?defVal:this.data['addr']
    }
    getVision(){
        return !this.data?defVal:this.data['vision']
    }
    getMission(){
        return !this.data?defVal:this.data['mission']
    }
    getValues(){
        return !this.data?defVal:this.data['values']
    }

    //--CUSTOM

    getFormattedCountry(){
        return !this.data?defVal:mCountry.getCountryByCode(this.getCountry())?.getName()
    }
    getFormattedState(){
        return !this.data?defVal:(mState.getStateByCode(this.getCountry(),this.getState())?.getName() || (this.getState() as string))
    }
    getFormattedLGA(){
        return !this.data?defVal:(mLga.getLgaByCode(this.getCountry(),this.getState(),this.getLga())?.getName() || (this.getLga() as string))
    }
}



export class partnerGeneralinfo{
    data:any
    constructor(data:any){
        this.data = data
    }
    getPartnerID(){
        return !this.data?defVal:this.data['user_id']
    }
    isLocsCustom(){
        return mState.getStateByCode('NG',this.getState()) == undefined
    }
    getCountry(){
        return 'NG'
    }
    getState(){
        return !this.data?defVal:this.data['state']
    }
    getLga(){
        return !this.data?defVal:this.data['lga']
    }
    getAddr(){
        return !this.data?defVal:this.data['addr']
    }
    getGender(){
        return !this.data?defVal:this.data['sex']
    }

    //--CUSTOM

    getFormattedCountry(){
        return !this.data?defVal:mCountry.getCountryByCode(this.getCountry())?.getName()
    }
    getFormattedState(){
        return !this.data?defVal:(mState.getStateByCode(this.getCountry(),this.getState())?.getName() || (this.getState() as string))
    }
    getFormattedLGA(){
        return !this.data?defVal:(mLga.getLgaByCode(this.getCountry(),this.getState(),this.getLga())?.getName() || (this.getLga() as string))
    }
}


export class partnerFinancialinfo{
    data:any
    constructor(data:any){
        this.data = data
    }
    getPartnerID(){
        return !this.data?defVal:this.data['user_id']
    }
    getBankCode(){
        return !this.data?defVal:this.data['bnk']
    }
    getAccountNumber(){
        return !this.data?defVal:this.data['anum']
    }
    getAccountName(){
        return !this.data?defVal:this.data['aname']
    }

    //--- Custom

    getFormattedbank(){
        return !this.data?defVal:mBanks.getBankByCode(this.getBankCode())!.name
    }
}




export class schoolPropInfo{
    data:any
    constructor(data:any){
        this.data = data
    }
    getSchoolID(){
        return !this.data?defVal:this.data['user_id']
    }
    getFirstName(){
        return !this.data?defVal:this.data['fname']
    }
    getLastName(){
        return !this.data?defVal:this.data['lame']
    }
    getMiddleName(){
        return !this.data?defVal:this.data['mname']
    }
    getGender(){
        return !this.data?defVal:this.data['sex']
    }
    getPhone(){
        return !this.data?defVal:this.data['phn']
    }
    getAddress(){
        return !this.data?defVal:this.data['addr']
    }
    getEmail(){
        return !this.data?defVal:this.data['eml']
    }
}



export class partnerHighlights{
    data:any
    constructor(data:any){
        this.data = data
    }
    getTotalSchools(){
        return this.data['totalSchools']
    }
    getTotalCommissionsAmt(){
        return this.data['totalComsAmt']
    }
    getTotalComs(){
        return this.data['totalComs']
    }
}


export class adminHighlights{
    data:any
    constructor(data:any){
        this.data = data
    }
    getTotalSchools(){
        return this.data['totalSchools']
    }
    getTotalPartners(){
        return this.data['totalPartners']
    }
    getTotalPayments(){
        return (this.data['totalPayments'] * 20000).toString()
    }
}



export class annEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getTitle(){
        return this.data['title']
    }
    getMsg(){
        return this.data['msg']
    }
    getTime(){
        return format(new Date(parseFloat(this.data['time'])),'dd/MM/yy')
    }
}

export class partnerComEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getPartnerId(){
        return this.data['partner_id']
    }
    getSchoolId(){
        return this.data['school_id']
    }
    getAmt(){
        return this.data['amt']
    }
    getTime(){
        return format(new Date(parseFloat(this.data['time'])),'dd/MM/yy')
    }
    getRef(){
        return this.data['ref']
    }
    getRefId(){
        return this.data['ref'].split('-')[4]
    }
}

export class verifStat{
    data:any
    constructor(data:any){
        this.data = data
    }
    getSchoolVerif(){
        return this.data['schoolsVerif']
    }
    getSchoolsNotVerif(){
        return this.data['schoolsNotVerif']
    }
    getSchoolsDeleted(){
        return this.data['schoolsDeleted']
    }
    getPartnersVerif(){
        return this.data['partnersVerif']
    }
    getPartnersNotVerif(){
        return this.data['partnersNotVerif']
    }
    getPartnersDeleted(){
        return this.data['partnersDeleted']
    }
    
}

export class payStat{
    data:any
    constructor(data:any){
        this.data = data
    }
    getSchoolsPaid(){
        return this.data['schoolsPaid']
    }
    getSchoolsNotPaid(){
        return this.data['schoolsNotPaid']
    }
}

//--------------------------------------------------------------------------------------------------------

export function getCreatedTime(data:any,includeTime?:boolean){
    const ct = data['created_at'] as string
    const createdAtDate = new Date(ct);
    const formattedDate = format(createdAtDate, 'dd/MM/yy');
    const formattedTime = format(createdAtDate, 'HH:mm:ss');
    return includeTime?formattedDate+' '+formattedTime:formattedDate
}


export class payRecordEle{
    data:any
    constructor(data:any){
        console.log(data)
        this.data = data
    }
    getMemId(){
        return this.data['memid']
    }
    getRef(){
        return this.data['ref']
    }
    getName(){
        return this.data['name']
    }
    getTime(){
        return this.data['time']
    }
    //---NULLABLE
    getYear(){
        return this.data['year']
    }
    getShares(){
        return this.data['shares']
    }
    getProof(){
        if(this.isProofFile()){
            return this.getMemId()+'_'+this.getTime()
        }
        return this.data['proof']
    }
    isProofFile(){
        return this.data['proof'] == 'f'
    }
    getRecordId(){
        return this.data['id']
    }
    //--CUSTOM
    getAmt(){
        return (this.getRef() as string).split('-')[2]
    }
    getReceiptId(){
        return (this.getRef() as string).split('-')[4]
    }
    getPayTypeId(){
        return (this.getRef() as string).split('-')[1]
    }
    getInterval(){
        return this.getPayTypeId()=='0'?'One Time':this.getPayTypeId()=='1'?'Annual':'None'
    }
    getType(){
        return this.getPayTypeId()=='0'?'Reg Fee':this.getPayTypeId()=='1'?'Annual Fee':'Investment'
    }
    getDate(){
        return format(new Date(parseFloat(this.getTime())),'dd/MM/yy')
    }
    getColor(mye:myEles){
        return this.getPayTypeId()=='2'?mye.mycol.secondarycol:mye.mycol.primarycol
    }
}


export class schoolsiloInfoEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getName(){
        return this.data['cname']
    }
    getRegNo(){
        return this.data['regno']
    }
    getAddr(){
        return this.data['addr']
    }
    isLocsCustom(){
        return mState.getStateByCode('NG',this.getState()) == undefined
    }
    getNationality(){
        return this.data['nationality']
    }
    getState(){
        return this.data['state']
    }
    getLga(){
        return this.data['lga']
    }
    getAccountName(){
        return this.data['aname']
    }
    getAccountNumber(){
        return this.data['anum']
    }
    getBankCode(){
        return this.data['bnk']
    }
    getPersonalName(){
        return this.data['pname']
    }
    getPersonalEmail(){
        return this.data['peml']
    }
    getPersonalPhone(){
        return this.data['pphn']
    }
    getPersonalAddr(){
        return this.data['paddr']
    }
    //-- CUSTOM
    getFormattedbank(){
        return mBanks.getBankByCode(this.getBankCode())!.name
    }
}



export class adminUserEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getUserId(){
        return this.data['user_id'].toString()
    }
    getLastName(){
        return this.data['lname']
    }
    getOtherNames(){
        return this.data['oname']
    }
    getEmail(){
        return this.data['eml']
    }
    getRole(){
        return this.data['role']
    }
    getPerm(permId:string){
        return this.data[permId]
    }
    //-- CUSTOM
    getNames(){
        return this.getOtherNames()+' '+this.getLastName()
    }
    getFormattedRole(){
        if(this.getRole()=='1'){
            return 'Others'
        }
        return 'Admin'
    }
}

export class permHelp{
    name:string;
    id:string;
    val:string;
    constructor(name:string,id:string){
        this.name = name
        this.id = id
        this.val = '0'
    }
}



export class fileEle{
    data:any
    constructor(data:any){
        this.data = data
    }
    getName(){
        return this.data['file']
    }
    getFolder(){
        return this.data['folder']
    }
}


