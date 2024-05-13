# Use a Node.js base image
FROM node:16

# Set the working directory in the Docker container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the TypeScript project
RUN npm run preview

# Expose the port the app runs on
EXPOSE 8086

# Command to run your app
CMD ["node", "dist/main.js"]