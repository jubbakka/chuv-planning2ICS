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
};

