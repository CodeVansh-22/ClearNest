import api from './axios';

export const uploadApi = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response; // Flask returns { success, message, data: { file_path } }
    },
    uploadDocument: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },
};
