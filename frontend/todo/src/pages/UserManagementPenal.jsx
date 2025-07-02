import { useEffect, useState } from 'react';
import api from '../utils/axios';

function UserManagementPanel() {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
    is_active: true,
    password: '',
  });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/register');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm({
      ...userForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await api.put(`/register/${editingUserId}/`, userForm);
      } else {
        await api.post('/register/', userForm);
      }
      setUserForm({ email: '', first_name: '', last_name: '', role: 'student', is_active: true });
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to save user.');
    }
  };

  const handleEdit = (user) => {
    setUserForm({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      is_active: user.is_active,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/register/${id}/`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="email"
          type="email"
          value={userForm.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2"
        />
        <input
          name="first_name"
          type="text"
          value={userForm.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full border p-2"
        />
        <input
          name="last_name"
          type="text"
          value={userForm.last_name || ''}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full border p-2"
        />
        <input
          name="password"
          type="password"
          value={userForm.password || ''}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border p-2"
        />
        <select
          name="role"
          value={userForm.role}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            name="is_active"
            type="checkbox"
            checked={userForm.is_active}
            onChange={handleChange}
          />
          Active
        </label>
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">
          {editingUserId ? 'Update User' : 'Create User'}
        </button>
      </form>

      <div className="space-y-3">
        {users.map((user, index) => (
          <div  key={user.id || index}  className="border p-3 rounded">
            <h3 className="font-bold">{user.email}</h3>
            <p>{user.first_name} {user.last_name} - Role: {user.role}</p>
            <p>Status: {user.is_active ? 'Active' : 'Inactive'}</p>
            <div className="mt-2 flex gap-4">
              <button onClick={() => handleEdit(user)} className="text-blue-500">
                Edit
              </button>
              <button onClick={() => handleDelete(user.id)} className="text-red-500">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserManagementPanel;
