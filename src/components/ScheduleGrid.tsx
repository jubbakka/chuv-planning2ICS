import type { Schedule, ScheduleEntry, Employee } from "@/types/schedule";
import { SCHEDULE_CODES } from "@/types/schedule";
import { Download } from "lucide-react";

interface ScheduleGridProps {
    schedule: Schedule;
    onCellClick: (employeeId: string, date: number) => void;
    onDownloadEmployee?: (employee: Employee) => void;
}

/**
 * Grille de planning : employés en lignes, jours en colonnes
 */
const ScheduleGrid = ({ schedule, onCellClick, onDownloadEmployee }: ScheduleGridProps) => {
    const { month, year, employees, entries } = schedule;

    // Calculer le nombre de jours dans le mois
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Note: mondayFirstDay pourrait être utilisé pour aligner la grille avec les jours de la semaine
    // Pour l'instant, on affiche simplement tous les jours du mois en colonnes

    // Mapper les codes aux classes Tailwind
    const colorClasses: Record<string, string> = {
        // Jours et leurs variantes
        J: 'bg-blue-100 text-blue-800',
        JC: 'bg-teal-100 text-teal-800',
        JB: 'bg-green-100 text-green-800',
        // Nuits et jumelages de nuit
        N: 'bg-black text-yellow-300',
        NC: 'bg-black text-yellow-200',
        NA: 'bg-black text-yellow-300',
        // Bloqués / Repos / Vacances
        X: 'bg-red-100 text-red-800',
        R: 'bg-yellow-100 text-yellow-800',
        V: 'bg-orange-100 text-orange-800',
        // Santé & maternité
        M: 'bg-indigo-100 text-indigo-800',
        CM: 'bg-pink-100 text-pink-800',
        MM: 'bg-pink-200 text-pink-900',
        // Formation
        F: 'bg-teal-100 text-teal-800',
    };

    // Fonction pour obtenir l'entrée d'un employé pour un jour donné
    const getEntry = (employeeId: string, date: number): ScheduleEntry | undefined => {
        return entries.find(e => e.employeeId === employeeId && e.date === date);
    };

    // Fonction pour vérifier si un jour est un weekend
    const isWeekend = (date: number): boolean => {
        const dayOfWeek = new Date(year, month - 1, date).getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Dimanche ou samedi
    };

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
                <table className="border-collapse border border-gray-300 bg-white">
                    {/* En-tête avec jours */}
                    <thead>
                        <tr>
                            <th className="border border-gray-300 bg-gray-100 p-2 text-left font-semibold text-gray-900 sticky left-0 z-10 bg-gray-100">
                                Employé
                            </th>
                            {days.map((day) => {
                                const date = new Date(year, month - 1, day);
                                const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                                const isWeekendDay = isWeekend(day);
                                return (
                                    <th
                                        key={day}
                                        className={`border border-gray-300 p-2 text-center font-semibold text-sm min-w-[60px] rounded-lg ${
                                            isWeekendDay ? 'bg-gray-300 text-gray-700' : 'bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        <div>{dayName}</div>
                                        <div className="text-xs">{day}</div>
                                    </th>
                                );
                            })}
                            <th className="border border-gray-300 bg-gray-100 p-2 text-center font-semibold text-sm min-w-[100px]">
                                ICS
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td className="border border-gray-300 bg-gray-50 p-2 font-medium text-gray-900 sticky left-0 z-10 bg-gray-50">
                                    {employee.name}
                                </td>
                                {days.map((day) => {
                                    const entry = getEntry(employee.id, day);
                                    const code = entry ? SCHEDULE_CODES[entry.code] : null;
                                    const isWeekendDay = isWeekend(day);

                                    return (
                                        <td
                                            key={`${employee.id}-${day}`}
                                            onClick={() => onCellClick(employee.id, day)}
                                            className={`border border-gray-300 p-2 text-center cursor-pointer transition-all min-w-[60px] rounded-lg ${
                                                code && entry
                                                    ? `${colorClasses[entry.code] || 'bg-gray-400 text-gray-800'} font-semibold hover:opacity-80 ${isWeekendDay ? 'opacity-90' : ''}`
                                                    : isWeekendDay
                                                    ? 'bg-gray-100 hover:bg-gray-200 hover:border-gray-400'
                                                    : 'bg-white hover:bg-blue-50 hover:border-blue-300'
                                            }`}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    onCellClick(employee.id, day);
                                                }
                                            }}
                                            aria-label={`${employee.name}, jour ${day}${code ? `, ${code.description}` : ', vide'}`}
                                        >
                                            {code?.code || ''}
                                        </td>
                                    );
                                })}
                                <td className="border border-gray-300 bg-gray-50 p-2 text-center align-middle">
                                    {onDownloadEmployee && (
                                        <button
                                            onClick={() => onDownloadEmployee(employee)}
                                            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                                            aria-label={`Télécharger ICS pour ${employee.name}`}
                                            title={`Télécharger ICS pour ${employee.name}`}
                                        >
                                            <Download className="h-4 w-4" />
                                            <span className="hidden sm:inline">ICS</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleGrid;

