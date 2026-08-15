"""
optimize_images.py
Batch-resizes and converts images to WebP for web use.

Usage:
    python optimize_images.py

Reads every image from ./pic/
Writes optimized WebP versions to ./pic-optimized/
Originals are never modified.
"""

import os
from PIL import Image

SOURCE_FOLDER = "pic"
OUTPUT_FOLDER = "pic-optimized"
MAX_WIDTH = 1200          # resize anything wider than this
WEBP_QUALITY = 80         # 0-100, 80 is a strong quality/size balance

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")


def optimize_images():
    if not os.path.exists(SOURCE_FOLDER):
        print(f"Folder '{SOURCE_FOLDER}' not found. Put it next to this script.")
        return

    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    files = [f for f in os.listdir(SOURCE_FOLDER) if f.lower().endswith(VALID_EXTENSIONS)]

    if not files:
        print(f"No images found in '{SOURCE_FOLDER}'.")
        return

    for filename in files:
        source_path = os.path.join(SOURCE_FOLDER, filename)
        name_without_ext = os.path.splitext(filename)[0]
        output_path = os.path.join(OUTPUT_FOLDER, f"{name_without_ext}.webp")

        with Image.open(source_path) as img:
            img = img.convert("RGB")  # ensures compatibility, strips alpha issues

            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / img.width
                new_height = int(img.height * ratio)
                img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

            img.save(output_path, "WEBP", quality=WEBP_QUALITY)

        original_size = os.path.getsize(source_path) / 1024
        new_size = os.path.getsize(output_path) / 1024
        print(f"{filename}: {original_size:.0f}KB -> {name_without_ext}.webp: {new_size:.0f}KB")

    print(f"\nDone. Optimized images saved in '{OUTPUT_FOLDER}/'.")


if __name__ == "__main__":
    optimize_images()