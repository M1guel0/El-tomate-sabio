class PomodoroTimer {
    constructor() {
        this.TiempoTrabajo = 25 * 60; // 25 minutos en segundos
        this.Descansos = 5 * 60; // 5 minutos en segundos
        this.Descansos_Largo = 15 * 60; // 15 minutos en segundos
        this.tiempo_restante = this.TiempoTrabajo;
        this.isRunning = false;
        this.Seccion_trabajo = true;
        this.Contador_pomodoro = 0;
        this.intervalo = null;
        
        this.initializeElements();
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.display = document.getElementById('display');
        this.startButton = document.getElementById('startButton');
        this.resetButton = document.getElementById('resetButton');
        this.workDurationInput = document.getElementById('workDuration');
        this.shortBreakInput = document.getElementById('shortBreak');
        this.longBreakInput = document.getElementById('longBreak');
    }