import request from 'supertest';
import app from '../src/index.js';
const RESIZE_ENDPOINT = '/api/action/resize';
describe('get.api/action/resize', () => {
    it('should return 400 for a missing query params', (done) => {
        request(app)
            .get(RESIZE_ENDPOINT)
            .end((err, response) => {
            expect(response.status).toBe(400);
            expect(response.text).toBe('Missing required query parameters: fileName, width, height');
            done();
        });
    });
    it('should return 404 for a non-existent file', (done) => {
        request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'nonexistent.jpg', width: 200, height: 200 })
            .end((err, response) => {
            expect(response.status).toBe(404);
            expect(response.text).toBe('File not found');
            done();
        });
    });
    it('should return 400 for invalid width/height', (done) => {
        request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'truck.jpg', width: 'abc', height: 200 })
            .end((err, response) => {
            expect(response.status).toBe(400);
            expect(response.text).toBe('Missing required query parameters: fileName, width, height');
            done();
        });
    });
    it('should return 200 and send resized image for valid params', (done) => {
        request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'doberman.jpg', width: 200, height: 200 })
            .end((err, response) => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image/);
            done();
        });
    });
    it('should console info on success', async (done) => {
        const consoleInfoSpy = spyOn(console, 'info').and.callFake(() => { });
        request(app)
            .get(RESIZE_ENDPOINT)
            .query({ fileName: 'mclaren.jpg', width: 200, height: 200 })
            .end((err, response) => {
            expect(response.status).toBe(200);
            expect(consoleInfoSpy).toHaveBeenCalledWith(jasmine.stringMatching('Image resized successfully. Can be found here:'));
            done();
        });
    });
});
describe('get.api/placeholder', () => {
    it('should return a placeholder image with default dimensions and color', (done) => {
        request(app).get('/api/placeholder').end((err, response) => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image\/png/);
            done();
        });
    });
    it('should return a placeholder image with specified dimensions and color', (done) => {
        request(app)
            .get('/api/placeholder')
            .query({ width: 400, height: 400, color: 'blue' })
            .end((err, response) => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image\/png/);
            done();
        });
    });
    it('should return a placeholder image with default color if an invalid color is provided', (done) => {
        request(app)
            .get('/api/placeholder')
            .query({ width: 400, height: 400, color: 'INVALIDCOLOR' })
            .end((err, response) => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image\/png/);
            done();
        });
    });
    it('should return a placeholder image with default dimensions if dimensions are not provided', (done) => {
        request(app)
            .get('/api/placeholder')
            .query({ color: 'red' })
            .end((err, response) => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/image\/png/);
            done();
        });
    });
});
//# sourceMappingURL=index.spec.js.map