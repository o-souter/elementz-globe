# import requests
# import json

# endpoints = {
#     'pointsOfInterest': 'https://elementz.rguhack.uk/pointsOfInterest',
#     'surfVessels': 'https://elementz.rguhack.uk/surfVessels',
#     'subseaAssets': 'https://elementz.rguhack.uk/subseaAssets',
#     'subseaPipelines': 'https://elementz.rguhack.uk/subseaPipelines'
# }

# def fetch_and_save_data(endpoint, filename):
#     try:
#         response = requests.get(endpoint)
#         # Check if the request was successful
#         if response.status_code == 200:
#             data = response.json()
#             # Write the data to a local JSON file
#             with open(filename, 'w') as outfile:
#                 json.dump(data, outfile, indent=4)
#             print(f"Data has been saved to '{filename}'")
#         else:
#             print(f"Failed to fetch data from {endpoint}. Status code: {response.status_code}")
#     except Exception as e:
#         print(f"An error occurred while fetching data from {endpoint}: {e}")

# # Fetch and save data from all endpoints
# for name, url in endpoints.items():
#     fetch_and_save_data(url, f'{name}.json')


import requests
import json

endpoints = {
    'pointsOfInterest': 'https://elementz.rguhack.uk/pointsOfInterest',
    'surfVessels': 'https://elementz.rguhack.uk/surfVessels',
    'subseaAssets': 'https://elementz.rguhack.uk/subseaAssets',
    'subseaPipelines': 'https://elementz.rguhack.uk/subseaPipelines'
}

def fetch_and_save_data(endpoint, filename, coordinates):
    try:
        response = requests.get(endpoint)
        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            # Extract coordinates and add to the list
            for item in data:
                print(item)
                if 'coordinates' in item:
                    coords = item['coordinates']
                    if 'coordinates' in coords:
                        print("Subsea asset detected, recording coordinates.")
                        coordinates.append({
                            'latitude':coords.get('coordinates').get('latitude'),
                            'longitude':coords.get('coordinates').get('longitude')
                        })
                    elif coords is not None:
                        coordinates.append({
                            'latitude': coords.get('latitude'),
                            'longitude': coords.get('longitude')
                        })
                else:
                    if 'start_coordinates' in item:
                        print("Pipeline detected. Gathering both start and end point coordinates...")
                        coords = item['start_coordinates']
                        coordinates.append({
                            'latitude': coords.get('coordinates').get('latitude'),
                            'longitude': coords.get('coordinates').get('longitude')
                        })
                        coords = item['end_coordinates']
                        coordinates.append({
                            'latitude': coords.get('coordinates').get('latitude'),
                            'longitude': coords.get('coordinates').get('longitude')
                        })
                    # else {

                    # }
                    
            # Write the full data to a local JSON file
            with open(filename, 'w') as outfile:
                json.dump(data, outfile, indent=4)
            print(f"Data has been saved to '{filename}'")
        else:
            print(f"Failed to fetch data from {endpoint}. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred while fetching data from {endpoint}: {e}")

def save_coordinates_to_file(coordinates, filename):
    try:
        # Write the coordinates to a local JSON file
        with open(filename, 'w') as outfile:
            json.dump(coordinates, outfile, indent=4)
        print(f"Coordinates have been saved to '{filename}'")
    except Exception as e:
        print(f"An error occurred while saving coordinates: {e}")

# List to store all coordinates
coordinates = []

# Fetch and save data from all endpoints, and save coordinates separately
for name, url in endpoints.items():
    fetch_and_save_data(url, f'{name}.json', coordinates)

# After fetching data, save all coordinates to a new file
save_coordinates_to_file(coordinates, 'locations.json')

print(coordinates)
