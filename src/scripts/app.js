document.getElementById('date-range-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    generateReport(startDate, endDate);
});

document.getElementById('export-btn').addEventListener('click', function() {
    const workoutData = JSON.parse(localStorage.getItem('workoutData')) || [];
    const habitData = JSON.parse(localStorage.getItem('habitData')) || [];
    const proteinData = JSON.parse(localStorage.getItem('proteinData')) || {};

    const data = {
        workoutData,
        habitData,
        proteinData
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('home-btn').addEventListener('click', function() {
    location.href = 'index.html';
});

function generateReport(startDate, endDate) {
    const reportDiv = document.getElementById('report');
    reportDiv.innerHTML = '';

    const workoutData = JSON.parse(localStorage.getItem('workoutData')) || [];
    const habitData = JSON.parse(localStorage.getItem('habitData')) || [];
    const proteinData = JSON.parse(localStorage.getItem('proteinData')) || {};

    console.log('Workout Data:', workoutData);
    console.log('Habit Data:', habitData);
    console.log('Protein Data:', proteinData);

    const filteredWorkoutData = workoutData.filter(data => {
        const date = new Date(data.timestamp);
        return date >= startDate && date <= endDate;
    });

    const filteredHabitData = habitData.filter(data => {
        const date = new Date(data.timestamp);
        return date >= startDate && date <= endDate;
    });

    const filteredProteinData = Object.keys(proteinData).filter(date => {
        const currentDate = new Date(date);
        return currentDate >= startDate && currentDate <= endDate;
    }).reduce((obj, key) => {
        obj[key] = proteinData[key];
        return obj;
    }, {});

    console.log('Filtered Workout Data:', filteredWorkoutData);
    console.log('Filtered Habit Data:', filteredHabitData);
    console.log('Filtered Protein Data:', filteredProteinData);

    reportDiv.innerHTML += generateWorkoutTable('Workout Data', filteredWorkoutData);
    reportDiv.innerHTML += generateHabitTable('Habit Data', filteredHabitData);
    reportDiv.innerHTML += generateProteinTable('Protein Data', filteredProteinData);
}

function generateWorkoutTable(title, data) {
    if (data.length === 0) {
        return `<h3>${title}</h3><p>No data available for the selected date range.</p>`;
    }

    const headers = {
        timestamp: 'Date',
        routineNumber: 'Routine',
        focusArea: 'Area',
        exercise: 'Exercise'
    };

    console.log('Headers:', headers);
    console.log('Data:', data);

    let table = `<h3>${title}</h3><table><thead><tr>`;
    Object.keys(headers).forEach(key => {
        table += `<th>${headers[key]}</th>`;
    });
    table += `</tr></thead><tbody>`;

    data.forEach(row => {
        table += `<tr>`;
        Object.keys(headers).forEach(key => {
            let value = row[key];
            if (key === 'timestamp') {
                value = new Date(value).toLocaleDateString(); // Convert to local date
            }
            console.log(`Row: ${JSON.stringify(row)}`); // Debugging log for each row
            console.log(`Key: ${key}, Value: ${value}`); // Debugging log for each key-value pair
            table += `<td>${value}</td>`;
        });
        table += `</tr>`;
    });

    table += `</tbody></table>`;
    return table;
}

function generateHabitTable(title, data) {
    if (data.length === 0) {
        return `<h3>${title}</h3><p>No data available for the selected date range.</p>`;
    }

    let table = `<h3>${title}</h3><table><thead><tr>`;
    Object.keys(data[0]).forEach(key => {
        table += `<th>${key}</th>`;
    });
    table += `</tr></thead><tbody>`;

    data.forEach(row => {
        table += `<tr>`;
        Object.values(row).forEach(value => {
            table += `<td>${value}</td>`;
        });
        table += `</tr>`;
    });

    table += `</tbody></table>`;
    return table;
}

function generateProteinTable(title, data) {
    if (Object.keys(data).length === 0) {
        return `<h3>${title}</h3><p>No data available for the selected date range.</p>`;
    }

    let table = `<h3>${title}</h3><table><thead><tr><th>Date</th><th>Goal</th><th>Intake</th></tr></thead><tbody>`;

    Object.keys(data).forEach(date => {
        table += `<tr><td>${date}</td><td>${data[date].goal}</td><td>${data[date].intake}</td></tr>`;
    });

    table += `</tbody></table>`;
    return table;
}