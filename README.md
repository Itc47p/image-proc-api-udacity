# Harrington Image Processor API

A Node.js API for image processing using Express and Sharp.

## Endpoints

### 1. Resize Image

**GET** `/api/action/resize`

Resize an image to specified dimensions.

#### Query Parameters:
- `fileName` (string, required): The name of the image file located in the `images/` directory.
- `width` (number, required): The desired width of the resized image.
- `height` (number, required): The desired height of the resized image.

#### Example:

```http
GET http://localhost:3000/api/action/resize?fileName=truck.jpg&width=200&height=200
```

#### Responses:
- **200**: Returns the resized image.
- **400**: Missing or invalid query parameters.
- **404**: File not found.
- **500**: Error processing the image.

---

### 2. Placeholder Image

**GET** `/api/placeholder`

Generate a placeholder PNG image with customizable dimensions and background color.

#### Query Parameters:
- `width` (number, optional): The width of the placeholder image (default: 300).
- `height` (number, optional): The height of the placeholder image (default: 300).
- `color` (string, optional): The background color of the placeholder image (default: grey). Accepts color names or hex codes.

#### Example:

```http
GET http://localhost:3000/api/placeholder?width=400&height=400&color=blue
```

#### Responses:
- **200**: Returns the generated placeholder image.

---

## Running the API

1. Install dependencies:
    ```sh
    npm install
    ```
2. Start the server:
    ```sh
    npm start
    ```
3. Access the API at `http://localhost:3000`.

---

## Notes

- Place your source images in the `images/` directory.
- Resized images are saved in the `images/resized/` directory.
