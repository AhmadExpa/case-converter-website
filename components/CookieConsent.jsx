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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-colors duration-200">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center md:text-left">
                    {t('common.cookie.message')}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition"
                    >
                        {t('common.cookie.decline')}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded transition"
                    >
                        {t('common.cookie.accept')}
                    </button>
                </div>
            </div>
        </div>
    );
}
