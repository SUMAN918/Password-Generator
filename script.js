const inputSlider = document.querySelector("[dataLengthSlider]");
const lengthDisplay = document.querySelector("[dataLengthNumber]");
const passwordDisplay = document.querySelector("[dataPasswordDisplay]");
const copyBtn = document.querySelector("[dataCopy]");
const copyMsg = document.querySelector("[dataCopyMsg]");
const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#lowerCase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[dataIndicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+={}[]:;<.,>/?';

// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;

// set password length
const handleSlider = () => {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}
handleSlider();

const setIndicator = color => {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
setIndicator("#ccc");

const getRanInteger = (min,max) =>{
    return Math.floor(Math.random() * (max-min)) + min;
}

const generateRandomNumber = () => {
    return getRanInteger(0,9);
}

const generateLowerCase = () => {
    return String.fromCharCode(getRanInteger(97,123));
}

const generateUpperCase = () => {
    return String.fromCharCode(getRanInteger(65,90));
}

const generateSymbol = () => {
    const ranNum = getRanInteger(0, symbols.length);
    return symbols.charAt(ranNum);
}

const calcStrength = () => {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && 
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

const copyContent = async () => {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

const shufflePassword = (array) => {
    // Fisher Yates Method
    for (let i=array.length - 1; i >0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array [j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

const handleCheckBoxChange = () =>{
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    });

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
} 

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () =>{
    // None of the checkbox are selected
    if(checkCount ==0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // let's start the journey to find the passward
    console.log("Starting the Journey");
    // remove old password
    password = "";
    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    // compulsary addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsary addition done");


    // remaining addition 
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRanInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    } 
    console.log("remaining addition done");
       

    // shuffle the password 
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");


    // show in UI 
    passwordDisplay.value = password;
    console.log("UI addition done");


    // calculate strength
    calcStrength();
});