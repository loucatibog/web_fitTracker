// wait for html to finish loading
document.addEventListener('DOMContentLoaded', calorieCalcInitializer);

function calorieCalcInitializer() {
    // check if form exists
    const calorieform = document.querySelector('#calorieform');
    if (calorieform) {
        calorieform.addEventListener('submit', calculateHandler);
    }
}

function calculateHandler(event) {
    // wait to check inputs first
    event.preventDefault();

    // retrieve values from form
    const formData = getFormValues();

    // calculate maintenance
    const calories = calculateCalories(formData);

    // return maintenance to the html
    displayResults(calories);
}

function getFormValues() {
    const age = parseInt(document.querySelector('#age').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const height = parseFloat(document.querySelector('#height').value);
    const weight = parseFloat(document.querySelector('#weight').value);
    const activity = parseFloat(document.querySelector('#activity').value);

    // return values as an object
    return {
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        activity: activity
    };
}

// calculate and return maintenance calories
function calculateCalories(formData) {
    // calculate bmr using miffin st jeor
    let bmr;
    if (formData.gender === 'male') {
        bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) + 5;
    } else {
        bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) - 161;
    }

    // return maintenance by returning bmr * activity level 
    const maintenance = Math.round(bmr * formData.activity);
    return maintenance;
}

// display maintenance and calories to gain/lose
function displayResults(calories) {
    const resultDiv = document.querySelector('#result');
    if (resultDiv) {
        const loseWeight = calories - 500;
        const gainWeight = calories + 500;

        resultDiv.innerHTML = `
        <h2>Results from Calculations</h2>
        <p>Maintenance Calories: ${calories}/day</p>
        <p>Calories to Lose Weight: ${loseWeight}/day</p>
        <p>Calories to Gain Weight: ${gainWeight}/day</p>`;
    }
}