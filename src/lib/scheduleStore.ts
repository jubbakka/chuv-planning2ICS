import type { Schedule, ScheduleEntry, Employee } from "@/types/schedule";

const STORAGE_PREFIX = "schedule_";
const CURRENT_SCHEDULE_KEY = "currentSchedule";
const SCHEDULES_LIST_KEY = "schedules_list";

/**
 * Génère un ID unique
 */
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Récupère un planning par son ID
 */
export function getSchedule(id: string): Schedule | null {
    try {
        const item = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
        if (!item) return null;
        return JSON.parse(item) as Schedule;
    } catch (error) {
        console.error("Error reading schedule:", error);
        return null;
    }
}

/**
 * Sauvegarde un planning dans localStorage
 */
export function saveSchedule(schedule: Schedule): void {
    try {
        // Valider le planning avant sauvegarde
        if (!schedule.id || !schedule.month || !schedule.year) {
            throw new Error("Invalid schedule: missing required fields");
        }
        if (schedule.month < 1 || schedule.month > 12) {
            throw new Error("Invalid schedule: month must be between 1 and 12");
        }
        if (!schedule.employees || schedule.employees.length === 0) {
            throw new Error("Invalid schedule: at least one employee is required");
        }

        // Sauvegarder le planning
        localStorage.setItem(`${STORAGE_PREFIX}${schedule.id}`, JSON.stringify(schedule));

        // Mettre à jour la liste des plannings
        const schedulesList = listSchedules();
        const exists = schedulesList.some(s => s.id === schedule.id);
        if (!exists) {
            schedulesList.push(schedule);
            localStorage.setItem(SCHEDULES_LIST_KEY, JSON.stringify(schedulesList.map(s => s.id)));
        }
    } catch (error) {
        console.error("Error saving schedule:", error);
        throw error;
    }
}

/**
 * Récupère le planning actuel
 */
export function getCurrentSchedule(): Schedule | null {
    try {
        const currentId = localStorage.getItem(CURRENT_SCHEDULE_KEY);
        if (!currentId) return null;
        return getSchedule(currentId);
    } catch (error) {
        console.error("Error getting current schedule:", error);
        return null;
    }
}

/**
 * Définit le planning actuel
 */
export function setCurrentSchedule(scheduleId: string): void {
    try {
        const schedule = getSchedule(scheduleId);
        if (!schedule) {
            throw new Error(`Schedule with id ${scheduleId} not found`);
        }
        localStorage.setItem(CURRENT_SCHEDULE_KEY, scheduleId);
    } catch (error) {
        console.error("Error setting current schedule:", error);
        throw error;
    }
}

/**
 * Supprime un planning
 */
export function deleteSchedule(id: string): void {
    try {
        localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
        
        // Retirer de la liste
        const schedulesList = listSchedules();
        const updatedList = schedulesList.filter(s => s.id !== id);
        localStorage.setItem(SCHEDULES_LIST_KEY, JSON.stringify(updatedList.map(s => s.id)));
        
        // Si c'était le planning actuel, le retirer
        const currentId = localStorage.getItem(CURRENT_SCHEDULE_KEY);
        if (currentId === id) {
            localStorage.removeItem(CURRENT_SCHEDULE_KEY);
        }
    } catch (error) {
        console.error("Error deleting schedule:", error);
        throw error;
    }
}

/**
 * Liste tous les plannings sauvegardés
 */
export function listSchedules(): Schedule[] {
    try {
        const listJson = localStorage.getItem(SCHEDULES_LIST_KEY);
        if (!listJson) return [];
        
        const scheduleIds: string[] = JSON.parse(listJson);
        const schedules: Schedule[] = [];
        
        for (const id of scheduleIds) {
            const schedule = getSchedule(id);
            if (schedule) {
                schedules.push(schedule);
            }
        }
        
        return schedules;
    } catch (error) {
        console.error("Error listing schedules:", error);
        return [];
    }
}

/**
 * Ajoute une entrée au planning
 */
