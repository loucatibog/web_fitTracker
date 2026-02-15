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
    formData = getFormValues();

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

    return {
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        activity: activity
    };
}

function calculateCalories(formData) {
    let bmr;
    if (formData.gender === 'male') {
        bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) + 5;
    } else {
        bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) - 161;
    }

    const maintenance = Math.round(bmr * formData.activity);
    return maintenance;
}

function displayResults(calories) {
    const resultDiv = document.querySelector('#result');
    if (resultDiv) {
        resultDiv.innerHTML = `<h2>Maintenance Calories: ${calories}/day`;
    }
}