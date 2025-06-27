import axios from 'axios';
import { getNotes, createNote } from '@/utils/api';

// Mock Firebase Authentication and Axios
jest.mock('@/FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        currentUser: { 
            getIdToken: jest.fn().mockResolvedValue('mock-token') 
        }
    }
}));

jest.mock('axios', () => {
    const temp = jest.requireActual('axios');
    return {
        ...temp,
        create: jest.fn(() => ({
            get: jest.fn(),
            post: jest.fn()
        })),
    };
});


// Testing
describe('API Calls', () => {
    const mockAxios = axios.create.mock.results[0].value;
    const token = 'mock-token'
    const firstTask = {
        createdAt: "2025-06-07T20:07:13.996Z",
        description: "Creamier",
        place: "418 Northshore Drive",
        priority: "high",
        tags: ["Cafe"],
        userId: 'user123'
        }
    

    // [GET] Fetch List Call
    it('getTasks', async () => {
        mockAxios.create = jest.fn(() => mockAxios);
        mockAxios.get.mockResolvedValue({
            data: { tasks: [firstTask] }
        });

        const notes = await getNotes(token);
        expect(mockAxios.get).toHaveBeenCalledWith('/api/notes', {
            headers: { Authorization: 'Bearer ' + token }
        });

        expect(notes).toEqual([firstTask]);
    });

    // [POST] Create Note 
    it('createNote', async () => {
        mockAxios.post.mockResolvedValue({
            data: { task : firstTask }
        });

        const noteData = firstTask;
        const notes = await createNote(noteData, token);

        expect(mockAxios.post).toHaveBeenCalledWith('/api/notes', noteData, {
            headers: { Authorization: 'Bearer ' + token }
        });

        expect(notes).toEqual(noteData);

    });
});