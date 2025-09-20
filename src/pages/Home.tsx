import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Clock, Bolt, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col p-4 sm:p-6 lg:p-12 font-['Roboto',sans-serif]">
            {/* Sélecteur de langue */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                    <Globe className="h-5 w-5 text-gray-600" aria-hidden="true" />
                    <select
                        value={i18n.language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="bg-transparent text-gray-900 text-sm sm:text-base focus:ring-0 focus:outline-none"
                        aria-label={t("home.languageSelector")}
                    >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                    </select>
                </div>
            </div>

            {/* En-tête */}
            <header className="relative text-center py-12 sm:py-16 lg:py-24">
                {/* Décor de fond */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-56 h-56 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
                    <div className="p-3 sm:p-4 bg-blue-600 rounded-2xl shadow-lg">
                        <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-white" aria-hidden="true" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                        {t("home.headerTitle")}
                    </h1>
                </div>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-blue-700 mb-4 px-2 sm:px-4">
                    {t("home.headerTagline")}
                </p>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                    {t("home.headerText")}
                </p>
            </header>

            {/* Section étapes */}
            <main className="flex-grow w-full flex items-center justify-center my-8 sm:my-12 lg:my-16 px-2 sm:px-0">
                <div className="w-full max-w-6xl">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
                        {t("home.stepsTitle")}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Étape 1 */}
                        <Card className="shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                            <CardContent className="p-6 sm:p-8 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 mb-3 rounded-full bg-blue-600 text-white font-bold">
                                    1
                                </span>
                                <Download className="h-12 sm:h-14 w-12 sm:w-14 text-blue-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t("home.step1Title")}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{t("home.step1Text")}</p>
                            </CardContent>
                        </Card>

                        {/* Étape 2 */}
                        <Card className="shadow-lg rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100">
                            <CardContent className="p-6 sm:p-8 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 mb-3 rounded-full bg-green-600 text-white font-bold">
                                    2
                                </span>
                                <Clock className="h-12 sm:h-14 w-12 sm:w-14 text-green-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t("home.step2Title")}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{t("home.step2Text")}</p>
                            </CardContent>
                        </Card>

                        {/* Étape 3 */}
                        <Card className="shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                            <CardContent className="p-6 sm:p-8 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 mb-3 rounded-full bg-purple-600 text-white font-bold">
                                    3
                                </span>
                                <Bolt className="h-12 sm:h-14 w-12 sm:w-14 text-purple-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t("home.step3Title")}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{t("home.step3Text")}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Appel à l'action (footer) */}
            <footer className="text-center py-8 sm:py-12 lg:py-16 px-2 sm:px-0">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6">{t("home.ctaSubtitle")}</p>
                <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg md:text-xl font-semibold px-4 sm:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <Link
                        to="/import"
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3"
                        aria-label={t("home.cta")}
                    >
                        <Download className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                        <span>{t("home.cta")}</span>
                    </Link>
                </Button>
            </footer>
        </div>
    );
};

export default Home;
