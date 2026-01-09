import os
from PIL import Image

def remove_background(folder_path):
    print(f"Processing images in {folder_path}")
    
    # Threshold for dark background removal (0-255)
    threshold = 30 
    
    for filename in os.listdir(folder_path):
        if filename.endswith(".png"):
            file_path = os.path.join(folder_path, filename)
            try:
                img = Image.open(file_path)
                img = img.convert("RGBA")
                datas = img.getdata()
                
                new_data = []
                for item in datas:
                    # Check if pixel is dark (assuming dark background)
                    # You might need to adjust this logic based on actual background color
                    # If background is purely black (0,0,0) or very dark
                    if item[0] < threshold and item[1] < threshold and item[2] < threshold:
                        new_data.append((0, 0, 0, 0)) # Transparent
                    else:
                        new_data.append(item)
                        
                img.putdata(new_data)
                img.save(file_path, "PNG")
                print(f"Processed {filename}")
            except Exception as e:
                print(f"Failed to process {filename}: {e}")

if __name__ == "__main__":
    folder = r"d:\Jeu-mobile-adrien\assets\buildings\ruins"
    remove_background(folder)
