# Use Node.js 22 as the base image for the API
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the Node.js project into the container
COPY . .

# Expose port 3000 so the API can be accessed
EXPOSE 3000

# Start the Node.js API
CMD ["node", "server.js"]
