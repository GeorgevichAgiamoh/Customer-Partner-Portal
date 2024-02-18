import { myEles } from "../../helper/general";

// Announcement
export class annEle{
    msg:string;
    date:string;
    constructor(msg:string,date:string){
        this.msg = msg;
        this.date = date;
    }
    getMessage(){
        return this.msg;
    }
    getDate(){
        return this.date;
    }
}

//Individuals
export class indivEle{
    memId:string
    fName:string
    lName:string
    mName:string
    gender:string
    dob:string
    phone:string
    email:string
    address:string
    country:string
    state:string
    city:string

    constructor(memId:string,
        fName:string,
        lName:string,
        mName:string,
        gender:string,
        dob:string,
        phone:string,
        email:string,
        address:string,
        country:string,
        state:string,
        city:string){
            this.memId = memId
            this.fName = fName
            this.lName = lName
            this.mName = mName
            this.gender = gender
            this.dob = dob
            this.phone = phone
            this.email = email
            this.address = address
            this.country = country
            this.state = state
            this.city = city
        }

    getFinancialInfo(){
        return new finInfoEle('Grey Akwani','0921616261','Sterling Bank')
    }
    
}

export class finInfoEle{
    acctName:string
    acctNum:string 
    bank:string 
    constructor(acctName:string, acctNum:string, bank:string ){
        this.acctName = acctName
        this.acctNum = acctNum
        this.bank = bank
    }
}

export class msgMeta{
    subject:string 
    msg:string 
    whosent:string
    whoreceived:string
    date:string
    constructor(subject:string,msg:string, whosent:string, whoreceived:string, date:string){
        this.subject = subject
        this.msg = msg
        this.whosent = whosent
        this.whoreceived = whoreceived
        this.date = date
    } 
}

export class payTypeEle{
    name:string
    amt:number
    payId:number //0->Reg Fee 1-> Investment 2-> Contribution
    constructor(name:string, amt:number, category:number){
        this.name = name
        this.amt = amt
        this.payId = category
    }
    getType(){
        return this.payId==0?'Reg Fee':this.payId==1?'Annual Fee':'Investment'
    }
    getinterval(){
        return this.payId==0?'One Time':this.payId==1?'Annual':'None'
    }
    getTier(){
        return this.payId==2?'Tier Type':'Flat Rate'
    }
     
}

//These info will be retrieved dyamically! Only memID matters
export class payInfo{
    name: string
    amt:number 
    memId:string 
    months:number 
    type:number 
    date:string
    constructor(name: string, amt:number, memId:string, months:number, type:number, date:string){
        this.name = name
        this.amt = amt
        this.memId = memId
        this.months = months
        this.type = type
        this.date = date
    }
    getColor(mye:myEles){
        return this.type==0?mye.mycol.primarycol:mye.mycol.secondarycol
    }
    getType(){
        return this.type==0?'Dues':this.type==1?'Investment':'Contribution'
    }
    getinterval(){
        if(this.months==-1){
            return 'None'
        }
        if(this.months == 0){
            return 'One-time'
        }
        if(this.months < 1){
            if(this.months == 0.1){
                return 'Everyday';
            }
        }
        if(this.months==12){
            return 'Annually'
        }
        return `${this.months} Months`
    }
}


// Admin User

export class adminUserEle{
    name:string 
    email:string 
    role:number;//0-Admin 1- Others
    constructor(name:string, email:string, role:number){
        this.name = name
        this.email = email
        this.role = role
    }
    getRole(){
        if(this.role==0){
            return 'Admin'
        }
        if(this.role==1){
            return 'Others'
        }
        return 'Unknown'
    }
}