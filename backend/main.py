from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
from io import BytesIO
import tifffile
from fastapi.responses import StreamingResponse


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # setuped to allow from all origins.
    allow_credentials=True,
    allow_methods=["*"],  # setuped to allow all http methods
    allow_headers=["*"],  # setuped to allow all type of headers.
)

# Defining image paths
IMAGE_PATH_1 = "aoi4_EO.tif"
IMAGE_PATH_2 = "aoi4_SAR.tif"


@app.post("/blend/")
async def blend_images(weight: float = Query(..., ge=0, le=1)):
    try:
        im1 = tifffile.imread(IMAGE_PATH_1)
        im2 = tifffile.imread(IMAGE_PATH_2)

        # ensuring the images have the same shape
        if im1.shape[:2] != im2.shape:
            raise ValueError(
                f"Image shapes do not match: {im1.shape[:2]} vs {im2.shape}")

    # Extract the first 3 channels of image 1
        im1_rgb = im1[:, :, :3]  # like rgb

    # normalizing the images to 0-255 unsigned 8 bit integer range
        im1_rgb = np.clip(im1_rgb, 0, 255).astype(np.uint8)
        im20 = np.clip(im2, 0, 255).astype(np.uint8)

    # blending the the images with-  weight * im1_rgb + (1 - weight) * im2
        blended_array = (weight * im1_rgb + (1 - weight)
                         * im20[..., np.newaxis])
        blended_array = np.clip(blended_array, 0, 255).astype(np.uint8)

    # converting the blended array to a PIL image
        blended_image = Image.fromarray(blended_array)

    # saving to a buffer in TIFF format
        buffer = BytesIO()
        blended_image.save(buffer, format="TIFF")
        buffer.seek(0)

    # using streaming response for better memory handling
        response = StreamingResponse(buffer, media_type="image/tiff")
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"

        return StreamingResponse(buffer, media_type="image/tiff")
    except Exception as e:
        print("Error during image blending:", e)
        return {"error": str(e)}
