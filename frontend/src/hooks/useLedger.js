import { useState, useEffect } from 'react';
import { ledgerApi } from '../api/services';

export const useLedger = () => {
    const [transactions, setTransactions] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [transRes, analyticsRes] = await Promise.all([
                ledgerApi.getTransactions(),
                ledgerApi.getAnalytics()
            ]);
            setTransactions(transRes.data);
            setAnalytics(analyticsRes.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch ledger data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addTransaction = async (data) => {
        try {
            await ledgerApi.addTransaction(data);
            fetchData(); // Refresh data
            return true;
        } catch (err) {
            setError(err.message || 'Failed to add transaction');
            return false;
        }
    };

    return { transactions, analytics, loading, error, refresh: fetchData, addTransaction };
};
