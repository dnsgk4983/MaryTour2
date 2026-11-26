import {
    useNavigate,
    useSearchParams
} from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import ButtonDiscovery from '../components/common/ButtonDiscovery.jsx';

import {
    test_stations
} from '../data/gps_test.js';

import {
    routes
} from '../data/routes.js';

import {
    get_data_mode
} from '../services/data_mode.js';

export default function DiscoveryPreviewPage() {
    const navigate = useNavigate();

    const [params] = useSearchParams();

    const requested_slot = Number(
        params.get('slot') || 0
    );

    const station = test_stations.find(
        (item) => item.slot === requested_slot
    ) || test_stations[0];

    return (
        <Screen class_name="discovery_preview">
            <ButtonDiscovery
                key={station.slot}
                reward={station}
                collected_count={station.slot + 1}
                total_count={test_stations.length}
                data_mode={get_data_mode()}
                preview={true}
                on_complete={() => {
                    navigate(routes.scanner);
                }}
            />
        </Screen>
    );
}