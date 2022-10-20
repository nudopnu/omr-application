import base64
import json
import cv2
import numpy as np
from PIL import ImageColor

from commands import command_loop, imgDecoding, imgEncoding, reply

glob = {}

def setImage(img64):
    img = imgDecoding()(img64)
    
    if len(img.shape) > 2:
        uc, counts = np.unique(img.reshape(-1, img.shape[2]), axis=0, return_counts=True)
        uc = ['#{:02x}{:02x}{:02x}'.format(*c) for c in uc]
        res = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)
    else:
        uc, counts = np.unique(img.reshape(-1), return_counts=True)
        uc = uc.tolist()
        res = img
    
    isSparse = np.sum(img > 0) < np.sum(img == 0)
    if isSparse:
        res = (res > 0).astype(np.uint8) * 255
    res = cv2.cvtColor(res, cv2.COLOR_GRAY2RGB)
    
    glob["image"] = img
    glob["disp"] = res
    glob["uc"] = uc, counts
    
    reply("message", list(zip(uc, counts.tolist())), to_str=False)

def highlight(color):
    res = glob["disp"].copy()
    img = glob["image"]
    if len(img.shape) > 2:
        res[np.all(img==ImageColor.getcolor(color, 'RGB'), axis=2)] = (0, 0, 255)
    else:
        res[np.where(img == color)] = (0, 0, 255)
    res = imgEncoding()(res)
    reply("message", res)

commands = {
    "setImage": setImage, 
    "highlight": highlight,
    "ping": lambda x: x,
}

command_loop(commands)