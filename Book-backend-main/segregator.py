import os
import cv2
import csv
from pathlib import Path

def list_files(directory):
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

def draw_box_on_image(image_path, box_details):
    image = cv2.imread(image_path)
    x1, y1, x2, y2 = map(int, box_details)
    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.imshow("Image with Box", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    output_dir = "./output"
    pieces_dir = "./pieces"
    csv_file_path = os.path.join(output_dir, 'cropped_images_info.csv')

    # List files in the output directory
    files = list_files(pieces_dir)
    print("Files in output directory:")
    for idx, file in enumerate(files):
        print(f"{idx + 1}: {file}")

    # User selects a file
    file_index = int(input("Enter the number of the file to display: ")) - 1
    selected_file = files[file_index]

    # Read CSV to find the box coordinates for the selected file
    with open(csv_file_path, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['Filename'] == selected_file:
                box_details = (row['X1'], row['Y1'], row['X2'], row['Y2'])
                break

    # Draw the box on the original image
    original_image_path = "./input.jpg"
    draw_box_on_image(original_image_path, box_details)

if __name__ == "__main__":
    main()