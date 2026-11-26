import {
    useNavigate
} from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import JourneyComplete from '../components/common/JourneyComplete.jsx';

import {
    routes
} from '../data/routes.js';

import {
    get_data_mode
} from '../services/data_mode.js';

export default function JourneyCompletePreviewPage() {
    const navigate = useNavigate();

    return (
        <Screen class_name="journey_complete_preview_screen">
            <JourneyComplete
                data_mode={get_data_mode()}
                preview={true}
                on_reward={() => {
                    navigate(
                        `${routes.scanner}?preview=reward`
                    );
                }}
                on_home={() => {
                    navigate(routes.home);
                }}
            />
        </Screen>
    );
}