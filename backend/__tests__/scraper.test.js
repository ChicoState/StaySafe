import { jest } from '@jest/globals';
import * as scraper from "../scraper.js";

jest.unstable_mockModule("axios", () => ({
  default: jest.fn(),
}));

const { default: axios } = await import("axios");

describe("Scraper Tests", () => {
  it("should fetch and return scraped data", async () => {
    const mockData = [{ name: "John Doe", crime: "Burglary" }];
    axios.mockResolvedValue({ data: mockData });

    const data = await scraper.getData();
    expect(data).toEqual(mockData);
  });
});
