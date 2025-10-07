import { request } from "express";
import app from "../src/index.js";

describe('get.api/action/resize', () => {
    it('should return 400 for a missing query params', () => {
        const respone = await request(app).get('/api/action/resize');
        expect(respone.status).toBe(400);
    });
    
    it('should return false for an invalid condition', () => {
        expect(false).toBe(false);
    });
});