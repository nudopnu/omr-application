import base64
import cv2
import numpy as np

img64 = input()

# Convert from base64 to img
imgBytes = base64.b64decode(img64, altchars=None, validate=False)
img = np.frombuffer(imgBytes, dtype=np.uint8)
img = cv2.imdecode(img, cv2.IMREAD_ANYCOLOR)

print(img.shape)
# cv2.namedWindow('wurst')
# cv2.imshow('wurst', img)
# cv2.waitKey(-1)
# cv2.destroyAllWindows()

# Convert result to base64
bytes = cv2.imencode(".png", img)[1]
res64 = base64.b64encode(bytes)

print(res64)
