import AdminLoginPreviewPage from './AdminLoginPreviewPage.jsx';
import {
    useSearchParams
} from 'react-router-dom';

import {
    gps_test_config
} from '../data/gps_test.js';

import GpsTestPage from './GpsTestPage.jsx';
import QrCameraPage from './QrCameraPage.jsx';
import DiscoveryPreviewPage from './DiscoveryPreviewPage.jsx';
import JourneyCompletePreviewPage from './JourneyCompletePreviewPage.jsx';
import RewardPreviewPage from './RewardPreviewPage.jsx';
import EndingPreviewPage from './EndingPreviewPage.jsx';

export default function QrScannerPage() {
    const [params] = useSearchParams();

    const preview = params.get('preview');

    if (import.meta.env.DEV) {
        if (preview === 'admin_login') {
            return <AdminLoginPreviewPage />;
        }

        if (preview === 'discovery') {
            return <DiscoveryPreviewPage />;
        }

        if (preview === 'complete') {
            return <JourneyCompletePreviewPage />;
        }

        if (preview === 'reward') {
            return <RewardPreviewPage />;
        }

        if (preview === 'ending') {
            return <EndingPreviewPage />;
        }
    }

    return gps_test_config.enabled
        ? <GpsTestPage />
        : <QrCameraPage />;
}