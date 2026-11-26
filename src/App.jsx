import {
    HashRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from 'react-router-dom';

import Container from './components/layout/Container.jsx';
import AssetGate from './components/layout/AssetGate.jsx';

import SplashPage from './pages/SplashPage.jsx';
import HomePage from './pages/HomePage.jsx';
import QrScannerPage from './pages/QrScannerPage.jsx';
import QrCheckPage from './pages/QrCheckPage.jsx';
import RewardPage from './pages/RewardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

import { routes } from './data/routes.js';
import { get_data_mode } from './services/data_mode.js';

function RouteContent() {
    const location = useLocation();
    const data_mode = get_data_mode();

    const page_routes = [
        {
            path: routes.splash,
            group_name: 'splash',
            component: SplashPage
        },
        {
            path: routes.home,
            group_name: 'home',
            component: HomePage
        },
        {
            path: routes.scanner,
            group_name: 'scanner',
            component: QrScannerPage
        },
        {
            path: routes.check,
            group_name: 'check',
            component: QrCheckPage
        },
        {
            path: routes.reward,
            group_name: 'reward',
            component: RewardPage
        },
        {
            path: routes.admin,
            group_name: 'admin',
            component: AdminPage
        }
    ];

    return (
        <Routes location={location}>
            {page_routes.map((page_route) => {
                const Page = page_route.component;

                return (
                    <Route
                        key={page_route.path}
                        path={page_route.path}
                        element={
                            <AssetGate
                                key={`${location.pathname}:${data_mode}`}
                                group_name={page_route.group_name}
                                data_mode={data_mode}
                            >
                                <Page />
                            </AssetGate>
                        }
                    />
                );
            })}

            <Route
                path="*"
                element={
                    <Navigate
                        to={routes.splash}
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default function App() {
    return (
        <HashRouter>
            <Container>
                <RouteContent />
            </Container>
        </HashRouter>
    );
}