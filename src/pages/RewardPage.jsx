import {
    useNavigate
} from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import RewardReveal from '../components/common/RewardReveal.jsx';

import {
    routes
} from '../data/routes.js';

import {
    gps_test_config,
    test_stations
} from '../data/gps_test.js';

import {
    get_test_stamps
} from '../services/gps_test_storage.js';

import {
    get_data_mode
} from '../services/data_mode.js';

export default function RewardPage() {
    const navigate = useNavigate();

    const eligible = (
        gps_test_config.enabled &&
        get_test_stamps().length === test_stations.length
    );

    return (
        <Screen class_name="reward_screen">
            <RewardReveal
                data_mode={get_data_mode()}
                eligible={eligible}
                on_home={() => {
                    navigate(routes.home);
                }}
            />
        </Screen>
    );
}