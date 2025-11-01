import type { Schedule, Employee, ScheduleEntry } from "@/types/schedule";
import { SCHEDULE_CODES } from "@/types/schedule";

/**
 * Génère un timestamp ICS au format YYYYMMDDTHHMMSSZ
 */
function formatICSDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Échappe les caractères spéciaux pour le format ICS
 */
function escapeICS(text: string): string {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

/**
 * Vérifie si un code est "all-day" (00:00-23:59)
 */
function isAllDay(code: string): boolean {
    const scheduleCode = SCHEDULE_CODES[code];
    if (!scheduleCode) return false;
    return scheduleCode.startTime === '00:00' && scheduleCode.endTime === '23:59';
}

/**
 * Crée une date avec l'heure spécifiée pour un jour donné
 */
function createDate(year: number, month: number, day: number, timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    // month est 1-12, Date utilise 0-11
    return new Date(year, month - 1, day, hours, minutes);
}

/**
 * Génère un événement ICS unique pour un jour
 */
function generateEvent(employee: Employee, entry: ScheduleEntry, year: number, month: number): string {
    const scheduleCode = SCHEDULE_CODES[entry.code];
    if (!scheduleCode) {
        console.warn(`Unknown schedule code: ${entry.code}`);
        return '';
    }

    const day = entry.date;
    const codeDesc = scheduleCode.description;
    const title = `${codeDesc} - ${employee.name}`;
    const description = `${scheduleCode.code}: ${codeDesc}`;

    const dtstart = createDate(year, month, day, scheduleCode.startTime);
    let dtend: Date;

    // Gérer les shifts de nuit qui chevauchent minuit
    if (scheduleCode.startTime > scheduleCode.endTime) {
        // Shift de nuit : commence le jour J et se termine le jour J+1
        dtend = createDate(year, month, day + 1, scheduleCode.endTime);
    } else {
        // Shift normal : même jour
        dtend = createDate(year, month, day, scheduleCode.endTime);
    }

    const dtstamp = new Date(); // Timestamp de génération
    const uid = `${dtstart.getTime()}-${employee.id}-${entry.code}@chuv-planning`;

    let ics = `BEGIN:VEVENT\r\n`;
    ics += `UID:${uid}\r\n`;
    ics += `DTSTAMP:${formatICSDate(dtstamp)}\r\n`;
    
    if (isAllDay(entry.code)) {
        // Pour les événements all-day, utiliser DATE au lieu de DATE-TIME
        const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
        ics += `DTSTART;VALUE=DATE:${dateStr}\r\n`;
        ics += `DTEND;VALUE=DATE:${dateStr}\r\n`;
    } else {
        // Pour les événements avec horaires spécifiques
        ics += `DTSTART:${formatICSDate(dtstart)}\r\n`;
        ics += `DTEND:${formatICSDate(dtend)}\r\n`;
    }
    
    ics += `SUMMARY:${escapeICS(title)}\r\n`;
    ics += `DESCRIPTION:${escapeICS(description)}\r\n`;
    ics += `END:VEVENT\r\n`;

    return ics;
}

/**
 * Regroupe les entrées all-day consécutives en un seul événement
 */
function groupConsecutiveAllDayEntries(entries: ScheduleEntry[]): Array<{ start: number; end: number; code: string }> {
    if (entries.length === 0) return [];

    const groups: Array<{ start: number; end: number; code: string }> = [];
    let currentStart = entries[0].date;
    let currentEnd = entries[0].date;
    let currentCode = entries[0].code;

    for (let i = 1; i < entries.length; i++) {
        const entry = entries[i];
        
        if (entry.code === currentCode && entry.date === currentEnd + 1 && isAllDay(entry.code)) {
            // Continue la séquence
            currentEnd = entry.date;
        } else {
            // Fin de la séquence, sauvegarder
            groups.push({ start: currentStart, end: currentEnd, code: currentCode });
            // Nouvelle séquence
            currentStart = entry.date;
            currentEnd = entry.date;
            currentCode = entry.code;
        }
    }

    // Ajouter le dernier groupe
    groups.push({ start: currentStart, end: currentEnd, code: currentCode });

    return groups;
}

/**
 * Génère un événement ICS pour une période all-day consécutive
 */
function generateAllDayRangeEvent(
    employee: Employee,
    startDay: number,
    endDay: number,
    code: string,
    year: number,
    month: number
): string {
    const scheduleCode = SCHEDULE_CODES[code];
    if (!scheduleCode) return '';

    const codeDesc = scheduleCode.description;
    const title = `${codeDesc} - ${employee.name}`;
    const description = `${code}: ${codeDesc}`;

    const dtstamp = new Date();
    const uid = `allday-${year}-${month}-${startDay}-${endDay}-${employee.id}-${code}@chuv-planning`;

    const startDateStr = `${year}${String(month).padStart(2, '0')}${String(startDay).padStart(2, '0')}`;
    const endDateStr = `${year}${String(month).padStart(2, '0')}${String(endDay + 1).padStart(2, '0')}`;

    let ics = `BEGIN:VEVENT\r\n`;
    ics += `UID:${uid}\r\n`;
    ics += `DTSTAMP:${formatICSDate(dtstamp)}\r\n`;
    ics += `DTSTART;VALUE=DATE:${startDateStr}\r\n`;
    ics += `DTEND;VALUE=DATE:${endDateStr}\r\n`;
    ics += `SUMMARY:${escapeICS(title)}\r\n`;
    ics += `DESCRIPTION:${escapeICS(description)}\r\n`;
    ics += `END:VEVENT\r\n`;

    return ics;
}

/**
 * Génère le fichier ICS complet pour un employé
 */
export function generateICS(employee: Employee, schedule: Schedule): string {
    const { month, year, entries } = schedule;

    // Filtrer les entrées de cet employé et les trier par date
    const employeeEntries = entries
        .filter(e => e.employeeId === employee.id)
        .sort((a, b) => a.date - b.date);

    if (employeeEntries.length === 0) {
        return ''; // Pas d'entrées, retourner ICS vide ou minimal
    }

    // Séparer les entrées all-day et les autres
    const allDayEntries: ScheduleEntry[] = [];
    const timeEntries: ScheduleEntry[] = [];

    employeeEntries.forEach(entry => {
        if (isAllDay(entry.code)) {
            allDayEntries.push(entry);
        } else {
            timeEntries.push(entry);
        }
    });

    // Générer les événements pour les entrées avec horaires
    let events = '';
    timeEntries.forEach(entry => {
        events += generateEvent(employee, entry, year, month);
    });

    // Grouper et générer les événements all-day consécutifs
    if (allDayEntries.length > 0) {
        const groups = groupConsecutiveAllDayEntries(allDayEntries);
        groups.forEach(group => {
            if (group.start === group.end) {
                // Un seul jour, générer comme événement normal
                const entry = allDayEntries.find(e => e.date === group.start && e.code === group.code);
                if (entry) {
                    events += generateEvent(employee, entry, year, month);
                }
            } else {
                // Plusieurs jours consécutifs
                events += generateAllDayRangeEvent(employee, group.start, group.end, group.code, year, month);
            }
        });
    }

    // En-tête ICS
    let ics = `BEGIN:VCALENDAR\r\n`;
    ics += `VERSION:2.0\r\n`;
    ics += `PRODID:-//CHUV Planning//Digitalizer//EN\r\n`;
    ics += `CALSCALE:GREGORIAN\r\n`;
    ics += `METHOD:PUBLISH\r\n`;
    ics += events;
    ics += `END:VCALENDAR\r\n`;

    return ics;
}

/**
 * Télécharge un fichier ICS
 */
export function downloadICS(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Génère et télécharge les ICS pour tous les employés d'un planning (un fichier par employé)
 */
export function generateAllICS(schedule: Schedule): void {
    schedule.employees.forEach(employee => {
        const icsContent = generateICS(employee, schedule);
        if (icsContent) {
            // Nom du fichier : nom de l'employé + mois-année
            const monthNames = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 
                              'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
            const monthName = monthNames[schedule.month - 1];
            const filename = `${employee.name.replace(/\s+/g, '_')}_${monthName}_${schedule.year}.ics`;
            downloadICS(icsContent, filename);
        }
    });
}

/**
 * Génère un ICS global contenant tous les employés d'un planning
 */
export function generateGlobalICS(schedule: Schedule): string {
    const { month, year, employees, entries } = schedule;

    // Séparer les entrées all-day et les autres
    const allDayEntries: Array<{ employee: Employee; entry: ScheduleEntry }> = [];
    const timeEntries: Array<{ employee: Employee; entry: ScheduleEntry }> = [];

    employees.forEach(employee => {
        const employeeEntries = entries
            .filter(e => e.employeeId === employee.id)
            .sort((a, b) => a.date - b.date);

        employeeEntries.forEach(entry => {
            if (isAllDay(entry.code)) {
                allDayEntries.push({ employee, entry });
            } else {
                timeEntries.push({ employee, entry });
            }
        });
    });

    // Générer les événements pour les entrées avec horaires
    let events = '';
    timeEntries.forEach(({ employee, entry }) => {
        events += generateEvent(employee, entry, year, month);
    });

    // Grouper et générer les événements all-day consécutifs par employé
    employees.forEach(employee => {
        const employeeAllDayEntries = allDayEntries
            .filter(item => item.employee.id === employee.id)
            .map(item => item.entry)
            .sort((a, b) => a.date - b.date);

        if (employeeAllDayEntries.length > 0) {
            const groups = groupConsecutiveAllDayEntries(employeeAllDayEntries);
            groups.forEach(group => {
                if (group.start === group.end) {
                    // Un seul jour
                    const entry = employeeAllDayEntries.find(e => e.date === group.start && e.code === group.code);
                    if (entry) {
                        events += generateEvent(employee, entry, year, month);
                    }
                } else {
                    // Plusieurs jours consécutifs
                    events += generateAllDayRangeEvent(employee, group.start, group.end, group.code, year, month);
                }
            });
        }
    });

    // En-tête ICS
    let ics = `BEGIN:VCALENDAR\r\n`;
    ics += `VERSION:2.0\r\n`;
    ics += `PRODID:-//CHUV Planning//Digitalizer//EN\r\n`;
    ics += `CALSCALE:GREGORIAN\r\n`;
    ics += `METHOD:PUBLISH\r\n`;
    ics += events;
    ics += `END:VCALENDAR\r\n`;

    return ics;
}

/**
 * Télécharge un ICS global pour tous les employés
 */
export function downloadGlobalICS(schedule: Schedule): void {
    const icsContent = generateGlobalICS(schedule);
    if (icsContent) {
        const monthNames = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 
                          'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
        const monthName = monthNames[schedule.month - 1];
        const filename = `Planning_${monthName}_${schedule.year}.ics`;
        downloadICS(icsContent, filename);
    }
}

