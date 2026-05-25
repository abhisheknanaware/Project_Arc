# Use official Node image
FROM node:20-slim

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && apt-get clean

WORKDIR /app

# Copy Python requirements first and install them
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# Copy package.json and install Node dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the backend files
COPY . .

# Expose port and start
EXPOSE 5000
CMD ["node", "server.js"]
