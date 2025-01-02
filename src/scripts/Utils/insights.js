document.getElementById('home-btn').addEventListener('click', function() {
    location.href = '../index.html';
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

    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('workout-report-btn').addEventListener('click', function() {
    generateReport('workout');
});

document.getElementById('habits-report-btn').addEventListener('click', function() {
    generateReport('habits');
});

document.getElementById('protein-report-btn').addEventListener('click', function() {
    generateReport('protein');
});

function generateReport(type) {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const reportDiv = document.getElementById('report');
    reportDiv.innerHTML = '';

    const workoutData = JSON.parse(localStorage.getItem('workoutData')) || [];
    const habitData = JSON.parse(localStorage.getItem('habitData')) || [];
    const proteinData = JSON.parse(localStorage.getItem('proteinData')) || {};

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

    if (type === 'workout') {
        reportDiv.innerHTML += generateWorkoutTable('Workout Data', filteredWorkoutData);
    } else if (type === 'habits') {
        reportDiv.innerHTML += generateHabitTable('Habit Data', filteredHabitData);
    } else if (type === 'protein') {
        reportDiv.innerHTML += generateProteinTable('Protein Data', filteredProteinData);
    }
}

function generateWorkoutTable(title, data) {
    if (data.length === 0) {
        return `<h3>${title}</h3><p>No data available for the selected date range.</p>`;
    }

    const headers = {
        timestamp: 'Date',
        focusArea: 'Area',
        exercise: 'Exercise',
        setNumber: 'Set',
        setWeight: 'Weight',
        setReps: 'Reps'
    };

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

    const headers = {
        timestamp: 'Date',
        habit: 'Habit',
        status: 'Status'
    };

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
        let value = new Date(date).toLocaleDateString(); // Convert to local date
        table += `<tr><td>${value}</td><td>${data[date].goal}</td><td>${data[date].intake}</td></tr>`;
    });

    table += `</tbody></table>`;
    return table;
}

function convertToCSV(data) {
    const workoutData = data.workoutData.map(row => ({
        Date: new Date(row.timestamp).toLocaleDateString(),
        Area: row.focusArea,
        Exercise: row.exercise,
        Set: row.setNumber,
        Weight: row.setWeight,
        Reps: row.setReps
    }));

    const habitData = data.habitData.map(row => ({
        Date: new Date(row.timestamp).toLocaleDateString(),
        Habit: row.habit,
        Status: row.status
    }));

    const proteinData = Object.keys(data.proteinData).map(date => ({
        Date: new Date(date).toLocaleDateString(),
        Goal: data.proteinData[date].goal,
        Intake: data.proteinData[date].intake
    }));

    const allData = [
        ...workoutData,
        ...habitData,
        ...proteinData
    ];

    const headers = Object.keys(allData[0]);
    const csvRows = [
        headers.join(','), // header row first
        ...allData.map(row => headers.map(header => JSON.stringify(row[header], replacer)).join(','))
    ];

    return csvRows.join('\n');
}

function replacer(key, value) {
    return value === null ? '' : value;
}