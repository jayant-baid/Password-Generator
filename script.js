let password = "";
let passwordLength = 10;
let checkCount = 0;

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
handleSlider();

// passwordlength ko UI me reflect karata h
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";

}

inputSlider.addEventListener("input", (event) => {
    passwordLength = event.target.value;
    handleSlider();
})

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.textContent = "copied";
    }
    catch (e) {
        copyMsg.textContent = "Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}

copyBtn.addEventListener("click", () => {
    // if non-empty
    // if (passwordDisplay.value)
    if (password.length > 0)
        copyContent();
})

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");


function getRandomInteger(min, max) {
    return min + Math.floor(Math.random() * (max - min))
}

function generateRandomNumber() {
    return getRandomInteger(0, 10);
}
// console.log(generateRandomNumber());

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}
// console.log(generateLowerCase());
// console.log(generateUpperCase());

function generateSymbols() {
    const symbols = "!@#$%^&*()_+-=[]{}|;\:`,./<>?";
    const randNum = getRandomInteger(0, symbols.length);
    return symbols[randNum];
}
// console.log(generateSymbols());

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateBtn");

// set strength color to grey
setIndicator("#ccc");

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && hasNumber && hasSymbol && passwordLength >= 8)
        setIndicator("#0f0");

    else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6)
        setIndicator("#ff0");

    else
        setIndicator("#f00");
}

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    // Special Condition
    if (passwordLength < checkCount) {
        // passwordlength change hui h so call handleslider fucnction
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
    // None of the checkbox are selected
    if (checkCount === 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //! GENERATE NEW 
    // console.log("Starting The Journey");
    //? remove old password
    password = "";

    // put the stuff mentioned by checkboxes
    // if (uppercaseCheck.checked)
    //     password += generateUpperCase();
    // if (lowercaseCheck.checked)
    //     password += generateLowerCase();
    // if (numbersCheck.checked)
    //     password += generateRandomNumber();
    // if (symbolsCheck.checked)
    //     password += generateSymbols();

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked)
        funcArr.push(generateSymbols);

    //? Compulsory Addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    // console.log("Compulsory Addition Done");

    //? Remaining Addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    // console.log("Remaining Addition Done");

    //? Password Shuffle
    password = shufflePassword(Array.from(password));
    // console.log("Shuffling Done");

    //? show in UI
    passwordDisplay.value = password;
    // console.log("UI Addition Done");

    //? Calculate Strength
    calcStrength();
});

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let ans = "";
    array.forEach((value) => {
        ans += value;
    });
    return ans;
}
