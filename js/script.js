let register1 = "";
let register2 = "";
let operation = "";
let operationButton = "";
let awaitingInput = false;
let previousClickedButton = "";

// ========== Utility (light grey) button operations ==========

function acOnClick() {
    let acButton = document.getElementById("ac");
    animateButton(acButton);
    setDisplay("0");
    showAllClear();
    register1 = "";
    register2 = "";
    operation = "";
    notAwaitingInput(operationButton);
    previousClickedButton = acButton;
}

function plusMinusOnClick() {
    let plusMinusButton = document.getElementById("plus-minus");
    animateButton(plusMinusButton);
    let currentText = getDisplaytext();
    if (currentText !== "0") {
        if (currentText.charAt(0) === "-") {
            setDisplay(currentText.substr(1));
        } else {
            setDisplay("-" + currentText);
        }
    }
    previousClickedButton = plusMinusButton;
}

function decimalOnClick() {
    let decimalButton = document.getElementById("decimal");
    animateButton(decimalButton);
    let displayText = getDisplaytext();
    if (displayText.includes(".") === false) {
        setDisplay(displayText + ".");
        showClear();
    }
    previousClickedButton = decimalButton;
}

// ========== Dark grey buttons (numbers) functions ========== //

function numberOnClick(numberButton) {
    animateButton(numberButton);
    let number = numberButton.textContent;
    let displayText = getDisplaytext();
    if (displayText.length > 8 && awaitingInput === false) {} else if (displayText === "0") {
        if (number !== "0") {
            setDisplay(number);
            showClear();
        }
    } else if (awaitingInput === true) {

        setDisplay(number);
        awaitingInput = false;
        notAwaitingInput(operationButton);
    } else {
        setDisplay((displayText += number));
    }
    previousClickedButton = numberButton;
}

// ========== Orange button (operations) functions ==========

function divideOnClick() {
    let clickedButton = document.getElementById("divide");
    operationClicked("/", clickedButton);
}

function multiplyOnClick() {
    let clickedButton = document.getElementById("multiply");
    operationClicked("*", clickedButton);
}

function subtractionOnClick() {
    let clickedButton = document.getElementById("minus");
    operationClicked("-", clickedButton);
}

function additionOnClick() {
    let clickedButton = document.getElementById("plus");
    operationClicked("+", clickedButton);
}

function operationClicked(clickedOperation, clickedButton) {
    if (awaitingInput === true) {
        operation = clickedOperation;
        notAwaitingInput(operationButton);
        showAwaitingInput(clickedButton);
    } else {
        if (operation !== "") {
            let result;
            register2 = getDisplayValue();
            if (operation === "+") {
                result = math.add(math.bignumber(register1), math.bignumber(register2));
            } else if (operation === "-") {
                result = math.subtract(
                    math.bignumber(register1),
                    math.bignumber(register2)
                );
            } else if (operation === "/") {
                result = math.divide(
                    math.bignumber(register1),
                    math.bignumber(register2)
                );
            } else if (operation === "*") {
                result = math.multiply(
                    math.bignumber(register1),
                    math.bignumber(register2)
                );
            }
            let formattedResult = formatNumber(result);
            setDisplay(formattedResult);
            register1 = result;
        } else {
            register1 = getDisplayValue();
        }
        operation = clickedOperation;
        showAwaitingInput(clickedButton);
    }
    previousClickedButton = clickedButton;
    console.log(`register 1: ${register1}`);
    console.log(`register 2: ${register2}`);
}

function equalsOnClick() {
    let equalsButton = document.getElementById("equals");
    animateButton(equalsButton);
    let operationButtonsids = ["divide", "multiply", "minus", "plus", "equals"];

    if (awaitingInput === true) {
        notAwaitingInput(operationButton);
    }
    if (register1 === "Error") {
        setDisplay("Error");
        previousClickedButton = equalsButton;
        return;
    }
    if (getDisplaytext() !== "Error") {
        if (operation !== "") {
            if (operationButtonsids.indexOf(previousClickedButton.id) !== -1) {
                if (register2 === "") {
                    register2 = getDisplayValue();
                }
            } else {
                register2 = getDisplayValue();
            }

            let result;
            if (register1 !== "Error") {
                if (operation === "+") {
                    result = math.add(
                        math.bignumber(register1),
                        math.bignumber(register2)
                    );
                } else if (operation === "-") {
                    result = math.subtract(
                        math.bignumber(register1),
                        math.bignumber(register2)
                    );
                } else if (operation === "/") {
                    if (register2 === 0) {
                        result = "Error";
                    } else {
                        result = math.divide(
                            math.bignumber(register1),
                            math.bignumber(register2)
                        );
                    }
                } else if (operation === "*") {
                    result = math.multiply(
                        math.bignumber(register1),
                        math.bignumber(register2)
                    );
                }
                register1 = result;
                if (result === "Error") {
                    setDisplay(result);
                } else {
                    result = math.format(result);
                    let formattedResult = formatNumber(result);
                    setDisplay(formattedResult);
                }
                awaitingInput = true;
            }
        }
    }
    previousClickedButton = equalsButton;
}

// ========== HELPER FUNCTIONS ==========

function getDisplayValue() {
    let display = document.getElementById("display-text");
    let numberText = display.textContent.replace(",", "");
    return parseFloat(numberText);
}

function getDisplaytext() {
    return document.getElementById("display-text").textContent;
}

function setDisplay(str) {
    let display = document.getElementById("display-text");
    if (typeof str !== "string") {
        str = str.toString();
    }
    display.textContent = str;
    if (str.length < 6) {
        display.style.fontSize = "90px";
    } else if (str.length < 7) {
        display.style.fontSize = "80px";
    } else if (str.length < 8) {
        display.style.fontSize = "74px";
    } else if (str.length < 9) {
        display.style.fontSize = "66px";
    } else {
        display.style.fontSize = "58px";
    }
}

function formatNumber(str) {
    if (typeof str !== "string") {
        str = str.toString();
    }
    let formattedResult = parseFloat(str);
    let positiveResult = formattedResult;
    if (positiveResult < 0) {
        positiveResult = positiveResult * -1;
    }
    if (positiveResult < 0.0000001 || positiveResult > 100000000) {
        if (formattedResult !== 0) {
            formattedResult = parseFloat(str).toExponential(4);
        }
    }
    if (formattedResult.toString().substring(1, 7) === ".0000e") {
        formattedResult = parseFloat(str).toExponential(0);
    }
    let resultString = formattedResult.toString().replace("+", "");

    if (resultString.length > 9) {
        let decimalCharIndex = resultString.indexOf(".");
        let integralString = resultString.substring(0, decimalCharIndex);
        let integralLength = integralString.length;
        formattedResult = formattedResult.toFixed(9 - integralLength);
    }
    return formattedResult.toString().replace("+", "");
}

function showAwaitingInput(button) {
    awaitingInput = true;
    button.className = "awaiting-input";
    operationButton = button;
}

function notAwaitingInput(button) {
    awaitingInput = false;
    button.className = "not-awaiting-input";
}

function showClear() {
    let acButton = document.getElementById("ac");
    acButton.textContent = "C";
}

function showAllClear() {
    let acButton = document.getElementById("ac");
    acButton.textContent = "AC";
}

function animateButton(myElement) {
    var newButton = myElement.cloneNode(true);
    myElement.parentNode.replaceChild(newButton, myElement);
    newButton.classList.add("animating");
    var listener = newButton.addEventListener("animationend", function () {
        newButton.classList.remove("animating");
        newButton.removeEventListener("animationend", listener);
    });
}