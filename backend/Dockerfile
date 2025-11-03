# Start from a standard Python base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# ---- This is the line that fixes your Tesseract error ----
RUN apt-get update && apt-get install -y tesseract-ocr libgl1

# Copy your Python requirements file
COPY requirements.txt requirements.txt

# Install your Python libraries
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend application code
COPY . .

# Expose the port your application runs on
EXPOSE 10000

# The command to run your application (matches your logs)
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "10000"]
