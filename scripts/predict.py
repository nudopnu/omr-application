import sys
import os
import tensorflow as tf
# import cv2
# import numpy as np
# import pandas as pd
# import matplotlib.pyplot as plt
# from Preprocessing.dataset import Dataset, listSubFiles, groupPaths
# from Preprocessing.image import single_channel, getRandomRegion, sparse, apply, tile_merge_flat

MODEL_FILE = sys.argv[1]

model = tf.keras.models.load_model(os.path.join("../optical-music-recognition/models/", MODEL_FILE))

def predict(tile):
    res = model.predict(tile[None, :])
    res = np.argmax(res[0], 2)
    return res

# x_sample, y_sample = x_paths[30], y_paths[30]
# prediction = apply(x_sample)(
#     lambda path: cv2.imread(path),
#     lambda img: cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)[:, :, None],
#     sparse(),
#     tile_merge_flat((256, 256), predict),
# )