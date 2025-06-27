import { generateDateRoute } from '@/utils/api';

jest.mock('../FirebaseConfig', () => ({
  initializeApp: jest.fn(),
  getAuth: jest.fn(),
}));

jest.mock('@/utils/api', () => ({
  ...jest.requireActual('@/utils/api'),
  generateDateRoute: jest.fn(),
}));

describe('generateDateRoute', () => {
  it('returns a date route', async () => {
    (generateDateRoute as jest.Mock).mockResolvedValue({
      selectedLocations: [
        { name: 'A', address: 'test A' },
        { name: 'B', address: 'test B' }
      ],
      visitOrder: [0, 1]
    });

    const cards = [
      { name: 'A', address: 'test A' },
      { name: 'B', address: 'test B' }
    ];
    const token = 'mock-token';
    const result = await generateDateRoute(cards, token);

    expect(generateDateRoute).toHaveBeenCalledWith(cards, token);
  });

  it('throws or returns error for missing cards', async () => {
    (generateDateRoute as jest.Mock).mockRejectedValue(new Error('Missing cards'));
    await expect(generateDateRoute([], 'mock-token')).rejects.toThrow('Missing cards');
  });
});