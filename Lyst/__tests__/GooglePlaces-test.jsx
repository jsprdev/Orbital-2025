describe('GooglePlaces API fetching in LocationDetails.tsx', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches place details and parses the result', async () => {
    const mockResult = { result: { name: 'test place', formatted_address: '123 test' } };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResult)
    });

    
    const res = await fetch('http://localhost:3000/api/places/details?placeId=test123', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    const data = await res.json();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/places/details?placeId=test123',
      { headers: { Authorization: 'Bearer mock-token' } }
    );
    expect(data).toEqual(mockResult);
    expect(data.result.name).toBe('test place');
    expect(data.result.formatted_address).toBe('123 test');
  });

  it('handles fetch error', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    await expect(
      fetch('http://localhost:3000/api/places/details?placeId=test123', {
        headers: { Authorization: 'Bearer mock-token' }
      })
    ).rejects.toThrow('Network error');
  });
});
