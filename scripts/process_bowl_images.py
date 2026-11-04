import os
from PIL import Image
from rembg import remove

source_files = {
    "bowl_bellam_avakaya.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_bellam_avakaya_1793805961747.jpg",
    "bowl_karam_podi.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_karam_podi_1793806000901.jpg",
    "bowl_kara_murukku.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_kara_murukku_1793806048435.jpg",
    "bowl_sunnunda_laddu.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_sunnunda_laddu_1793806083251.jpg",
    "bowl_gongura_pickle.png": r"C:\Users\DELL\.gemini\antigravity-ide\brain\c7866afa-9c80-4f45-b18a-471e7d0c784e\bowl_gongura_pickle_1793806120481.jpg"
}

dest_dir = os.path.abspath("public/assets/images")
os.makedirs(dest_dir, exist_ok=True)

print(f"Output directory: {dest_dir}")

for out_name, src_path in source_files.items():
    print(f"Processing {out_name} from {src_path}...")
    if not os.path.exists(src_path):
        print(f"Error: {src_path} does not exist!")
        continue
    
    with open(src_path, 'rb') as f:
        input_data = f.read()
    
    # Remove background with rembg
    output_data = remove(input_data)
    
    out_png_path = os.path.join(dest_dir, out_name)
    with open(out_png_path, 'wb') as f:
        f.write(output_data)
    
    # Also save as JPG without transparency if needed
    jpg_name = out_name.replace(".png", ".jpg")
    img = Image.open(src_path)
    img.save(os.path.join(dest_dir, jpg_name), "JPEG", quality=95)
    
    print(f"Saved: {out_png_path} and {jpg_name}")

print("All 5 bowl images processed with transparent background!")
