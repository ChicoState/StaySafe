import request from "supertest";
import app from "../index.js";

describe("App Tests", () => {
  it("GET / should return a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello, StaySafe backend!");
  });
});
