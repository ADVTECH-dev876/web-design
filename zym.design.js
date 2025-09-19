<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minimal Workout Tracker</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * {margin:0;padding:0;box-sizing:border-box;}
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            line-height: 1.4;
            overflow-x: hidden;
        }
        .app-container {
            max-width: 390px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            position: relative;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .screen {
            display: none;
            padding: 24px 20px;
            min-height: 100vh;
            animation: slideIn 0.3s ease-out;
        }
        .screen.active {display:block;}
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px);}
            to { opacity: 1; transform: translateX(0);}
        }
        .header {margin-bottom: 32px;}
        .header h1 {font-size:28px;font-weight:600;color:#1a1a1a;margin-bottom:4px;}
        .header p {font-size:15px;color:#666;font-weight:400;}
        .workout-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            border: 1px solid #e9ecef;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .workout-card:hover {background: #f1f3f4;transform:translateY(-1px);}
        .workout-card h3 {font-size:18px;font-weight:600;margin-bottom:8px;color:#1a1a1a;}
        .workout-meta {display: flex;gap: 16px;font-size:14px;color:#666;}
        .accent {color: #007AFF;}
        .exercise-item {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
        }
        .exercise-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .exercise-name {font-size:16px;font-weight:500;color:#1a1a1a;}
        .set-counter {font-size:14px;color:#666;}
        .sets-container {display:flex;flex-direction:column;gap:8px;}
        .set-row {display:flex;align-items:center;gap:12px;padding:8px 0;}
        .set-number {width:24px;font-size:14px;color:#666;text-align:center;}
        .set-input {flex:1;display:flex;gap:8px;}
        .input-field {
            flex:1;padding:8px 12px;border:1px solid #e9ecef;
            border-radius:6px;font-size:16px;text-align:center;background:#fafafa;transition:all 0.2s ease;
        }
        .input-field:focus {outline:none;border-color:#007AFF;background:white;}
        .input-field.completed {background:#f0f9ff;border-color:#007AFF;}
        .set-check {
            width:20px;height:20px;border:2px solid #e9ecef;
            border-radius:50%;cursor:pointer;transition:all 0.2s ease;display:flex;
            align-items:center;justify-content:center;
        }
        .set-check.completed {background:#007AFF;border-color:#007AFF;color:white;}
        .timer-section {
            background:#f8f9fa;border-radius:12px;padding:24px;text-align:center;margin:24px 0;
        }
        .timer-display {font-size:48px;font-weight:300;color:#1a1a1a;margin-bottom:8px;font-variant-numeric:tabular-nums;}
        .timer-display.active {color:#007AFF;}
        .timer-label {font-size:14px;color:#666;margin-bottom:16px;}
        .timer-controls {display:flex;gap:12px;justify-content:center;}
        .btn {padding:12px 24px;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;transition:all 0.2s ease;}
        .btn-primary {background:#007AFF;color:white;}
        .btn-primary:hover {background:#0056CC;}
        .btn-secondary {background:#f1f3f4;color:#1a1a1a;}
        .btn-secondary:hover {background:#e8eaed;}
        .progress-bar {width:100%;height:4px;background:#e9ecef;border-radius:2px;overflow:hidden;margin:16px 0;}
        .progress-fill {height:100%;background:#007AFF;transition:width 0.3s ease;border-radius:2px;}
        .stats-grid {display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0;}
        .stat-card {background:#f8f9fa;border-radius:8px;padding:16px;text-align:center;}
        .stat-value {font-size:24px;font-weight:600;color:#1a1a1a;margin-bottom:4px;}
        .stat-label {font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.5px;}
        .nav-bar {
            position:fixed;bottom:0;left:50%;transform:translateX(-50%);
            width:390px;background:white;border-top:1px solid #e9ecef;padding:12px 20px;
            display:flex;justify-content:space-around;
        }
        .nav-item {padding:8px 16px;border-radius:6px;font-size:14px;color:#666;cursor:pointer;transition:all 0.2s ease;}
        .nav-item.active {background:#f0f9ff;color:#007AFF;}
        .add-exercise-btn {width:100%;padding:16px;background:#007AFF;color:white;border:none;
            border-radius:8px;font-size:16px;font-weight:500;cursor:pointer;margin-top:16px;transition:all 0.2s ease;}
        .add-exercise-btn:hover {background:#0056CC;}
        .completion-screen {text-align:center;padding:60px 20px;}
        .completion-icon {
            width:80px;height:80px;background:#007AFF;border-radius:50%;
            display:flex;align-items:center;justify-content:center;margin:0 auto 24px;color:white;font-size:32px;
        }
        .pulse {animation:pulse 2s infinite;}
        @keyframes pulse {
            0% {transform:scale(1);}
            50% {transform:scale(1.05);}
            100% {transform:scale(1);}
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Screen 1: Workout Overview -->
        <div class="screen active" id="overview">
            <div class="header">
                <h1>Workouts</h1>
                <p>Track your progress</p>
            </div>
            <div class="workout-card" onclick="startWorkout()">
                <h3>Push Day</h3>
                <div class="workout-meta">
                    <span>6 exercises</span>
                    <span class="accent">45 min</span>
                </div>
            </div>
            <div class="workout-card" onclick="startWorkout()">
                <h3>Pull Day</h3>
                <div class="workout-meta">
                    <span>5 exercises</span>
                    <span class="accent">40 min</span>
                </div>
            </div>
            <div class="workout-card" onclick="startWorkout()">
                <h3>Leg Day</h3>
                <div class="workout-meta">
                    <span>7 exercises</span>
                    <span class="accent">50 min</span>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">12</div>
                    <div class="stat-label">This Week</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">3.2k</div>
                    <div class="stat-label">Total Sets</div>
                </div>
            </div>
        </div>
        <!-- Screen 2: Active Workout -->
        <div class="screen" id="workout">
            <div class="header">
                <h1>Push Day</h1>
                <p>Exercise <span id="currentExerciseNum">1</span> of 6</p>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="workoutProgress" style="width: 16.67%"></div>
            </div>
            <div class="exercise-item">
                <div class="exercise-header">
                    <div class="exercise-name" id="exerciseName">Bench Press</div>
                    <div class="set-counter">Set <span id="currentSet">1</span> of 4</div>
                </div>
                <div class="sets-container" id="setsContainer">
                    <!-- JS will populate set rows -->
                </div>
            </div>
            <div class="timer-section">
                <div class="timer-display" id="timerDisplay">02:30</div>
                <div class="timer-label">Rest Timer</div>
                <div class="timer-controls">
                    <button class="btn btn-secondary" onclick="resetTimer()">Reset</button>
                    <button class="btn btn-primary" id="timerBtn" onclick="toggleTimer()">Start</button>
                </div>
            </div>
            <button class="add-exercise-btn" onclick="nextExercise()">Next Exercise</button>
        </div>
        <!-- Screen 3: Workout Complete -->
        <div class="screen" id="complete">
            <div class="completion-screen">
                <div class="completion-icon pulse">✓</div>
                <h1 style="margin-bottom: 8px;">Workout Complete</h1>
                <p style="color: #666; margin-bottom: 32px;">Great job on your push day!</p>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">45:32</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">24</div>
                        <div class="stat-label">Sets</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">8,450</div>
                        <div class="stat-label">Volume (lbs)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">312</div>
                        <div class="stat-label">Calories</div>
                    </div>
                </div>
                <button class="add-exercise-btn" onclick="finishWorkout()">Finish Workout</button>
            </div>
        </div>
        <!-- Navigation -->
        <div class="nav-bar">
            <div class="nav-item active" data-target="overview">Workouts</div>
            <div class="nav-item" data-target="workout">Active</div>
            <div class="nav-item" data-target="complete">Stats</div>
        </div>
    </div>
    <script>
        const exercises = ["Bench Press", "Shoulder Press", "Incline Dumbbell", "Triceps Extension", "Chest Fly", "Pushups"];
        let currentExercise = 0;
        let completedSets = 0;
        const setsPerExercise = 4;

        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.dataset.target === screenId);
            });
        }

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                showScreen(item.dataset.target);
            });
        });

        function startWorkout() {
            currentExercise = 0;
            loadExercise();
            showScreen('workout');
        }

        function loadExercise() {
            document.getElementById('currentExerciseNum').textContent = (currentExercise + 1);
            document.getElementById('exerciseName').textContent = exercises[currentExercise];
            document.getElementById('workoutProgress').style.width = ((currentExercise + 1) / exercises.length * 100) + '%';
            buildSets();
        }

        function buildSets() {
            const container = document.getElementById('setsContainer');
            container.innerHTML = '';
            for (let i = 1; i <= setsPerExercise; i++) {
                container.innerHTML += `
                <div class="set-row">
                  <div class="set-number">${i}</div>
                  <div class="set-input">
                    <input type="number" class="input-field" placeholder="Weight">
                    <input type="number" class="input-field" placeholder="Reps">
                  </div>
                  <div class="set-check" onclick="completeSet(this)"></div>
                </div>`;
            }
            document.getElementById('currentSet').textContent = '1';
        }

        function completeSet(checkElement) {
            const setRow = checkElement.parentElement;
            const inputs = setRow.querySelectorAll('.input-field');
            if (inputs[0].value && inputs[1].value) {
                checkElement.classList.add('completed');
                checkElement.innerHTML = '✓';
                inputs.forEach(input => input.classList.add('completed'));
                // Count completed sets
                const completed = document.querySelectorAll('#setsContainer .set-check.completed').length;
                document.getElementById('currentSet').textContent = completed + 1 > setsPerExercise ? setsPerExercise : completed + 1;
                // Start rest timer if just completed, not last set
                if (!isTimerRunning && completed < setsPerExercise) toggleTimer();
            }
        }

        let timerInterval, timerSeconds = 150, isTimerRunning = false;
        function toggleTimer() {
            const timerBtn = document.getElementById('timerBtn');
            const timerDisplay = document.getElementById('timerDisplay');
            if (isTimerRunning) {
                clearInterval(timerInterval);
                timerBtn.textContent = 'Start';
                timerDisplay.classList.remove('active');
                isTimerRunning = false;
            } else {
                timerInterval = setInterval(updateTimer, 1000);
                timerBtn.textContent = 'Pause';
                timerDisplay.classList.add('active');
                isTimerRunning = true;
            }
        }
        function updateTimer() {
            if (timerSeconds > 0) {
                timerSeconds--;
                const minutes = Math.floor(timerSeconds / 60);
                const seconds = timerSeconds % 60;
                document.getElementById('timerDisplay').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                clearInterval(timerInterval);
                document.getElementById('timerBtn').textContent = 'Start';
                document.getElementById('timerDisplay').classList.remove('active');
                isTimerRunning = false;
                timerSeconds = 150;
            }
        }
        function resetTimer() {
            clearInterval(timerInterval);
            timerSeconds = 150;
            document.getElementById('timerDisplay').textContent = '02:30';
            document.getElementById('timerDisplay').classList.remove('active');
            document.getElementById('timerBtn').textContent = 'Start';
            isTimerRunning = false;
        }
        function nextExercise() {
            currentExercise++;
            if (currentExercise >= exercises.length) {
                showScreen('complete');
            } else {
                loadExercise();
                resetTimer();
            }
        }
        function finishWorkout() {
            showScreen('overview');
            currentExercise = 0;
            resetTimer();
        }
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('input-field')) {
                const setRow = e.target.closest('.set-row');
                const inputs = setRow.querySelectorAll('.input-field');
                const checkElement = setRow.querySelector('.set-check');
                if (inputs[0].value && inputs[1].value && !checkElement.classList.contains('completed')) {
                    setTimeout(() => completeSet(checkElement), 300);
                }
            }
        });
        // Initialize sets for the first exercise on page load
        buildSets();
    </script>
</body>
</html>
