import { getProductsList } from '../getProductsList';
import products from '../constants/products';
import headers from '../constants/headers';

describe('getProductsList', () => {
  test('returns a list of products', async () => {
    const expectedResponse = {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
    const response = await getProductsList();
    expect(response).toEqual(expectedResponse);
  });
});
