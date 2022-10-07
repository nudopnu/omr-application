
import base64
import os
import sys
import json
import cv2
import numpy as np
import tensorflow as tf
from PIL import Image
from Preprocessing.image import apply, sparse, tile_merge_flat

MODEL_FILE = sys.argv[1]
img64 = input()
model = tf.keras.models.load_model(os.path.join("../optical-music-recognition/models/", MODEL_FILE))

def predict(tile):
    res = model.predict(tile[None, :], verbose = 0)
    res = np.argmax(res[0], 2)
    return res

# Convert from base64 to img
imgBytes = base64.b64decode(img64, altchars=None, validate=False)
img = np.frombuffer(imgBytes, dtype=np.uint8)
img = cv2.imdecode(img, cv2.IMREAD_ANYCOLOR)
image = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)

prediction = apply(image)(
    lambda img: img[:, :, None],
    sparse(),
    tile_merge_flat((256, 256), predict),
)

# Convert result to base64
bytes = cv2.imencode(".png", prediction)[1]
res64 = base64.b64encode(bytes)

print(res64)

# test: 
# cat b64.txt | py scripts/predict.py simple_unet_256x256_03.h5 > tmp.txt