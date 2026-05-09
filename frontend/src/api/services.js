import api from './axios';

export const ledgerApi = {
    getTransactions: () => api.get('/ledger'),
    addTransaction: (data) => api.post('/ledger', data),
    getAnalytics: () => api.get('/ledger/analytics'),
};

export const complaintApi = {
    getComplaints: () => api.get('/complaints'),
    createComplaint: (data) => api.post('/complaints', data),
    updateComplaint: (id, data) => api.patch(`/complaints/${id}`, data),
};

export const votingApi = {
    createPoll: (data) => api.post('/votes/create', data),
    castVote: (data) => api.post('/votes/cast', data),
    getResults: (id) => api.get(`/votes/results/${id}`),
};

export const vendorApi = {
    submitBid: (data) => api.post('/vendors/bids', data),
    getBids: () => api.get('/vendors/bids'),
};

export const uploadApi = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadDocument: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
