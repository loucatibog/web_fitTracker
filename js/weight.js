let weightChart = null;

// wait for html to finish loading
document.addEventListener('DOMContentLoaded', weightInitializer);

function weightInitializer() {
    // load past entries when page loads
    displayEntries();

    // get log weight button
    const submitButton = document.querySelector('button[type="submit"');
    submitButton.addEventListener('click', weightHandler);

    // get reset button
    const resetButton = document.querySelector('button[type="reset"');
    resetButton.addEventListener('click', resetInputs);
}

function resetInputs() {
    document.querySelector('#date').value = '';
    document.querySelector('#weight').value = '';
}

function weightHandler(event) {
    // wait to check inputs first
    event.preventDefault();

    // retrieve values from form
    const formData = getFormValues();

    // save data in localStorage
    saveEntry(formData);

    // refresh table for updated entries
    displayEntries();
}

// retrieve values from the input elements
function getFormValues() {
    const date = document.querySelector('#date').value;
    const weight = parseFloat(document.querySelector('#weight').value);
    
    // return values as an object
    return {date: date, weight: weight};
}

// get and return entries from local storage
function getEntries() {
    return entries = JSON.parse(localStorage.getItem('weightEntries')) || [];
}

function saveEntry(formData) {
    // get existing entries from localStorage, or start with empty array
    const entries = getEntries();

    // add new entry to array
    entries.push({
        date: formData.date,
        weight: formData.weight
    });

    // save updated array back to localStorage
    localStorage.setItem('weightEntries', JSON.stringify(entries));
}

// remove entries from local storage
function deleteEntry(index) {
    const entries = getEntries();

    entries.splice(index, 1);

    localStorage.setItem('weightEntries', JSON.stringify(entries));

    displayEntries();
}

// display weight changes over time in a graph
function displayChart() {
    const entries = JSON.parse(localStorage.getItem('weightEntries'));
    const canvas = document.querySelector('#weightChart');

    if (weightChart) {
        weightChart.destroy();
    }

    // reverse the list so that it goes from old to new - left to right
    entries.sort((current, next) => new Date(current.date) - new Date(next.date));

    const dates = entries.map(entry => entry.date);
    const weights = entries.map(entry => entry.weight);

    canvas.style.display = 'block';
    weightChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Weight KG',
                data: weights,
                borderColor: '#009879',
                backgroundColor: 'rgba(0, 152, 121, 0.1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function displayEntries() {
    // retrieve entries from localStorage
    const entries = getEntries();

    const weightHistory= document.querySelector('#weightHistory');
    const weightSummary = document.querySelector('#weightSummary');
    const canvas = document.querySelector('#weightChart');

    if (entries.length === 0) {
        weightHistory.innerHTML = '<p>No entries yet. Log weight above to see results</p>';
        weightSummary.innerHTML = '';

        // Hide canvas and destroy chart when no entries
        canvas.style.display = 'none';
        if (weightChart) {
            weightChart.destroy();
            weightChart = null;
        }
        return;
    }

    // calculate start, current and weight difference
    const startWeight = entries[0].weight;
    const currentWeight = entries[entries.length - 1].weight;
    const totalChange = (currentWeight - startWeight).toFixed(2);

    entries.sort((current, next) => new Date(next.date) - new Date(current.date));
    
    // display the summary of calculations
    weightSummary.innerHTML = `
        <h3>Summary</h3>
        <p>Starting Weight: ${startWeight} KG</p>
        <p>Current Weight: ${currentWeight} KG</p>
        <p>Total Change: ${totalChange} KG</p>
    `;

    // display past entries in a table
    weightHistory.innerHTML =`
    <h3>Weight Entries (recent to oldest)</h3>
    <table class="contents-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            ${entries.map((entry, index) => `
                <tr>
                    <td>${entry.date}</td>
                    <td>${entry.weight}</td>
                    <td><button onclick="deleteEntry(${index})">Delete</button></td>
                </tr>
           `).join('')}
        </tbody>
    </table>`;

    displayChart();
}