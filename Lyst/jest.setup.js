

jest.mock('@/FirebaseConfig', () => ({
  FIREBASE_AUTH: {
    currentUser: {
      uid: 'test-user-id',
      getIdToken: jest.fn().mockResolvedValue('test-token')
    }
  }
}));

const mockAxiosInstance = {
  get: jest.fn().mockResolvedValue({ data: { success: true } }),
  post: jest.fn().mockResolvedValue({ data: { success: true } }),
  delete: jest.fn().mockResolvedValue({ data: { success: true } }),
  patch: jest.fn().mockResolvedValue({ data: { success: true } })
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance)
}));


export { mockAxiosInstance }; 