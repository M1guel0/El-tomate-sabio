const { sumar, restar } = require('./timer_Pomodoro.js'); // Ajusta según tu archivo

describe('Timer Pomodoro', () => {
  test('Función de suma debe funcionar', () => {
    // Si tu archivo tiene funciones, prueba una
    expect(sumar(2, 3)).toBe(5);
  });

  test('Prueba básica de verdadero', () => {
    expect(true).toBe(true);
  });
});