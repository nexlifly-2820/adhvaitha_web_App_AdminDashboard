import os
from PIL import Image
from rembg import remove

source_files = {
    "bowl_khara_mixture.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_khara_mixture_1793817486453.jpg",
    "bowl_usiri_pickle.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_usiri_pickle_1793817515785.jpg",
    "bowl_chakinalu.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_chakinalu_1793817532923.jpg"
}

dest_dirs = [
    os.path.abspath("public/assets/images"),
    os.path.abspath("public/images/products"),
    os.path.abspath("public/images/images/products"),
    os.path.abspath("bigrock_backend/api/uploads"),
    r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e"
]

for d in dest_dirs:
    os.makedirs(d, exist_ok=True)

for out_name, src_path in source_files.items():
    print(f"Processing {out_name} with rembg...")
    if not os.path.exists(src_path):
        print(f"Error: {src_path} not found!")
        continue
    
    with open(src_path, 'rb') as f:
        input_data = f.read()
    
    output_data = remove(input_data)
    
    for d in dest_dirs:
        target_path = os.path.join(d, out_name)
        with open(target_path, 'wb') as f:
            f.write(output_data)
        print(f"Saved {target_path}")

print("All 3 new bowl images processed with transparent backgrounds and deployed!")
