FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependency files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm install 

# Copy the rest of your backend source code
COPY . .

# Expose the port your Express app 
EXPOSE 5000

# Start the application
CMD ["npm", "start"]

