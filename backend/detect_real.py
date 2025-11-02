import torch
from transformers import AutoModelForImageClassification, AutoFeatureExtractor
from PIL import Image
import cv2
import numpy as np
from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
import warnings

warnings.filterwarnings('ignore')
i = 0
# --- ViT reshape function ---
def reshape_transform(tensor, height=14, width=14):
    tensor = tensor[:, 1:, :]
    result = tensor.reshape(tensor.size(0), height, width, tensor.size(2))
    result = result.permute(0, 3, 1, 2)
    return result

# --- Model wrapper ---
class ModelWrapper(torch.nn.Module):
    def __init__(self, model):
        super().__init__()
        self.model = model
    
    def forward(self, x):
        outputs = self.model(x)
        return outputs.logits

# --- Load model globally (so it loads only once) ---
print("🔄 Loading Deepfake model...")
MODEL_NAME = "prithivMLmods/Deepfake-Detection-Exp-02-21"
processor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
hf_model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
model = ModelWrapper(hf_model)
model.eval()
print("✅ Model ready!")

# --- Main function ---
def analyze_image(image_path):
    global i
    pil_img = Image.open(image_path).convert('RGB')
    img_size_for_model = (processor.size['width'], processor.size['height'])
    inputs = processor(images=pil_img, return_tensors="pt")
    input_tensor = inputs['pixel_values']

    with torch.no_grad():
        logits = model(input_tensor)
    
    predicted_index = logits.argmax(-1).item()
    label_name = hf_model.config.id2label[predicted_index]
    score = torch.nn.functional.softmax(logits, dim=1)[0, predicted_index].item()

    target_layer = [model.model.vit.encoder.layer[11].layernorm_before]
    with GradCAMPlusPlus(model=model, 
                         target_layers=target_layer,
                         reshape_transform=reshape_transform) as cam:
        targets = [ClassifierOutputTarget(predicted_index)]
        grayscale_cam = cam(input_tensor=input_tensor, targets=targets)[0, :]

        grayscale_cam = (grayscale_cam - grayscale_cam.min()) / (grayscale_cam.max() - grayscale_cam.min() + 1e-8)

    rgb_img = cv2.imread(image_path)
    rgb_img = cv2.cvtColor(rgb_img, cv2.COLOR_BGR2RGB)
    rgb_img = np.float32(rgb_img) / 255
    rgb_img_resized = cv2.resize(rgb_img, img_size_for_model)

    heatmap_bgr = cv2.applyColorMap(np.uint8(255 * grayscale_cam), cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap_bgr, cv2.COLOR_BGR2RGB)
    visualization = (0.6 * np.float32(heatmap_rgb) / 255) + (0.4 * rgb_img_resized)
    final_image = np.hstack((rgb_img_resized, visualization))
    i += 1
    output_filename = f"output_deepfake_explainability{i}.jpg"
    cv2.imwrite(output_filename, cv2.cvtColor((final_image * 255).astype(np.uint8), cv2.COLOR_RGB2BGR))

    return label_name, round(score * 100, 2), output_filename
