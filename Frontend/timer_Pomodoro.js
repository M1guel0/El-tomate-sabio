// Agrega esta función al final de timer_Pomodoro.js para facilitar el testing
function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Para que Jest pueda importarla:
module.exports = {
    secondsToMinutes: secondsToMinutes,
    PomodoroTimer: PomodoroTimer
    // Aquí puedes exportar cualquier otra función de tu clase que quieras testear
};

// ... (El resto de tu código de la clase PomodoroTimer)
// Inicializar la aplicación

class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutos en segundos
        this.breakTime = 5 * 60; // 5 minutos en segundos
        this.longBreakTime = 15 * 60; // 15 minutos en segundos
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkSession = true;
        this.pomodoroCount = 0;
        this.interval = null;
        
        this.initializeElements();
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        // Elementos del temporizador
        this.timeElement = document.getElementById('time');
        this.sessionInfoElement = document.getElementById('sessionInfo');
        this.progressElement = document.getElementById('progress');
        this.pomodoroCountElement = document.getElementById('pomodoroCount');
        
        // Botones
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.skipBtn = document.getElementById('skipBtn');
        
        // Configuración
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
        this.longBreakTimeInput = document.getElementById('longBreakTime');
        
        // Elementos de la lista de tareas
        this.todoInput = document.getElementById('todoInput');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        this.pendingCountElement = document.getElementById('pendingCount');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.currentFilter = 'all';
        this.todos = [];
    }

    setupEventListeners() {
        // Controles del temporizador
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.skipBtn.addEventListener('click', () => this.skip());
        
        // Configuración
        this.workTimeInput.addEventListener('change', (e) => this.updateWorkTime(e.target.value));
        this.breakTimeInput.addEventListener('change', (e) => this.updateBreakTime(e.target.value));
        this.longBreakTimeInput.addEventListener('change', (e) => this.updateLongBreakTime(e.target.value));
        
        // Lista de tareas
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        // Filtros
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.interval = setInterval(() => this.tick(), 1000);
            this.startBtn.textContent = 'Reanudar';
            this.showNotification('¡Sesión iniciada! Enfócate en tu tarea.');
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.startBtn.textContent = 'Comenzar';
        this.showNotification('Sesión pausada');
    }

    reset() {
        this.pause();
        this.timeLeft = this.isWorkSession ? this.workTime : this.breakTime;
        this.updateDisplay();
        this.showNotification('Temporizador reiniciado');
    }

    skip() {
        this.pause();
        this.switchSession();
        this.showNotification('Sesión saltada');
    }

    tick() {
        this.timeLeft--;
        this.updateDisplay();
        
        if (this.timeLeft <= 0) {
            this.sessionComplete();
        }
    }

    sessionComplete() {
        this.pause();
        
        if (this.isWorkSession) {
            this.pomodoroCount++;
            this.saveToLocalStorage();
            this.showNotification('¡Pomodoro completado! Toma un descanso.', 'work');
            
            if (this.pomodoroCount % 4 === 0) {
                this.timeLeft = this.longBreakTime;
                this.sessionInfoElement.textContent = 'Descanso Largo';
            } else {
                this.timeLeft = this.breakTime;
                this.sessionInfoElement.textContent = 'Descanso Corto';
            }
        } else {
            this.timeLeft = this.workTime;
            this.sessionInfoElement.textContent = 'Sesión de Trabajo';
            this.showNotification('¡Descanso terminado! De vuelta al trabajo.');
        }
        
        this.isWorkSession = !this.isWorkSession;
        this.updateDisplay();
        
        // Reproducir sonido de notificación
        this.playNotificationSound();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Actualizar barra de progreso
        const totalTime = this.isWorkSession ? this.workTime : this.breakTime;
        const progress = ((totalTime - this.timeLeft) / totalTime) * 100;
        this.progressElement.style.width = `${progress}%`;
        
        // Actualizar contador de pomodoros
        this.pomodoroCountElement.textContent = this.pomodoroCount;
    }

    switchSession() {
        this.isWorkSession = !this.isWorkSession;
        this.timeLeft = this.isWorkSession ? this.workTime : this.breakTime;
        this.sessionInfoElement.textContent = this.isWorkSession ? 'Sesión de Trabajo' : 'Descanso';
        this.updateDisplay();
    }

    updateWorkTime(minutes) {
        this.workTime = minutes * 60;
        if (this.isWorkSession && !this.isRunning) {
            this.timeLeft = this.workTime;
            this.updateDisplay();
        }
    }

    updateBreakTime(minutes) {
        this.breakTime = minutes * 60;
        if (!this.isWorkSession && !this.isRunning) {
            this.timeLeft = this.breakTime;
            this.updateDisplay();
        }
    }

    updateLongBreakTime(minutes) {
        this.longBreakTime = minutes * 60;
    }

    // Métodos para la lista de tareas
    addTodo() {
        const text = this.todoInput.value.trim();
        if (text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.todos.push(todo);
            this.todoInput.value = '';
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
        }
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Actualizar botones activos
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.renderTodos();
    }

    renderTodos() {
        const filteredTodos = this.todos.filter(todo => {
            if (this.currentFilter === 'all') return true;
            if (this.currentFilter === 'pending') return !todo.completed;
            if (this.currentFilter === 'completed') return todo.completed;
            return true;
        });

        this.todoList.innerHTML = '';

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Eliminar</button>
                </div>
            `;

            li.querySelector('.todo-checkbox').addEventListener('change', () => {
                this.toggleTodo(todo.id);
            });

            this.todoList.appendChild(li);
        });
    }

    updateStats() {
        const pendingCount = this.todos.filter(todo => !todo.completed).length;
        this.pendingCountElement.textContent = `${pendingCount} tarea${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`;
    }

    // Local Storage
    saveToLocalStorage() {
        const data = {
            pomodoroCount: this.pomodoroCount,
            workTime: this.workTime,
            breakTime: this.breakTime,
            longBreakTime: this.longBreakTime
        };
        localStorage.setItem('pomodoroApp', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('pomodoroApp'));
        if (data) {
            this.pomodoroCount = data.pomodoroCount || 0;
            this.workTime = data.workTime || 25 * 60;
            this.breakTime = data.breakTime || 5 * 60;
            this.longBreakTime = data.longBreakTime || 15 * 60;
            
            // Actualizar inputs
            this.workTimeInput.value = this.workTime / 60;
            this.breakTimeInput.value = this.breakTime / 60;
            this.longBreakTimeInput.value = this.longBreakTime / 60;
        }
    }

    saveTodos() {
        localStorage.setItem('pomodoroTodos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const todos = JSON.parse(localStorage.getItem('pomodoroTodos'));
        if (todos) {
            this.todos = todos;
            this.renderTodos();
            this.updateStats();
        }
    }

    // Utilidades
    showNotification(message, type = 'break') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    playNotificationSound() {
        // Crear un sonido simple de notificación
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 1);
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('pomodoroApp'));
        if (data) {
            this.pomodoroCount = data.pomodoroCount || 0;
            this.workTime = data.workTime || 25 * 60;
            this.breakTime = data.breakTime || 5 * 60;
            this.longBreakTime = data.longBreakTime || 15 * 60;
            
            this.workTimeInput.value = this.workTime / 60;
            this.breakTimeInput.value = this.breakTime / 60;
            this.longBreakTimeInput.value = this.longBreakTime / 60;
        }
        
        this.loadTodos();
    }


}
const app = new PomodoroTimer();

