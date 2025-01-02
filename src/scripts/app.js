import WorkoutTracker from './components/WorkoutTracker.js';
import HabitTracker from './components/HabitTracker.js';
import ProteinTracker from './components/ProteinTracker.js';
import { exercises } from './data/Exercises.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="button-container">
            <button id="workout-btn">Track Workout</button>
            <button id="habit-btn">Track Habits</button>
            <button id="protein-btn">Track Protein</button>
            <button id="insights-btn">Insights</button>
        </div>
        <div id="content"></div>
    `;

    document.getElementById('workout-btn').addEventListener('click', () => {
        document.getElementById('content').innerHTML = WorkoutTracker();
        addWorkoutFormListener();
    });

    document.getElementById('habit-btn').addEventListener('click', () => {
        document.getElementById('content').innerHTML = HabitTracker();
        addHabitFormListener();
    });

    document.getElementById('protein-btn').addEventListener('click', () => {
        document.getElementById('content').innerHTML = ProteinTracker();
        addProteinFormListener();
    });
    
    document.getElementById('insights-btn').addEventListener('click', () => {
        location.href = 'src/insights.html';
    });
});

function addWorkoutFormListener() {
    let routineCounter = 0;

    const addRoutineBtn = document.getElementById('add-routine-btn');
    const endWorkoutBtn = document.getElementById('end-workout-btn');

    if (addRoutineBtn) {
        addRoutineBtn.addEventListener('click', addRoutine);
    }

    if (endWorkoutBtn) {
        endWorkoutBtn.addEventListener('click', endWorkout);
    }

    function addRoutine() {
        routineCounter++;
        const routineDiv = document.createElement('div');
        routineDiv.classList.add('routine');
        routineDiv.innerHTML = `
            <h3>Routine ${routineCounter}</h3>
            <div>
                <select id="focus-area" name="focus-area" required>
                    <option value="" disabled selected>Select Focus Area</option>
                    ${Object.keys(exercises).map(area => `<option value="${area}">${area}</option>`).join('')}
                </select>
            </div>
            <div>
                <select id="exercise" name="exercise" required>
                    <option value="" disabled selected>Select Exercise</option>
                </select>
            </div>
            <div id="sets"></div>
            <div class="routine-buttons">
                <button type="button" class="add-set-btn">Add Set</button>
                <button type="button" class="add-routine-btn">Add Routine</button>
                <button type="button" class="end-workout-btn">End Workout</button>
            </div>
        `;
        document.getElementById('routines').appendChild(routineDiv);
        document.getElementById('end-workout-btn').style.display = 'block';

        const focusAreaSelect = routineDiv.querySelector('#focus-area');
        const exerciseSelect = routineDiv.querySelector('#exercise');
        focusAreaSelect.addEventListener('change', () => {
            const selectedArea = focusAreaSelect.value;
            exerciseSelect.innerHTML = `<option value="" disabled selected>Select Exercise</option>` + exercises[selectedArea].map(exercise => `<option value="${exercise}">${exercise}</option>`).join('');
        });

        routineDiv.querySelector('.add-set-btn').addEventListener('click', () => addSet(routineDiv));
        routineDiv.querySelector('.add-routine-btn').addEventListener('click', addRoutine);
        routineDiv.querySelector('.end-workout-btn').addEventListener('click', endWorkout);
    }

    function addSet(routineDiv) {
        const setsDiv = routineDiv.querySelector('#sets');
        let setCounter = setsDiv.childElementCount + 1;
        const setDiv = document.createElement('div');
        setDiv.classList.add('set');
        setDiv.innerHTML = `
            <h4>Set ${setCounter}</h4>
            <div>
                <input type="number" id="weight" name="weight" placeholder="Enter Weight (lbs)" required>
            </div>
            <div>
                <input type="number" id="reps" name="reps" placeholder="Enter Reps" required>
            </div>
        `;
        setsDiv.appendChild(setDiv);
    }

    function endWorkout() {
        const routines = document.querySelectorAll('.routine');
        const workoutData = [];
        routines.forEach((routine, routineIndex) => {
            const focusArea = routine.querySelector('#focus-area').value;
            const exercise = routine.querySelector('#exercise').value;
            routine.querySelectorAll('.set').forEach((set, setIndex) => {
                const weight = set.querySelector('#weight').value;
                const reps = set.querySelector('#reps').value;
                workoutData.push({
                    timestamp: new Date().toISOString(),
                    routineNumber: routineIndex + 1,
                    focusArea,
                    exercise,
                    setNumber: setIndex + 1,
                    setWeight: weight,
                    setReps: reps
                });
            });
        });
        let storedWorkoutData = JSON.parse(localStorage.getItem('workoutData')) || [];
        if (!Array.isArray(storedWorkoutData)) {
            storedWorkoutData = [];
        }
        storedWorkoutData.push(...workoutData);
        localStorage.setItem('workoutData', JSON.stringify(storedWorkoutData));
        alert('Workout data saved!');
        document.getElementById('routines').innerHTML = '';
        document.getElementById('end-workout-btn').style.display = 'none';
        routineCounter = 0; // Reset the counter after ending the workout
    }
}

function addHabitFormListener() {
    const form = document.getElementById('habit-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const sleep = document.getElementById('sleep').value;
            const stress = document.getElementById('stress').value;
            const weight = document.getElementById('weight').value;
            const notes = document.getElementById('notes').value;
            let habitData = JSON.parse(localStorage.getItem('habitData')) || [];
            if (!Array.isArray(habitData)) {
                habitData = [];
            }
            habitData.push({ sleep, stress, weight, notes, timestamp: new Date().toISOString() });
            localStorage.setItem('habitData', JSON.stringify(habitData));
            alert('Habit data saved!');
        });
    }
}

function addProteinFormListener() {
    const form = document.getElementById('protein-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const proteinGoal = document.getElementById('protein-goal').value;
            const proteinIntake = document.getElementById('protein-intake').value;
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            let proteinData = JSON.parse(localStorage.getItem('proteinData')) || {};
            if (!proteinData[today]) {
                proteinData[today] = { goal: proteinGoal, intake: 0 };
            }
            proteinData[today].intake += parseInt(proteinIntake, 10);

            localStorage.setItem('proteinData', JSON.stringify(proteinData));

            const percentage = ((proteinData[today].intake / proteinData[today].goal) * 100).toFixed(2);
            document.getElementById('protein-status').innerText = `You've consumed ${proteinData[today].intake} protein for the day which is ${percentage}% of today's goal.`;

            // Reset the protein intake input field
            document.getElementById('protein-intake').value = '';

            alert('Protein data saved!');
        });
    }
}