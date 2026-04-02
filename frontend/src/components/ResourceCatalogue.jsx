import { useState, useEffect } from 'react';
import { Building2, Users, MapPin, Activity, Trash2, Wrench, PlusCircle, Pencil } from 'lucide-react';
import api from '../api/axios';

const ResourceCatalogue = ({ currentUser, onAddClick, onEditClick }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await api.get('/resources');
            setResources(response.data);
        } catch (err) {
            console.error("Error fetching resources:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this resource?")) return;
        try {
            await api.delete(`/resources/${id}`);
            setResources(resources.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
        try {
            const response = await api.patch(`/resources/${id}/status?status=${newStatus}`);
            setResources(resources.map(r => r.id === id ? response.data : r));
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    if (loading) return <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    if (resources.length === 0) return (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100 mt-6">
            <Building2 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No resources found</h3>
            {currentUser?.role === 'ADMIN' && (
                <button onClick={onAddClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 inline-flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" /> Add First Resource
                </button>
            )}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{resource.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                resource.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {resource.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600"><Activity className="h-4 w-4 mr-3 text-blue-500" /> <span className="text-sm font-medium">{resource.type.replace('_', ' ')}</span></div>
                            <div className="flex items-center text-gray-600"><Users className="h-4 w-4 mr-3 text-blue-500" /> <span className="text-sm">Capacity: {resource.capacity}</span></div>
                            <div className="flex items-center text-gray-600"><MapPin className="h-4 w-4 mr-3 text-blue-500" /> <span className="text-sm">{resource.location}</span></div>
                        </div>
                    </div>

                    {/* ONLY ADMINS SEE THESE CONTROLS */}
                    {currentUser?.role === 'ADMIN' && (
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end gap-2">
                            {/* THE NEW EDIT BUTTON */}
                            <button onClick={() => onEditClick(resource)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                                <Pencil className="w-4 h-4" /> Edit
                            </button>

                            <button onClick={() => handleToggleStatus(resource.id, resource.status)} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                                <Wrench className="w-4 h-4" /> {resource.status === 'ACTIVE' ? 'Mark Broken' : 'Mark Fixed'}
                            </button>
                            
                            <button onClick={() => handleDelete(resource.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResourceCatalogue;