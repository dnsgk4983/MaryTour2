import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import AdminLogin from '../components/common/AdminLogin.jsx';
import AdminRewardPreviewPage from './AdminRewardPreviewPage.jsx';

import {
    routes
} from '../data/routes.js';

export default function AdminLoginPreviewPage() {
    const navigate = useNavigate();

    const [preview_verified, set_preview_verified] = useState(false);

    function go_back() {
        navigate(routes.home, {
            replace: true
        });
    }

    function handle_preview_success(response) {
        if (
            import.meta.env.DEV &&
            response.success &&
            response.preview &&
            response.code === 'PREVIEW_SUCCESS'
        ) {
            set_preview_verified(true);
        }
    }

    if (
        import.meta.env.DEV &&
        preview_verified
    ) {
        return (
            <AdminRewardPreviewPage
                preview_verified={preview_verified}
                on_logout={() => {
                    set_preview_verified(false);
                }}
            />
        );
    }

    return (
        <AdminLogin
            preview={import.meta.env.DEV}
            on_back={go_back}
            on_preview_success={handle_preview_success}
        />
    );
}