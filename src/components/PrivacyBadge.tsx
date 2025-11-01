import { Shield, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Badge de confidentialité affiché en bas à droite
 * Indique que toutes les données sont traitées localement
 */
const PrivacyBadge = () => {
    const { t } = useTranslation();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 shadow-lg">
            <Shield className="h-4 w-4 text-green-600" aria-hidden="true" />
            <Lock className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span className="text-sm font-medium text-green-800">
                {t("privacy.badge") || "Données traitées localement"}
            </span>
        </div>
    );
};

export default PrivacyBadge;

