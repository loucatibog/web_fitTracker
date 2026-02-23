// wait for html to finish loading
document.addEventListener('DOMContentLoaded', weightInitializer);

function weightInitializer() {
    // check if form exists
    const weightForm = document.querySelector('#weightForm');
    if (weightForm) {

        // load past entries when page loads
        displayEntries();

        weightForm.addEventListener('submit', weightHandler);
    }
}

function weightHandler(event) {
    // wait to check inputs first
    event.preventDefault();

    // retrieve values from form
    const formData = getFormValues();

    // save data in localStorage
    saveEntry(formData);

    // display updated entries
    displayEntries();
}

function getFormValues() {
    // retrieve values from the input elements
    const date = document.querySelector('#date').value;
    const weight = parseFloat(document.querySelector('#weight').value);
    
    // return values as an object
    return {date: date, weight: weight};
}

function saveEntry(formData) {
    // get existing entries from localStorage, or start with empty array
    const entries = JSON.parse(localStorage.getItem('weightEntries')) || [];

    // add new entry to array
    entries.push({
        date: formData.date,
        weight: formData.weight
    });

    // save updated array back to localStorage
    localStorage.setItem('weightEntries', JSON.stringify(entries));
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('weightEntries'));

    entries.splice(index, 1);

    localStorage.setItem('weightEntries', JSON.stringify(entries));

    displayEntries();
}

function displayChart(entries) {
    const canvas = document.querySelector('#weightChart');

    const dates = entries.map(entry => entry.date);
    const weights = entries.map(entry => entry.weight);

    new Chart(canvas, {
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
        }
    });
}

function displayEntries() {
    // retrieve entries from localStorage
    const entries = JSON.parse(localStorage.getItem('weightEntries'));
    const weightHistory= document.querySelector('#weightHistory');
    const weightSummary = document.querySelector('#weightSummary');
    
    if (entries.length === 0) {
        weightHistory.innerHTML = '<p>No entries yet. Log weight above to see results</p>';
        return;
    }

    // calculate start, current and weight difference
    const startWeight = entries[0].weight;
    const currentWeight = entries[entries.length - 1].weight;
    const totalChange = startWeight - currentWeight;

    entries.sort((current, next) => new Date(next.date) - new Date(current.date));
    
    // display the summary of calculations
    weightSummary.innerHTML = `
        <h3>Summary</h3>
        <p>Starting Weight: ${startWeight}</p>
        <p>Current Weight: ${currentWeight}</p>
        <p>Total Change: ${totalChange}</p>
    `;

    // display past entries in a table
    weightHistory.innerHTML =`
    <h3>Weight Entries</h3>
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

    displayChart(entries);
}