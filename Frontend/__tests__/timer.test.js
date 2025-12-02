// Importamos la función que acabamos de exportar del archivo principal
const { secondsToMinutes } = require('../timer_Pomodoro'); 

describe('Función secondsToMinutes', () => {
    test('Debe convertir 60 segundos a 01:00', () => {
        expect(secondsToMinutes(60)).toBe('01:00');
    });

    test('Debe convertir 1500 segundos (25 min) a 25:00', () => {
        expect(secondsToMinutes(1500)).toBe('25:00');
    });

    test('Debe convertir 30 segundos a 00:30', () => {
        expect(secondsToMinutes(30)).toBe('00:30');
    });
});