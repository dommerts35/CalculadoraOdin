const outputElems = [document.querySelector("#output1 p"), document.querySelector("#output2 p")];
const buttons = document.getElementById("buttons");

let nums = ["", undefined];
let selectedNum = 0;
let selectedOperator = "";

// Eventos principales
buttons.addEventListener("click", (e) => {
  const btn = e.target;
  if (!btn.tagName.toLowerCase() === "button") return;

  if (btn.classList.contains("number")) addDigit(btn.dataset.num);
  if (btn.classList.contains("operator")) setOperator(btn.dataset.op);
  if (btn.classList.contains("modify")) {
    if (btn.dataset.fn === "clear") clearLast();
    if (btn.dataset.fn === "equals") evaluate();
  }
});

document.addEventListener("keyup", (e) => {
  if ("0123456789.".includes(e.key)) addDigit(e.key);
  if ("+-*/^%r".includes(e.key)) {
    if (e.key === "r") setOperator("√");
    else if (e.key === "*") setOperator("×");
    else if (e.key === "/") setOperator("÷");
    else setOperator(e.key);
  }
  if (e.key === "Enter" || e.key === "=") evaluate();
  if (e.key === "Backspace") clearLast();
});

// FUNCIONES PRINCIPALES
function addDigit(digit) {
  if (digit === "." && nums[selectedNum].includes(".")) return;
  updateNum(nums[selectedNum] + digit);
}

function setOperator(op) {
  if (!nums[0]) return;
  if (selectedNum === 0) updateOperator(op);
  else if (selectedNum === 1) {
    selectedOperator === op ? evaluate(op) : updateOperator(op);
  }
}

function evaluate(nextOperator = "") {
  if (!nums[1]) return;
  const x = roundToFour(Number(nums[0]));
  const y = roundToFour(Number(nums[1]));
  let res;

  switch (selectedOperator) {
    case "+": res = x + y; break;
    case "-": res = x - y; break;
    case "×": res = x * y; break;
    case "÷": res = x / y; break;
    case "^": res = x ** y; break;
    case "√": res = x ** (1 / y); break;
    case "%": res = (x * y) / 100; break;
  }

  nums = ["", undefined];
  selectNum(nextOperator ? 1 : 0);
  updateOperator(nextOperator);
  updateNum(roundToFour(res), 0);
}

// FUNCIONES AUXILIARES
function updateNum(val = nums[selectedNum], num = selectedNum) {
  nums[num] = val + "";
  outputElems.forEach((el, i) => {
    el.textContent = nums[i] || "";
    i === num ? el.classList.add("selected-output") : el.classList.remove("selected-output");
  });
}

function updateOperator(op) {
  selectedOperator = op;
  [...buttons.children].forEach(btn => {
    btn.textContent === op ? btn.classList.add("selected-operator") : btn.classList.remove("selected-operator");
  });
  if (op) selectNum(1);
}

function selectNum(num) {
  selectedNum = num;
  if (num === 1) updateNum("");
  else if (num === 0) {
    nums[1] = undefined;
    updateOperator("");
    updateNum();
  }
}

function clearLast() {
  if (nums[selectedNum]) updateNum(nums[selectedNum].slice(0, -1));
  else if (selectedNum === 1) selectNum(0);
}

function roundToFour(n) {
  return Math.round(n * 10000) / 10000;
}