export function addEntry(scheduleId: string, entry: ScheduleEntry): void {
    const schedule = getSchedule(scheduleId);
    if (!schedule) {
        throw new Error(`Schedule with id ${scheduleId} not found`);
    }

    // Valider l'entrée
    if (!entry.employeeId || !entry.code || !entry.date) {
        throw new Error("Invalid entry: missing required fields");
    }
    if (entry.date < 1 || entry.date > 31) {
        throw new Error("Invalid entry: date must be between 1 and 31");
    }
    if (!schedule.employees.some(emp => emp.id === entry.employeeId)) {
        throw new Error("Invalid entry: employee not found in schedule");
    }

    // Vérifier si une entrée existe déjà pour cet employé à cette date
    const existingIndex = schedule.entries.findIndex(
        e => e.employeeId === entry.employeeId && e.date === entry.date
    );

    if (existingIndex >= 0) {
        // Remplacer l'entrée existante
        schedule.entries[existingIndex] = entry;
    } else {
        // Ajouter la nouvelle entrée
        schedule.entries.push(entry);
    }

    saveSchedule(schedule);
}

/**
 * Met à jour une entrée existante
 */
export function updateEntry(scheduleId: string, entry: ScheduleEntry): void {
    addEntry(scheduleId, entry); // addEntry gère déjà la mise à jour
}

/**
 * Supprime une entrée
 */
export function removeEntry(scheduleId: string, employeeId: string, date: number): void {
    const schedule = getSchedule(scheduleId);
    if (!schedule) {
        throw new Error(`Schedule with id ${scheduleId} not found`);
    }

    schedule.entries = schedule.entries.filter(
        e => !(e.employeeId === employeeId && e.date === date)
    );

    saveSchedule(schedule);
}

/**
 * Récupère toutes les entrées d'un employé
 */
export function getEntriesForEmployee(scheduleId: string, employeeId: string): ScheduleEntry[] {
    const schedule = getSchedule(scheduleId);
    if (!schedule) {
        return [];
    }

    return schedule.entries.filter(e => e.employeeId === employeeId);
}

/**
 * Ajoute un employé au planning
 */
export function addEmployee(scheduleId: string, employee: Employee): void {
    const schedule = getSchedule(scheduleId);
    if (!schedule) {
        throw new Error(`Schedule with id ${scheduleId} not found`);
    }

    if (!employee.id || !employee.name) {
        throw new Error("Invalid employee: missing required fields");
    }

    // Vérifier si l'employé existe déjà
    if (schedule.employees.some(emp => emp.id === employee.id)) {
        throw new Error("Employee already exists in schedule");
    }

    schedule.employees.push(employee);
    saveSchedule(schedule);
}

/**
 * Met à jour un employé
 */
export function updateEmployee(scheduleId: string, employee: Employee): void {
    const schedule = getSchedule(scheduleId);
    if (!schedule) {
        throw new Error(`Schedule with id ${scheduleId} not found`);
    }

    if (!employee.id || !employee.name) {
        throw new Error("Invalid employee: missing required fields");
    }

    const index = schedule.employees.findIndex(emp => emp.id === employee.id);
    if (index === -1) {
        throw new Error("Employee not found in schedule");
    }

    schedule.employees[index] = employee;
    saveSchedule(schedule);
}

/**
 * Supprime un employé (et toutes ses entrées)
 */
export function removeEmployee(scheduleId: string, employeeId: string): void {
    const schedule = getSchedule(scheduleId);
    if (!schedule) {
        throw new Error(`Schedule with id ${scheduleId} not found`);
    }

    // Vérifier qu'on ne supprime pas le dernier employé
    if (schedule.employees.length <= 1) {
        throw new Error("Cannot remove the last employee");
    }

    // Supprimer l'employé
    schedule.employees = schedule.employees.filter(emp => emp.id !== employeeId);

    // Supprimer toutes ses entrées
    schedule.entries = schedule.entries.filter(e => e.employeeId !== employeeId);

    saveSchedule(schedule);
}

/**
 * Récupère une entrée spécifique
 */
export function getEntry(scheduleId: string, employeeId: string, date: number): ScheduleEntry | null {
    const schedule = getSchedule(scheduleId);
    if (!schedule) {
        return null;
    }

    const entry = schedule.entries.find(
        e => e.employeeId === employeeId && e.date === date
    );

    return entry || null;
}

