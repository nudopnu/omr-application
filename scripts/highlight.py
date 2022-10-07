import base64
import cv2
import numpy as np
from PIL import ImageColor

print("Ready")
img64 = input()

# Convert from base64 to img
imgBytes = base64.b64decode(img64, altchars=None, validate=False)
img = np.frombuffer(imgBytes, dtype=np.uint8)
img = cv2.imdecode(img, cv2.IMREAD_ANYCOLOR)

print("Received image")

while True:
    hex = input()
    rgb = ImageColor.getcolor(hex, "RGB")

    res = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)
    
    isSparse = np.sum(img > 0) < np.sum(img == 0)
    if isSparse:
        res = (res > 0).astype(np.uint8) * 255
    res = cv2.cvtColor(res, cv2.COLOR_GRAY2RGB)
    res[np.all(img==rgb[::-1], axis=2)] = (0, 0, 255)
    
    # Convert result to base64
    bytes = cv2.imencode(".png", res)[1]
    res64 = base64.b64encode(bytes)
    print(res64)
