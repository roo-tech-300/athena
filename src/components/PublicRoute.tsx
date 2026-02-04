import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../useContext/context';
import Loader from '../components/ui/Loader';

const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <Loader fullPage label="Verifying session..." />;
    }

    if (isAuthenticated) {
        return <Navigate to="/portal" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
