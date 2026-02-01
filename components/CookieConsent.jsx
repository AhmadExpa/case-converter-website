import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/i18n';

export default function CookieConsent() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === null) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 w-[90%] max-w-[360px] md:max-w-[400px] animate-fade-in-up">
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-slate-800">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('common.cookie.title')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                            {t('common.cookie.message')}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleAccept}
                            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                        >
                            {t('common.cookie.accept')}
                        </button>
                        <button
                            onClick={handleDecline}
                            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            {t('common.cookie.decline')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
