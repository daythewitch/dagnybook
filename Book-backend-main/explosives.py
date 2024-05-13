import sys

if len(sys.argv) < 2:
    image_path = input("Please provide the image path: ")
else:
    image_path = sys.argv[1]



import cv2
import os
import csv
from detectron2.utils.logger import setup_logger
from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog
import torch

# Installation of Detectron2 dependencies (Should be done in the environment before running this script)
# !pip install pyyaml==5.1
# !git clone 'https://github.com/facebookresearch/detectron2'
# !python -m pip install -e detectron2

# Setup logger
setup_logger()

# Check environment
print("Torch version:", torch.__version__)
print("CUDA version:", torch.version.cuda)
print(f"Image path: {image_path}")
print(f"Image file exists: {os.path.exists(image_path)}")

image = cv2.imread(image_path)

# Create output directories
output_dir = "./output"
os.makedirs(output_dir, exist_ok=True)
pieces_dir = "./pieces"
os.makedirs(pieces_dir, exist_ok=True)

# Setup Detectron2 configuration
cfg = get_cfg()
cfg.merge_from_file(model_zoo.get_config_file("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"))
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.5
cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url("COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml")
#cfg.MODEL.DEVICE = "mps"  # Force model to run on apple silicon remove for windows (https://huggingface.co/docs/diffusers/optimization/mps)

# Inference
predictor = DefaultPredictor(cfg)
outputs = predictor(image)

# Crop each detected instance and save
boxes = outputs["instances"].pred_boxes.tensor.cpu().numpy()
# Create or open the CSV file to write the box coordinates and filenames
with open(os.path.join(output_dir, 'cropped_images_info.csv'), mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Filename', 'X1', 'Y1', 'X2', 'Y2', 'Width', 'Height'])
    for idx, box in enumerate(boxes):
        x1, y1, x2, y2 = map(int, box)
        width = x2 - x1
        height = y2 - y1
        cropped_image = image[y1:y2, x1:x2]
        filename = f"piece_{idx+1}.jpg"
        cv2.imwrite(os.path.join(pieces_dir, filename), cropped_image)
        # Write the box coordinates and filename to the CSV file
        writer.writerow([filename, x1, y1, x2, y2, width, height])

print(f"Cropped images and their details are saved in {pieces_dir} and {output_dir}/cropped_images_info.csv")
