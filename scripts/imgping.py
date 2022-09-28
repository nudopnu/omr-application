import io
import sys
import base64
import cv2
import numpy as np
from PIL import Image

if len(sys.argv) == 1:
    raise Exception("No image data provieded")
img64 = sys.argv[1]

# Covert from base64 to img
imgBytes = base64.b64decode(img64, altchars=None, validate=False)
image = Image.open(io.BytesIO(imgBytes))
image = np.array(image)
image = cv2.cvtColor(image, cv2.COLOR_RGBA2GRAY)

# print(image.shape)
# cv2.namedWindow('wurst')
# cv2.imshow('wurst', image)
# cv2.waitKey(-1)
# cv2.destroyAllWindows()

num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(image)
res = np.zeros_like(image)
res[labels == np.argmax(stats[1:, cv2.CC_STAT_AREA] + 1)] = 255

# Convert image to base64
bytesIO = io.BytesIO()
Image.fromarray(res).save(bytesIO, format='PNG')
res64 = base64.b64encode(bytesIO.getvalue())

print(res64)