import { useState } from 'react';
import { ShieldAlert, Save, X } from 'lucide-react';
import api from '../api/axios';

const EditResourceForm = ({ currentUser, resource, onSuccess, onCancel }) => {
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // Pre-fill the form with the existing resource data
    const [formData, setFormData] = useState({
        name: resource.name, 
        type: resource.type, 
        capacity: resource.capacity, 
        location: resource.location
    });

    if (currentUser?.role !== 'ADMIN') {
        return (
            <div className="bg-red-50 text-red-700 p-8 rounded-xl mt-6 flex flex-col items-center border border-red-200">
                <ShieldAlert className="w-12 h-12 mb-4" />
                <h2 className="text-xl font-bold">Access Denied</h2>
                <p>You do not have administrative privileges to view this page.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            // Send the PUT request to fully update the resource
            await api.put(`/resources/${resource.id}`, formData);
            onSuccess(); 
        } catch (error) {
            console.error("Error updating:", error);
            alert("Failed to update resource. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-6 max-w-2xl">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">Edit Facility Details</h2>
                <p className="text-sm text-gray-500 mt-1">Updating ID: {resource.id}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Name</label>
                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Computer/Science Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Portable Equipment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                        <input type="number" required min="1" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
                
                <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <X className="w-4 h-4" /> Cancel
                    </button>
                    <button type="submit" disabled={submitLoading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 transition-colors">
                        <Save className="w-4 h-4" /> {submitLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditResourceForm;