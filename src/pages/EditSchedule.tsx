import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Download, ArrowLeft } from "lucide-react";
import type { Schedule, Employee } from "@/types/schedule";
import { SCHEDULE_CODES } from "@/types/schedule";
import { getSchedule, addEntry, removeEntry } from "@/lib/scheduleStore";
import { generateAllICS, downloadGlobalICS, generateICS, downloadICS } from "@/lib/icsGenerator";
import ScheduleGrid from "@/components/ScheduleGrid";
import PrivacyBadge from "@/components/PrivacyBadge";

const EditSchedule = () => {
    const { scheduleId } = useParams<{ scheduleId: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [selectedCode, setSelectedCode] = useState<string | null>(null);

    useEffect(() => {
        if (!scheduleId) {
            navigate("/");
            return;
        }

        const loadedSchedule = getSchedule(scheduleId);
        if (!loadedSchedule) {
            navigate("/");
            return;
        }

        setSchedule(loadedSchedule);
        const firstCode = Object.keys(SCHEDULE_CODES)[0];
        setSelectedCode(firstCode);
    }, [scheduleId, navigate]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleCellClick = (employeeId: string, date: number) => {
        if (!schedule || !selectedCode) return;

        const existingEntry = schedule.entries.find(
            e => e.employeeId === employeeId && e.date === date
        );

        if (existingEntry) {

            if (existingEntry.code === selectedCode) {
                removeEntry(schedule.id, employeeId, date);
                const updatedSchedule = getSchedule(schedule.id);
                if (updatedSchedule) {
                    setSchedule(updatedSchedule);
                }
            } else {
                addEntry(schedule.id, {
                    employeeId,
                    date,
                    code: selectedCode,
                });
                const updatedSchedule = getSchedule(schedule.id);
                if (updatedSchedule) {
                    setSchedule(updatedSchedule);
                }
            }
        } else {
            addEntry(schedule.id, {
                employeeId,
                date,
                code: selectedCode,
            });
            const updatedSchedule = getSchedule(schedule.id);
            if (updatedSchedule) {
                setSchedule(updatedSchedule);
            }
        }
    };

    const handleExportIndividual = () => {
        if (!schedule) return;
        generateAllICS(schedule);
    };

    const handleExportGlobal = () => {
        if (!schedule) return;
        downloadGlobalICS(schedule);
    };

    const handleDownloadEmployee = (employee: Employee) => {
        if (!schedule) return;
        const icsContent = generateICS(employee, schedule);
        if (icsContent) {
            const monthNames = [
                t("createBlank.january") || "janvier",
                t("createBlank.february") || "fevrier",
                t("createBlank.march") || "mars",
                t("createBlank.april") || "avril",
                t("createBlank.may") || "mai",
                t("createBlank.june") || "juin",
                t("createBlank.july") || "juillet",
                t("createBlank.august") || "aout",
                t("createBlank.september") || "septembre",
                t("createBlank.october") || "octobre",
                t("createBlank.november") || "novembre",
                t("createBlank.december") || "decembre",
            ];
            const monthName = monthNames[schedule.month - 1];
            const filename = `${employee.name.replace(/\s+/g, '_')}_${monthName}_${schedule.year}.ics`;
            downloadICS(icsContent, filename);
        }
    };

    if (!schedule) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Chargement...</p>
            </div>
        );
    }

    const monthNames = [
        t("createBlank.january") || "Janvier",
        t("createBlank.february") || "Février",
        t("createBlank.march") || "Mars",
        t("createBlank.april") || "Avril",
        t("createBlank.may") || "Mai",
        t("createBlank.june") || "Juin",
        t("createBlank.july") || "Juillet",
        t("createBlank.august") || "Août",
        t("createBlank.september") || "Septembre",
        t("createBlank.october") || "Octobre",
        t("createBlank.november") || "Novembre",
        t("createBlank.december") || "Décembre",
    ];

    const colorClasses: Record<string, string> = {

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
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col p-4 sm:p-6 lg:p-12 font-['Roboto',sans-serif]">

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                    <Globe className="h-5 w-5 text-gray-600" aria-hidden="true" />
                    <select
                        value={i18n.language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="bg-transparent text-gray-900 text-sm sm:text-base focus:ring-0 focus:outline-none"
                        aria-label="Language selector"
                    >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                    </select>
                </div>
            </div>


            <header className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                            {t("edit.title") || "Éditer le Planning"}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {monthNames[schedule.month - 1]} {schedule.year}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                            onClick={handleExportIndividual}
                            variant="outline"
                            className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                            <Download className="h-4 w-4" />
                            <span>{t("edit.exportIndividual") || "ICS par employé"}</span>
                        </Button>
                        <Button
                            onClick={handleExportGlobal}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>{t("edit.exportGlobal") || "ICS global"}</span>
                        </Button>
                    </div>
                </div>
                <div className="mt-4">
                    <Button asChild variant="secondary" size="sm">
                        <Link to="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span>{t("edit.back") || "Retour"}</span>
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="flex-grow space-y-6">

                <Card className="shadow-md rounded-lg border border-gray-200">
                    <CardContent className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {t("edit.selectCode") || "Sélectionner un code"}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(SCHEDULE_CODES).map((code) => (
                                <button
                                    key={code.code}
                                    onClick={() => setSelectedCode(code.code)}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                                        selectedCode === code.code
                                            ? `${colorClasses[code.code] || 'bg-gray-500 text-gray-800'} ring-4 ring-blue-300 scale-105`
                                            : `${colorClasses[code.code] || 'bg-gray-500 text-gray-800'} opacity-70 hover:opacity-100`
                                    }`}
                                    aria-label={`Sélectionner ${code.description}`}
                                    aria-pressed={selectedCode === code.code}
                                >
                                    {code.code} - {code.description}
                                </button>
                            ))}
                        </div>
                        {selectedCode && (
                            <p className="mt-3 text-sm text-gray-600">
                                {t("edit.selectedCode") || "Code sélectionné"}:{' '}
                                <span className="font-semibold">
                                    {SCHEDULE_CODES[selectedCode].description}
                                </span>
                            </p>
                        )}
                    </CardContent>
                </Card>


                <Card className="shadow-md rounded-lg border border-gray-200 overflow-hidden">
                    <CardContent className="p-4">
                        <ScheduleGrid schedule={schedule} onCellClick={handleCellClick} onDownloadEmployee={handleDownloadEmployee} />
                    </CardContent>
                </Card>
            </main>

            <PrivacyBadge />
        </div>
    );
};

export default EditSchedule;

