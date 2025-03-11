const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-DisplayNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numberCheck= document.querySelector("#numbers");
const symbolCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generate-password");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*()_+{}"|:>?<';

let password="";
let passwordLength=10;
let checkCount=0;
//set strength circle color to grey
handleSlider();
setIndicator("#ccc");
// sets the range and length to initial value
//password length ko UI pe reflect krwata hai 
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    //slider me color ka variation 
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize= (((passwordLength-min)*100)/ (max-min))+ "%100";
}
//sets color of the circle determining strength
function setIndicator(color){
    indicator.style.backgroundColor=color;
}
//generates random integer between two values
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}
//random integer between 0 and 9
function generateRandomNumber(){
    return getRndInteger(0,9);
}
//random lower case alphabet
function getLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
//random upper case alphabet
function getUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
//random symbol using string and returning character from it 
function getSymbol(){
    return symbols.charAt(getRndInteger(0,symbols.length));
}
//determining color of the circle 
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasSym=false;
    let hasNum=false;
    if(uppercaseCheck.checked) hasUpper= true;
    if(lowercaseCheck.checked) hasLower= true;
    if(numberCheck.checked) hasNum= true;
    if(symbolCheck.checked) hasSym= true;
    if(hasUpper && hasLower && (hasSym || hasNum) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasSym|| hasNum) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
function shufflePassword(array){
    //Fischer Yates method
    for(let i=array.length-1;i>=0;i--){
        const j= Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}
async function copyContent(){
    try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
    }
    catch(e){
       copyMsg.innerText="not-copied";
    }
    //to display and remove the copied text after some time
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
// slider ko move krenge to slider ki value password length me copy krni hogi uske liye event listener 
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});
//event listener for checkboxes
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox)=>{
     if(checkBox.checked){
        checkCount++;
     }});
     //special condition
     if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
     }
}
//event listener for whenever any checkbox is checked or unchecked
 allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});



generateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return;
    
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
        return ;
    }
    
    //creating password
    //clear the old password
    password="";
     //creating array of functions and choosing any random function and adding its result in password
    let funcArr=[];
    if(uppercaseCheck.checked) funcArr.push(getUpperCase);
    if(lowercaseCheck.checked) funcArr.push(getLowerCase);
    if(numberCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolCheck.checked) funcArr.push(getSymbol);
    
    //addding the required parameters
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();

    }

    //adding random parameters to complete pasword
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let rndmIdx= getRndInteger(0,funcArr.length);
        password+=funcArr[rndmIdx]();
    }
    //shuffle password
    
    password=shufflePassword(Array.from(password));
    //show in UI
    passwordDisplay.value=password;
    
    calcStrength();

});