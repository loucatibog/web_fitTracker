// wait for html to finish loading
document.addEventListener('DOMContentLoaded', calorieCalcInitializer);

function calorieCalcInitializer() {
    const calculateButton = document.querySelector('button[type="submit"]');
    calculateButton.addEventListener('click', calculateHandler);

    const resetButton = document.querySelector('button[type="reset"]');
    resetButton.addEventListener('click', resetInputs);

}

function resetInputs() {
    // reset input fields
    const inputs = document.querySelectorAll('input[type="number"]');
    for (const input of inputs) {
        input.value = '';
    }

    // reset all radio
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    for (const radio of radioButtons) {
        radio.checked = false;
    }

    // reset drop down
    document.querySelector('#activity').selectedIndex = 0;
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
        const weightLoss = calories - 500;
        const aggressiveLoss = calories - 1000;
        const weightGain = calories + 500;
        const aggressiveGain = calories + 1000;

        resultDiv.innerHTML = `
            <h2>Your Results</h2>
            <table class="contents-table">
                <thead>
                    <tr>
                        <th>Goal</th>
                        <th>Calories/day</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Aggressive Weight Loss (1kg/week)</td>
                        <td>${aggressiveLoss}</td>
                    </tr>
                    <tr>
                        <td>Weight Loss (0.5kg/week)</td>
                        <td>${weightLoss}</td>
                    </tr>
                    <tr>
                        <td>Maintenance</td>
                        <td>${calories}</td>
                    </tr>
                    <tr>
                        <td>Weight Gain (0.5kg/week)</td>
                        <td>${weightGain}</td>
                    </tr>
                    <tr>
                        <td>Aggressive Weight Gain (1kg/week)</td>
                        <td>${aggressiveGain}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}