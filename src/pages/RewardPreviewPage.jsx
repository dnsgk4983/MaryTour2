import {
    useNavigate
} from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import RewardReveal from '../components/common/RewardReveal.jsx';

import {
    routes
} from '../data/routes.js';

import {
    get_data_mode
} from '../services/data_mode.js';

export default function RewardPreviewPage() {
    const navigate = useNavigate();

    return (
        <Screen class_name="reward_screen">
            <RewardReveal
                data_mode={get_data_mode()}
                preview={true}
                eligible={true}
                on_home={() => {
                    navigate(routes.home);
                }}
            />
        </Screen>
    );
}