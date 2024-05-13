
from google.cloud import vision
import os
import csv
from PIL import Image

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./keylol.json"


# Assuming the cropped images are saved in a directory called 'pieces'
pieces_dir = './pieces'

# Path to the CSV file where results will be saved
output_csv_path = './ocr_results.csv'

# Initialize Google Cloud Vision client
client = vision.ImageAnnotatorClient()

# Read each cropped image and perform OCR using Google Cloud Vision
ocr_results = []
for filename in os.listdir(pieces_dir):
    if filename.endswith(".jpg"):
        image_path = os.path.join(pieces_dir, filename)
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        texts = response.text_annotations
        if texts:
            text = texts[0].description
        else:
            text = 'No text found'
        ocr_results.append((filename, text.strip()))

# Write results to a CSV file
with open(output_csv_path, 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Filename', 'Extracted Text'])
    writer.writerows(ocr_results)
print(f"OCR results have been saved to {output_csv_path}")
