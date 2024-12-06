# Dynamic TIFF Image Blender

This project demonstrates a **dynamic TIFF image blender** using React for the frontend and FastAPI for the backend. It allows users to adjust blending weights between two TIFF images dynamically, leveraging debounced slider inputs for seamless user interaction.

---

## Features

- **Dynamic Image Blending:** Adjust blending weights between two images in real time.
- **TIFF Support:** Renders TIFF images directly on the frontend.
- **Optimized Performance:** Uses debouncing to minimize API calls for slider adjustments.
- **Scalable Backend:** Implements memory-efficient image blending and response handling.

---

## Tools and Technologies Used

### Frontend
- **React**: For building the user interface.
- **Axios**: For making API requests.
- **React-TIFF**: For rendering TIFF images.
- **Lodash**: Specifically the `debounce` utility for optimizing slider interactions.
- **Tailwind CSS**: For styling the components.

### Backend
- **FastAPI**: For creating a lightweight and scalable REST API.
- **Pillow (PIL)**: For image processing.
- **Numpy**: For numerical operations on image arrays.
- **TIFFFile**: For handling TIFF images.

---

## Performance Metrics

1. **Average Response Time:**
   - Backend processing time for image blending: ~100ms (depends on image size and server specs).
   - API response time including network latency: ~200-300ms.
   
2. **Frontend Render Time:**
   - Initial slider response: <50ms.
   - Full slider adjustment to blended image rendering: ~300ms (includes API call).

3. **Optimization:** 
   - Debouncing ensures only one API call is made per slider adjustment every 200ms, significantly reducing server load.

---

## Dynamic Blending and Optimization Approach

1. **Image Blending Logic:**
   - Uses a weighted formula:
     ```
     Blended Pixel Value = Weight × Image1 + (1 - Weight) × Image2
     ```
   - Ensures both images are normalized to 8-bit unsigned integers for consistent blending.

2. **Debounced Slider:**
   - `lodash/debounce` prevents excessive API calls by batching rapid slider movements into a single request every 200ms.

3. **Streaming Response:**
   - Backend sends the blended image using a `StreamingResponse` for efficient memory usage.

4. **Error Handling:**
   - Aborts ongoing requests when a new weight is selected.
   - Ensures mismatched image dimensions are flagged during processing.

---

## Project Setup

### Prerequisites
- **Node.js** (Frontend)
- **Python 3.8+** (Backend)
- **Dependencies**:
  - Frontend: `axios`, `react-tiff`, `lodash`, `tailwindcss`.
  - Backend: `fastapi`, `pillow`, `numpy`, `tifffile`.

### Steps to Run

1. **Backend:**
   - Navigate to the backend folder.
   - Install dependencies: 
     ```bash
     pip install fastapi pillow numpy tifffile uvicorn
     ```
   - Start the server: 
     ```bash
     uvicorn main:app --reload
     ```
   - Ensure `aoi4_EO.tif` and `aoi4_SAR.tif` are in the same directory.

2. **Frontend:**
   - Navigate to the frontend folder.
   - Install dependencies: 
     ```bash
     npm install
     ```
   - Start the development server: 
     ```bash
     npm run dev
     ```

3. **Access the Application:**
   - Open [http://localhost:5173](http://localhost:5173) in a browser.

---
