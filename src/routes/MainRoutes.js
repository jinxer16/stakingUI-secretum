import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';


// sample page routing
const MainPage = Loadable(lazy(() => import('views/main-page')));
const AdminPage = Loadable(lazy(() => import('views/admin-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <MinimalLayout />
    ),
    children: [
        {
            path: '/',
            element: <MainPage />
        },
        {
            path: '/main',
            element: <MainPage />
        },
        {
            path: '/admin',
            element: <AdminPage />
        }
    ]
};

export default MainRoutes;
