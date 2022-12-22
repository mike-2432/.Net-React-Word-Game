import { Outlet, Navigate} from 'react-router-dom';
import { useGlobalContext } from './Context';

const PrivateRoute = () => {
    const { jwt } = useGlobalContext();
    // The jwt token is checked in Context.tsx
    // If the token is incorrect, the token is removed automatically
    return (
        jwt ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoute