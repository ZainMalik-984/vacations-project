import { Link } from "react-router-dom";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';


function AdminPenal() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            await api.post('/logout/');
            dispatch(logout());
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6 px-4">
                <h1 className="text-4xl font-bold text-center flex-grow">Admin Panel</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-4 mt-4"
                >
                    Logout
                </button>
            </div>
            <div className="flex w-full justify-center ">
                <Link to='/admin-panel/vacation' className="p-4 border bg-amber-300 rounded-2xl m-4">Go TO Vacations Penal</Link>
                <Link to='/admin-panel/classes' className="p-4 border bg-amber-300 rounded-2xl m-4">Go TO Classes Penal</Link>
                <Link to='/admin-panel/user' className="p-4 border bg-amber-300 rounded-2xl m-4">Go TO User Penal</Link>
            </div>
        </>
    );
}

export default AdminPenal;
