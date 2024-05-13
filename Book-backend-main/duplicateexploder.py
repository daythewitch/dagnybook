import csv
import requests
import json
import sys

# Read the content of ocr_results.csv
with open('ocr_results.csv', 'r') as file:
    csv_reader = csv.reader(file)
    content = '\n'.join([', '.join(row) for row in csv_reader])

# Read the cropped images info
with open('./output/cropped_images_info.csv', 'r') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        content += f"\n{row['Filename']}, {row['X1']}, {row['Y1']}, {row['X2']}, {row['Y2']}, {row['Width']}, {row['Height']}"

with open('keylol.json', 'r') as file:
    keylol = json.load(file)
    print(keylol['openaikey'])
    

# Prepare the system prompt for the model
system_prompt = "You have a list of raw book titles with some duplicates and filename and quordnates. Your task is to remove the duplicates, format the titles, and organize them into a JSON object with the formatted title and the filename and the quordnates Your input will always be a csv with book titles and file names, and quordnates and your output must always be in valid JSON format and the book titles must be coherent:"

# Prepare the data to send to the OpenAI API
data = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": content}
    ],
    "temperature": 0.7
}

# Make a POST request to the OpenAI API
apikey = keylol['openaikey']
response = requests.post('https://api.openai.com/v1/chat/completions', json=data, headers={'Authorization': 'Bearer ' + apikey})

#print(response.status_code)

# Process the response
api_response = response.json()

#print(json.dumps(api_response, indent=2))

# Extract the content to write to the text file
response_content = api_response['choices'][0]['message']['content']
lines = response_content.split('\n')
filtered_content = '\n'.join(lines[1:-1])

# Save the filtered content to a text file
with open('openai_response.txt', 'w') as txt_file:
    txt_file.write(filtered_content)
