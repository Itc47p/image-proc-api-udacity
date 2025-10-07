import request from 'supertest';
import { app } from '../src/index.js';
const RESIZE_ENDPOINT = '/api/action/resize';
describe('get.api/action/resize', () => {
    it('should return 400 for a missing query params', async () => {
        const response = await request(app).get(RESIZE_ENDPOINT);
        expect(response.status).toBe(400);
    });
    it('should return false for an invalid condition', async () => {
        expect(false).toBe(false);
    });
});
//# sourceMappingURL=index.spec.js.map