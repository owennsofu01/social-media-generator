# --------------------------
# Stage 1: Build stage
# --------------------------
FROM python:3.13-slim AS builder

# Set work directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements and install in isolated location
COPY requirements.txt .
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# --------------------------
# Stage 2: Production stage
# --------------------------
FROM python:3.13-slim 

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy app code
COPY . .

# Expose port
EXPOSE 5000

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Run the app
CMD ["python", "app.py"]
