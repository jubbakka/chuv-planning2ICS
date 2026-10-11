export interface ScheduleCode {
    code: string;
    startTime: string;
    endTime: string;
    description: string;
    color: string;
}

export interface Employee {
    id: string;
    name: string;
}

export interface ScheduleEntry {
    employeeId: string;
    date: number;
    code: string;
}

export interface Schedule {
    id: string;
    month: number;
    year: number;
    employees: Employee[];
    entries: ScheduleEntry[];
}

export const SCHEDULE_CODES: Record<string, ScheduleCode> = {
    // Jours et variantes
    J: {
        code: 'J',
        startTime: '07:00',
        endTime: '19:30',
        description: 'Jour',
        color: 'blue',
    },
    JC: {
        code: 'JC',
        startTime: '07:00',
        endTime: '19:30',
        description: 'Jour jumelé',
        color: 'light-green',
    },
    JB: {
        code: 'JB',
        startTime: '07:00',
        endTime: '19:30',
        description: 'Jour de jumelage',
        color: 'dark-green',
    },

    N: {
        code: 'N',
        startTime: '19:00',
        endTime: '07:30',
        description: 'Nuit',
        color: 'black',
    },
    NC: {
        code: 'NC',
        startTime: '19:00',
        endTime: '07:30',
        description: 'Nuit jumelée',
        color: 'dark-grey',
    },
    NA: {
        code: 'NA',
        startTime: '19:00',
        endTime: '07:30',
        description: 'Nuit de jumelage',
        color: 'black',
    },

    // Congés et absences
    M: {
        code: 'M',
        startTime: '00:00',
        endTime: '23:59',
        description: 'Maladie',
        color: 'purple',
    },
    CM: {
        code: 'CM',
        startTime: '00:00',
        endTime: '23:59',
        description: 'Congé maternité',
        color: 'pink',
    },
    MM: {
        code: 'MM',
        startTime: '00:00',
        endTime: '23:59',
        description: 'Arrêt maternité',
        color: 'dark-pink',
    },
    R: {
        code: 'R',
        startTime: '00:00',
        endTime: '23:59',
        description: 'Repos',
        color: 'yellow',
    },
    V: {
        code: 'V',
        startTime: '00:00',
        endTime: '23:59',
        description: 'Vacances',
        color: 'orange',
    },
    X: {
        code: 'X',
        startTime: '00:00',
        endTime: '23:59',
        description: 'Bloqué',
        color: 'red',
    },

    // Formation
    F: {
        code: 'F',
        startTime: '08:00',
        endTime: '16:00',
        description: 'Formation',
        color: 'teal',
    },
    // enseignement clinique
    EC: {
        code: 'EC',
        startTime: '07:00',
        endTime: '19:30',
        description: 'Enseignement clinique',
        color: 'blue',
    },
    // enseignement clinique
    E: {
        code: 'E',
        startTime: '07:00',
        endTime: '19:30',
        description: 'Examen',
        color: 'red',
    },

};

export const CODE_COLOR_CLASSES: Record<string, string> = {

    J: 'bg-blue-100 text-blue-800',
    JC: 'bg-teal-100 text-teal-800',
    JB: 'bg-green-100 text-green-800',

    N: 'bg-black text-yellow-300',
    NC: 'bg-black text-yellow-200',
    NA: 'bg-black text-yellow-300',

    X: 'bg-red-100 text-red-800',
    R: 'bg-yellow-100 text-yellow-800',
    V: 'bg-orange-100 text-orange-800',

    M: 'bg-indigo-100 text-indigo-800',
    CM: 'bg-pink-100 text-pink-800',
    MM: 'bg-pink-200 text-pink-900',

    F: 'bg-teal-100 text-teal-800',
    EC: 'bg-sky-100 text-sky-800',
    E: 'bg-rose-100 text-rose-800',
};
