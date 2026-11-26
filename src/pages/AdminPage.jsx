import {
    useNavigate,
    useSearchParams
} from 'react-router-dom';

import AdminLogin from '../components/common/AdminLogin.jsx';

import {
    routes
} from '../data/routes.js';

export default function AdminPage() {
    const navigate = useNavigate();

    const [params] = useSearchParams();

    const preview = (
        import.meta.env.DEV &&
        params.get('preview') === 'login'
    );

    function go_back() {
        navigate(routes.home, {
            replace: true
        });
    }

    return (
        <AdminLogin
            preview={preview}
            on_back={go_back}
        />
    );
}