/* STARTING VARIABLES */

let nums = ['', undefined];
let selectedNum = 0;
let selectedOperator = '';

const outputs = [document.querySelector("#output1 p"), document.querySelector("#output2 p")];

/* FULL EVENT LISTENER FOR BUTTONS CONTAINER */

document.querySelector("#buttons")
.addEventListener("click", (event) => {
    if (event.target.nodeName.toLowerCase() !== "button") return; // Checks if the click was on a button

    let char = event.target.textContent; // Text content of the button clicked

    // Checks if the button clicked was a number, operator, or modify button and take appropriate action
    switch (event.target.classList[0]) {
        case "number": addDigit(char); break;
        case "operator": operate(char); break;
        case "modify": modify(char); break;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === 'Backspace') deleteLastDigit();
    else if (event.key === "Enter" || event.key === '=') evaluateAnswer();
    else if ("0123456789.".includes(event.key)) addDigit(event.key);
    else if ("%^r/*-+=".includes(event.key)) {
        switch (event.key) {
            case 'r': operate('√'); break;
            case '/': operate('÷'); break;
            case '*': operate('×'); break;
            default: operate(event.key); break;
        }
    }
});

/* INPUT FUNCTIONS */

function addDigit (digit) {
    if ( (nums[selectedNum].includes('.') || nums[selectedNum] === '') && digit === '.' ) { return; } // Prevent adding '.' twice or as the first character
    updateSelectedNum(nums[selectedNum] + digit); // Add the digit given to selected number
}

function modify (button) {
    if (button === 'C') { deleteLastDigit(); }
    if (button === '=') { evaluateAnswer(); }
}

function deleteLastDigit () {
    if (nums[selectedNum]) updateSelectedNum(nums[selectedNum].slice(0, -1)); // Delete last character if selected number isn't empty
    else if (selectedNum === 1) selectNum(0); // Select first number if second number is empty
}

function operate (operator) {
    if (nums[0] === '') return;

    if (selectedNum === 0) {
        updateOperator(operator); // Set the newly selected operator
    }
    else if (selectedNum === 1) {
        selectedOperator === operator
        ? evaluateAnswer(operator) // Evaluate answer and pass current operator for next operation if selected operator is selected again
        : updateOperator(operator); // Change operator if a new one is selected
    }
}

function evaluateAnswer (operator = '') {
    if (!nums[1]) return; // Return if second number is empty

    // Get both numbers rounded to 4th decimal place
    let x = roundToFourDecimals(Number(nums[0]));
    let y = roundToFourDecimals(Number(nums[1]));
    
    if (Number.isNaN(x) || Number.isNaN(y)) return; // Return if any number is invalid
    
    let result;
    
    // Calculate result based on selected operator
    switch (selectedOperator) {
        case '+':
            result = x + y; 
            break;
        case '-':
            result = x - y;
            break;
        case '×':
            result = x * y;
            break;
        case '÷':
            result = x / y;
            break;
        case '^':
            result = x ** y;
            break;
        case '√':
            result = x ** (1 / y);
            break;
        case '%':
            result = (x * y) / 100;
            break;
    }

    // Round result to 4th decimal place
    result = roundToFourDecimals(result);

    // Reset values of nums array and currentNum
    nums = ['', undefined];
    selectNum(operator ? 1 : 0); // If an extra operator was passed, select second number, and select first number otherwise
    updateOperator(operator);
    
    // Set value of first number to results
    updateSelectedNum(result, 0);
}

/* EXTRA FUNCTIONS */

function selectNum (num) {
    selectedNum = num; // Set current num to the desired value

    if (selectedNum === 1) { updateSelectedNum(''); } // Set second number to an empty string instead of undefined if it's selected
    else if (selectedNum === 0) { // Reset second number to undefined, clear selected operator and update outputs if first number is selected
        nums[1] = undefined;
        updateOperator('');
        updateSelectedNum();
    }
}

function updateSelectedNum (str = nums[selectedNum], num = selectedNum) { // str: value to update selected num to, num: select num manually if needed
    nums[num] = str + ''; // Set selected num value

    // Loop through all output displays and add 'selected-output' class to the selected output display and remove 'selected-output' class from any output displays not selected
    outputs.forEach( (output, i) => {
        output.textContent = nums[i];
        i === num
        ? output.classList.add("selected-output")
        : output.classList.remove("selected-output");
    });
}

function updateOperator (operatorSymbol) {
    selectedOperator = operatorSymbol; // Set operator

    // Loop through all buttons and add 'selected-operator' class to the selected operator button and remove 'selected-operator' from any buttons not selected
    [...buttons.children].forEach((button) => {
        button.textContent === operatorSymbol
        ? button.classList.add("selected-operator")
        : button.classList.remove("selected-operator");
    });

    operatorSymbol && selectNum(1); // Select second number if an operator was given to be chosen
}

function roundToFourDecimals (num) {
    let numStr = num + '';
    if ( (numStr.includes('.')) && numStr.split('.')[1].length <= 4 ) return num;
    else return parseFloat(num.toFixed(4));
}
