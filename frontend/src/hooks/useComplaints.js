import { useState, useEffect } from 'react';
import { complaintApi } from '../api/services';

export const useComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const response = await complaintApi.getComplaints();
            setComplaints(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const createComplaint = async (data) => {
        try {
            await complaintApi.createComplaint(data);
            fetchComplaints();
            return true;
        } catch (err) {
            setError(err.message || 'Failed to create complaint');
            return false;
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await complaintApi.updateComplaint(id, { status });
            fetchComplaints();
            return true;
        } catch (err) {
            setError(err.message || 'Failed to update complaint status');
            return false;
        }
    };

    return { complaints, loading, error, refresh: fetchComplaints, createComplaint, updateStatus };
};
