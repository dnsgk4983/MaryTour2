import {
    useNavigate
} from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import JourneyEnding from '../components/common/JourneyEnding.jsx';

import {
    routes
} from '../data/routes.js';

import {
    get_data_mode
} from '../services/data_mode.js';

export default function EndingPreviewPage() {
    const navigate = useNavigate();

    function go_home() {
        navigate(routes.home, {
            replace: true
        });
    }

    return (
        <Screen class_name="ending_screen">
            <JourneyEnding
                data_mode={get_data_mode()}
                preview={true}
                on_home={go_home}
            />
        </Screen>
    );
}