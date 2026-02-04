import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../useContext/context';
import Loader from '../components/ui/Loader';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <Loader fullPage label="Securing workspace..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
