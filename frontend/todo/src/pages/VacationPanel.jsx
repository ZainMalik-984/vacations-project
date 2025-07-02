import { useEffect, useState } from 'react';
import api from '../utils/axios';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function VacationPanel() {
  const [vacations, setVacations] = useState([]);
  const [vacationForm, setVacationForm] = useState({ start_date: '', end_date: '', reason: '' });

  const [editingVacationId, setEditingVacationId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const vacationRes = await Promise.all([
        api.get('/vacations/')
      ]);
      setVacations(vacationRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Vacation handlers
  const handleVacationChange = (e) =>
    setVacationForm({ ...vacationForm, [e.target.name]: e.target.value });

  const handleVacationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVacationId) {
        await api.put(`/vacations/${editingVacationId}/`, vacationForm);
      } else {
        await api.post('/vacations/', vacationForm);
      }
      setVacationForm({ start_date: '', end_date: '', reason: '' });
      setEditingVacationId(null);
      fetchData();
    } catch (err) {
      alert('Vacation save failed');
    }
  };

  const handleVacationDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vacation?')) return;
    try {
      await api.delete(`/vacations/${id}/`);
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleVacationEdit = (vac) => {
    setVacationForm({
      start_date: vac.start_date,
      end_date: vac.end_date,
      reason: vac.reason,
    });
    setEditingVacationId(vac.id);
  };

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
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-2">
          {editingVacationId ? 'Edit Vacation' : 'Create Vacation'}
        </h3>
        <form onSubmit={handleVacationSubmit} className="space-y-2 mb-4">
          <input
            name="start_date"
            type="date"
            value={vacationForm.start_date}
            onChange={handleVacationChange}
            className="w-full border p-2"
          />
          <input
            name="end_date"
            type="date"
            value={vacationForm.end_date}
            onChange={handleVacationChange}
            className="w-full border p-2"
          />
          <textarea
            name="reason"
            value={vacationForm.reason}
            onChange={handleVacationChange}
            placeholder="Reason"
            className="w-full border p-2"
          />
          <button className="bg-green-600 text-white px-4 py-2" type="submit">
            {editingVacationId ? 'Update Vacation' : 'Create Vacation'}
          </button>
        </form>

        <div className="space-y-3">
          {vacations?.map((vac) => (
            <div key={vac.id} className="border p-3 rounded">
              <h3 className="text-lg font-bold">
                {vac.start_date} to {vac.end_date}
              </h3>
              <p>{vac.reason}</p>
              <div className="mt-2 flex gap-4">
                <button onClick={() => handleVacationEdit(vac)} className="text-blue-500">
                  Edit
                </button>
                <button
                  onClick={() => handleVacationDelete(vac.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VacationPanel;
