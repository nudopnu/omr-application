
import base64
import os
import sys
import json
import cv2
import numpy as np
import tensorflow as tf
from PIL import Image
from Preprocessing.image import apply, sparse, tile_merge_flat

glob = {}

def loadModel(model_file):
    model = tf.keras.models.load_model(os.path.join("../optical-music-recognition/models/", model_file))
    glob["model"] = model
    return f"Loaded model '{model_file}'"

def predict(img64):
    return apply(img64)(
        lambda img64: _decodeImg(img64),
        lambda img: img[:, :, None],
        sparse(),
        tile_merge_flat((256, 256), _predict_tile),
        lambda img: _encodeImg(img),
    )

def _predict_tile(tile):
    res = glob["model"].predict(tile[None, :], verbose = 0)
    res = np.argmax(res[0], 2)
    return res

def _decodeImg(img64):
    # Convert from base64 to img
    imgBytes = base64.b64decode(img64, altchars=None, validate=False)
    img = np.frombuffer(imgBytes, dtype=np.uint8)
    img = cv2.imdecode(img, cv2.IMREAD_ANYCOLOR)
    return cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)

def _encodeImg(img):
    # Convert result to base64
    bytes = cv2.imencode(".png", img)[1]
    return base64.b64encode(bytes)

commands = {
    "loadModel": loadModel,
    "predict": predict,
    "ping": lambda x: x,
}

ERROR = "error"
MESSAGE = "message"

def receive():
    msg = input()
    msg = json.loads(msg)
    type = msg["type"]
    payload = msg["payload"]
    return type, payload

def reply(type, payload):
    print(json.dumps({"type": type, "payload": str(payload)}))

while True:
    type, payload = receive()
    if type not in commands:
        reply(ERROR, "command not found")
    else:
        result = commands[type](payload)
        reply(MESSAGE, result)

# test: 
# cat b64.txt | py scripts/predict.py simple_unet_256x256_03.h5 > tmp.txt