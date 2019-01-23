function Validate(kindOfField, value) {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    
    if(kindOfField=="email"){
        if(value==""){ 
            return 'Please enter Email address';
        }
        if(reg.test(value) === false)
        {
            return 'Email is Not Correct';				
        }
         return ""; 
    }
    if(kindOfField=="password"){
        if(value==""){
            return 'Please enter password';
        }
        if(value.length < 8){
            return 'Password must be more than 8 char';
        }
         return "";
    }
    
};

export default Validate;
