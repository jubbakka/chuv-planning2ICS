import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Calendar, ChevronLeft, ChevronRight, Globe, Plus, Trash2} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import type {Employee, Schedule} from "@/types/schedule";

const CreateBlankSchedule = () => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    // Génération d'ID simple
    const generateId = (): string => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    // État local
    const currentDate = new Date();
    const [month, setMonth] = useState<number>(currentDate.getMonth() + 1); // 1-12
    const [year, setYear] = useState<number>(currentDate.getFullYear());
    const [employees, setEmployees] = useState<Array<{ id: string; name: string }>>([
        {id: generateId(), name: ''}
    ]);

    // Liste des mois
    const months = [
        {value: 1, label: t("createBlank.january") || "Janvier"},
        {value: 2, label: t("createBlank.february") || "Février"},
        {value: 3, label: t("createBlank.march") || "Mars"},
        {value: 4, label: t("createBlank.april") || "Avril"},
        {value: 5, label: t("createBlank.may") || "Mai"},
        {value: 6, label: t("createBlank.june") || "Juin"},
        {value: 7, label: t("createBlank.july") || "Juillet"},
        {value: 8, label: t("createBlank.august") || "Août"},
        {value: 9, label: t("createBlank.september") || "Septembre"},
        {value: 10, label: t("createBlank.october") || "Octobre"},
        {value: 11, label: t("createBlank.november") || "Novembre"},
        {value: 12, label: t("createBlank.december") || "Décembre"},
    ];

    // Fonctions pour gérer les employés
    const addEmployee = () => {
        setEmployees([...employees, {id: generateId(), name: ''}]);
    };

    const removeEmployee = (id: string) => {
        if (employees.length > 1) {
            setEmployees(employees.filter(emp => emp.id !== id));
        }
    };

    const updateEmployeeName = (id: string, name: string) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? {...emp, name} : emp
        ));
    };

    // Gestion de l'année
    const incrementYear = () => {
        setYear(year + 1);
    };

    const decrementYear = () => {
        if (year > 2020) { // Année minimum raisonnable
            setYear(year - 1);
        }
    };

    // Validation et génération du planning
    const handleGenerate = () => {
        // Filtrer les employés vides et valider
        const validEmployees = employees
            .filter(emp => emp.name.trim() !== '')
            .map((emp): Employee => ({
                id: emp.id,
                name: emp.name.trim()
            }));

        if (validEmployees.length === 0) {
            alert(t("createBlank.errorNoEmployee") || "Au moins un employé est requis");
            return;
        }

        // Créer le planning
        const schedule: Schedule = {
            id: generateId(),
            month,
            year,
            employees: validEmployees,
            entries: [] // Planning vierge = aucune entrée
        };

        // Stocker temporairement dans localStorage (on fera le store plus tard)
        localStorage.setItem('currentSchedule', JSON.stringify(schedule));
        localStorage.setItem(`schedule_${schedule.id}`, JSON.stringify(schedule));

        // Rediriger vers la page d'édition
        navigate(`/edit/${schedule.id}`);
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col p-4 sm:p-6 lg:p-12 font-['Roboto',sans-serif]">
            {/* Sélecteur de langue */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                <div
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                    <Globe className="h-5 w-5 text-gray-600" aria-hidden="true"/>
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

            {/* En-tête */}
            <header className="relative text-center py-8 sm:py-12 lg:py-16">
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div
                        className="w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
                    <div className="p-3 sm:p-4 bg-blue-600 rounded-2xl shadow-lg">
                        <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-white" aria-hidden="true"/>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                        {t("createBlank.title") || "Créer un Planning Vierge"}
                    </h1>
                </div>
            </header>

            {/* Formulaire principal */}
            <main className="flex-grow w-full max-w-4xl mx-auto my-8">
                <Card className="shadow-xl rounded-2xl bg-white border border-gray-200">
                    <CardContent className="p-6 sm:p-8">
                        {/* Sélection Mois et Année */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            {/* Sélecteur de mois */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t("createBlank.month") || "Mois"}
                                </label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {months.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sélecteur d'année */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t("createBlank.year") || "Année"}
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={decrementYear}
                                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                        aria-label="Diminuer l'année"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-600"/>
                                    </button>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => {
                                            const newYear = parseInt(e.target.value);
                                            if (!isNaN(newYear) && newYear >= 2020 && newYear <= 2100) {
                                                setYear(newYear);
                                            }
                                        }}
                                        min="2020"
                                        max="2100"
                                        className="flex-1 h-10 px-3 py-2 text-center rounded-md border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={incrementYear}
                                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                        aria-label="Augmenter l'année"
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-600"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section Employés */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                {t("createBlank.employees") || "Employés"}
                            </label>
                            <div className="space-y-3">
                                {employees.map((employee, index) => (
                                    <div key={employee.id} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={employee.name}
                                            onChange={(e) => updateEmployeeName(employee.id, e.target.value)}
                                            placeholder={t("createBlank.employeePlaceholder", {index: index + 1}) || `Nom de l'employé ${index + 1}`}
                                            className="flex-1 h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {employees.length > 1 && (
                                            <button
                                                onClick={() => removeEmployee(employee.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                aria-label={t("createBlank.removeEmployee") || "Supprimer l'employé"}
                                            >
                                                <Trash2 className="h-5 w-5"/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={addEmployee}
                                variant="outline"
                                className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4"/>
                                <span>{t("createBlank.addEmployee") || "+ Ajouter un employé"}</span>
                            </Button>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <Button
                                onClick={handleGenerate}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                {t("createBlank.generate") || "Générer le Planning Vierge"}
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1 sm:flex-none"
                            >
                                <Link to="/">
                                    {t("createBlank.back") || "Retour aux options"}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default CreateBlankSchedule;

