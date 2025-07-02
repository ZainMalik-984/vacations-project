import { useEffect, useState } from 'react';
import api from '../utils/axios';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ClassesPanel() {
  const [classes, setClasses] = useState([]);
  const [classForm, setClassForm] = useState({ title: '', date: '' });
  const [editingClassId, setEditingClassId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const classRes= await Promise.all([
        api.get('/classes/')
      ]);
      setClasses(classRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Class handlers
  const handleClassChange = (e) =>
    setClassForm({ ...classForm, [e.target.name]: e.target.value });

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClassId) {
        await api.put(`/classes/${editingClassId}/`, classForm);
      } else {
        await api.post('/classes/', classForm);
      }
      setClassForm({ title: '', date: '' });
      setEditingClassId(null);
      fetchData();
    } catch (err) {
      alert('Class save failed');
    }
  };

  const handleClassEdit = (cls) => {
    setClassForm({
      title: cls.title,
      date: cls.date,
    });
    setEditingClassId(cls.id);
  };

  const handleClassDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await api.delete(`/classes/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete class');
    }
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
          {editingClassId ? 'Edit Class Session' : 'Create Class Session'}
        </h3>
        <form onSubmit={handleClassSubmit} className="space-y-2 mb-4">
          <input
            name="title"
            value={classForm.title}
            onChange={handleClassChange}
            placeholder="Class Title"
            className="w-full border p-2"
          />
          <input
            type="date"
            name="date"
            value={classForm.date}
            onChange={handleClassChange}
            className="w-full border p-2"
          />
          <button className="bg-blue-600 text-white px-4 py-2" type="submit">
            {editingClassId ? 'Update Class' : 'Create Class'}
          </button>
        </form>

        <div className="space-y-3">
          {classes?.map((cls) => (
            <div key={cls.id} className="border p-3 rounded">
              <h3 className="text-lg font-bold">{cls.title}</h3>
              <p>Date: {cls.date}</p>
              <p
                className={`mt-2 ${
                  cls.is_suspended ? 'text-red-500' : 'text-green-600'
                }`}
              >
                {cls.is_suspended ? 'Suspended due to vacation' : 'Active'}
              </p>
              <div className="mt-2 flex gap-4">
                <button onClick={() => handleClassEdit(cls)} className="text-blue-500">
                  Edit
                </button>
                <button
                  onClick={() => handleClassDelete(cls.id)}
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

export default ClassesPanel;
