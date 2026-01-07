
import { test, expect } from '@playwright/test';

test('GraphQL - GetCountry(IN) query returns expected fields', async ({ request }) => {
  const query = `
    query GetCountry {
      country(code: "IN") {
        name
        native
        capital
        emoji
        currency
        languages {
          code
          name
        }
      }
    }
  `;
  const response = await request.post(
    'https://countries.trevorblades.com/graphql',
    {
      data: { query }
    }
  );
  
  const json = await response.json();
  console.log("GRAPHQL RESPONSE:", JSON.stringify(json, null, 2));
  

  // Validate basic structure
  expect(json.data).toBeDefined();
  expect(json.data.country).toBeDefined();

  const country = json.data.country;

  // Validate returned values
  expect(country.name).toBe('India');
  expect(country.native).toBe('भारत');
  expect(country.capital).toBe('New Delhi');
  expect(country.emoji).toBe('🇮🇳');
  expect(country.currency).toContain('INR');

  // Validate languages array
  expect(Array.isArray(country.languages)).toBe(true);
  expect(country.languages.length).toBeGreaterThan(0);

  const hindi = country.languages.find(lang => lang.code === 'hi');
  expect(hindi).toBeDefined();
  expect(hindi.name).toBe('Hindi');
});
