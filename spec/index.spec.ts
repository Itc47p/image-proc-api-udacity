import request from 'supertest';
import app from '../src/index.js';
import { ensureDirectoryExists, resizeImage } from '../src/utils.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

describe('Utils', () => {
    const testDir = path.join(__dirname, 'test_output');
    const inputImagePath = path.join(__dirname, 'test_assets', 'test_image.jpg');
    const outputImagePath = path.join(testDir, 'resized_image.jpg');

    beforeAll(() => {
        // Ensure test directory exists
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    });

    afterAll(() => {
        // Clean up test directory
        if (fs.existsSync(outputImagePath)) {
            fs.unlinkSync(outputImagePath);
        }
        if (fs.existsSync(testDir)) {
            fs.rmdirSync(testDir, { recursive: true });
        }
    });

    describe('resizeImage', () => {
        it('should resize an image to the specified dimensions', async () => {
            const width = 200;
            const height = 200;

            await resizeImage(inputImagePath, outputImagePath, width, height);

            expect(fs.existsSync(outputImagePath)).toBe(true);

            const metadata = await sharp(outputImagePath).metadata();
            expect(metadata.width).toBe(width);
            expect(metadata.height).toBe(height);
        });

        it('should throw an error if the input file does not exist', async () => {
            const invalidInputPath = path.join(__dirname, 'nonexistent.jpg');

            await expect(resizeImage(invalidInputPath, outputImagePath, 200, 200)).rejects.toThrow();
        });
    });

    describe('ensureDirectoryExists', () => {
        it('should create a directory if it does not exist', () => {
            const newDirPath = path.join(testDir, 'new_directory');

            ensureDirectoryExists(newDirPath);

            expect(fs.existsSync(newDirPath)).toBe(true);

            // Clean up
            fs.rmdirSync(newDirPath);
        });

        it('should not throw an error if the directory already exists', () => {
            expect(() => ensureDirectoryExists(testDir)).not.toThrow();
        });
    });
});
