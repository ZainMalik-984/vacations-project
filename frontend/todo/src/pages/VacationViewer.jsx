import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

function VacationViewer() {
  const [vacations, setVacations] = useState([]);
  const [classes, setClasses] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vacRes, classRes] = await Promise.all([
          api.get('/vacations/'),
          api.get('/classes/')
        ]);
        setVacations(vacRes.data);
        setClasses(classRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

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
    <div className="p-4 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vacation & Class Viewer</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Vacations</h2>
        {vacations.length === 0 ? (
          <p>No vacations available.</p>
        ) : (
          vacations.map((vac) => (
            <div key={vac.id} className="border p-4 rounded shadow mb-2">
              <h3 className="text-lg font-semibold">{vac.reason}</h3>
              <div>start date: {vac.start_date} | end date {vac.end_date}</div>
              <p>{vac.description}</p>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Classes</h2>
        {classes.length === 0 ? (
          <p>No classes available.</p>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} className="border p-4 rounded shadow mb-2">
              <h3 className="text-lg font-semibold">{cls.title}</h3>
              <p>{cls.description}</p>
              <p className={`mt-2 ${cls.is_suspended ? 'text-red-500' : 'text-green-600'}`}>
                {cls.is_suspended ? 'Suspended due to vacation' : 'Active'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VacationViewer;
