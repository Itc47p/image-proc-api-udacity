import request from 'supertest';
import app from '../src/index.js';
const RESIZE_ENDPOINT = '/api/action/resize';
describe('get.api/action/resize', () => {
    it('should return 400 for a missing query params', async () => {
        const response = await request(app).get(RESIZE_ENDPOINT);
        expect(response.status).toBe(400);
        expect(response.text).toBe('Missing required query parameters: fileName, width, height');
    });
    it('should return 404 for a non-existent file', async () => {
        const response = await request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'nonexistent.jpg', width: 200, height: 200 });
        expect(response.status).toBe(404);
        expect(response.text).toBe('File not found');
    });
    it('should return 400 for invalid width/height', async () => {
        const response = await request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'truck.jpg', width: 'abc', height: 200 });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Missing required query parameters: fileName, width, height');
    });
    it('should return 200 and send resized image for valid params', async () => {
        const response = await request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'doberman.jpg', width: 200, height: 200 });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/image/);
    });
    it('should console info on success', async () => {
        const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
        const response = await request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'mclaren.jpg', width: 200, height: 200 });
        expect(response.status).toBe(200);
        expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('Image resized successfully. Can be found here:'));
        consoleInfoSpy.mockRestore();
    });
});
describe('get.api/placeholder', () => {
    it('should return a placeholder image with default dimensions and color', async () => {
        const response = await request(app).get('/api/placeholder');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/image\/png/);
    });
    it('should return a placeholder image with specified dimensions and color', async () => {
        const response = await request(app)
            .get('/api/placeholder')
            .query({ width: 400, height: 400, color: 'blue' });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/image\/png/);
    });
    it('should return a placeholder image with default color if an invalid color is provided', async () => {
        const response = await request(app)
            .get('/api/placeholder')
            .query({ width: 400, height: 400, color: 'INVALIDCOLOR' });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/image\/png/);
    });
    it('should return a placeholder image with default dimensions if dimensions are not provided', async () => {
        const response = await request(app)
            .get('/api/placeholder')
            .query({ color: 'red' });
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/image\/png/);
    });
});
//# sourceMappingURL=index.test.js.map
//# sourceMappingURL=index.spec.js.map