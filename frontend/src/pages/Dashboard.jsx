import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, LogOut, Users as UsersIcon } from 'lucide-react';
import api from '../api/axios';

// Import our clean components
import ResourceCatalogue from '../components/ResourceCatalogue';
import AddResourceForm from '../components/AddResourceForm';
import EditResourceForm from '../components/EditResourceForm';
import UserManagement from '../components/UserManagement';

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); 
    const [activeTab, setActiveTab] = useState('catalogue'); 
    const [editingResource, setEditingResource] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setCurrentUser(response.data);
            } catch (err) {
                if (err.response?.status === 401) handleLogout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Dynamic header logic based on the active tab
    const getHeaderDetails = () => {
        if (activeTab === 'add') return { title: 'Add New Resource', desc: 'Register a new facility into the database.' };
        if (activeTab === 'edit') return { title: 'Edit Resource', desc: 'Update the properties of an existing facility.' };
        if (activeTab === 'users') return { title: 'User Management', desc: 'Manage system access, roles, and accounts.' }; 
        return { title: 'Facilities & Equipment', desc: 'Manage and monitor all university assets in real-time.' };
    };
    const header = getHeaderDetails();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-xl z-10">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-xl font-bold tracking-wide">
                        <LayoutDashboard className="text-blue-500" /> SmartCampus
                    </div>
                    <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
                        <p className="text-xs text-blue-400 font-bold mt-1 uppercase tracking-wider">{currentUser?.role}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 mt-2 space-y-2">
                    <button onClick={() => { setActiveTab('catalogue'); setEditingResource(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'catalogue' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                        <List className="w-5 h-5" /> Resource Catalogue
                    </button>
                    
                    {currentUser?.role === 'ADMIN' && (
                        <>
                            <button onClick={() => { setActiveTab('add'); setEditingResource(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'add' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                                <PlusCircle className="w-5 h-5" /> Add Resource
                            </button>
                            
                            <button onClick={() => { setActiveTab('users'); setEditingResource(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                                <UsersIcon className="w-5 h-5" /> Manage Users
                            </button>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm font-medium transition-colors">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{header.title}</h1>
                            <p className="text-gray-500 mt-2">{header.desc}</p>
                        </div>
                    </header>
                    
                    {/* View Router */}
                    {activeTab === 'catalogue' && (
                        <ResourceCatalogue 
                            currentUser={currentUser} 
                            onAddClick={() => setActiveTab('add')} 
                            onEditClick={(resource) => {
                                setEditingResource(resource);
                                setActiveTab('edit');
                            }}
                        />
                    )}
                    
                    {activeTab === 'add' && (
                        <AddResourceForm 
                            currentUser={currentUser} 
                            onSuccess={() => setActiveTab('catalogue')} 
                            onCancel={() => setActiveTab('catalogue')}
                        />
                    )}

                    {activeTab === 'edit' && editingResource && (
                        <EditResourceForm 
                            currentUser={currentUser} 
                            resource={editingResource}
                            onSuccess={() => {
                                setEditingResource(null);
                                setActiveTab('catalogue');
                            }} 
                            onCancel={() => {
                                setEditingResource(null);
                                setActiveTab('catalogue');
                            }}
                        />
                    )}

                    {/* NEW: Render User Management when the tab is active */}
                    {activeTab === 'users' && (
                        <UserManagement currentUser={currentUser} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;