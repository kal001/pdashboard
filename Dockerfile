FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .
# Ensure versioning files are present
COPY VERSION ./
COPY CHANGELOG.md ./

# Create data directory
RUN mkdir -p data

# Create static assets directory if it doesn't exist
RUN mkdir -p static/assets

# Expose port
EXPOSE 5000

# Set environment variables (do not hardcode FLASK_ENV)
ENV FLASK_APP=app.py

# Entrypoint logic: use Gunicorn in production, Flask dev server otherwise
CMD ["/bin/sh", "-c", "if [ \"$FLASK_ENV\" = 'production' ]; then exec gunicorn -b 0.0.0.0:5000 app:app; else exec python app.py; fi"] 