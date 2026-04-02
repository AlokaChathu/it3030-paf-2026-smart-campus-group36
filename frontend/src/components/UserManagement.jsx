import { useState, useEffect } from 'react';
import { Users, Shield, Trash2, Mail, ShieldAlert } from 'lucide-react';
import api from '../api/axios';

const UserManagement = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch all users from your Spring Boot backend
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            // Call the PATCH endpoint we built in Postman earlier!
            const response = await api.patch(`/users/${userId}/role?newRole=${newRole}`);
            // Update the UI instantly
            setUsers(users.map(u => u.id === userId ? response.data : u));
        } catch (error) {
            console.error("Error changing role:", error);
            alert("Failed to update user role.");
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        // Safety check so you don't accidentally delete yourself!
        if (userId === currentUser.id) {
            alert("You cannot delete your own admin account.");
            return;
        }

        if (!window.confirm(`Are you sure you want to permanently remove ${userName} from the system?`)) return;

        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    // Security check: Only Admins should render this component
    if (currentUser?.role !== 'ADMIN') {
        return (
            <div className="bg-red-50 text-red-700 p-8 rounded-xl mt-6 flex flex-col items-center border border-red-200">
                <ShieldAlert className="w-12 h-12 mb-4" />
                <h2 className="text-xl font-bold">Access Denied</h2>
                <p>You do not have administrative privileges to view user management.</p>
            </div>
        );
    }

    if (loading) return <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">User Details</th>
                            <th className="p-4 font-medium">Role Level</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                            <div className="flex items-center text-gray-500 text-sm gap-1 mt-0.5">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className={`w-4 h-4 ${user.role === 'ADMIN' ? 'text-purple-500' : 'text-gray-400'}`} />
                                        {/* Dropdown to change roles on the fly */}
                                        <select 
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={user.id === currentUser.id} // Prevent changing own role
                                            className="bg-transparent border border-gray-200 rounded-md px-2 py-1 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer disabled:opacity-50"
                                        >
                                            <option value="USER">Standard User</option>
                                            <option value="TECHNICIAN">Technician</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="ADMIN">Super Admin</option>
                                        </select>
                                    </div>
                                </td>

                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                        disabled={user.id === currentUser.id}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 inline-flex items-center gap-1 text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;