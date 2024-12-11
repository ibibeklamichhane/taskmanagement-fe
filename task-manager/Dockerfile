# Step 1: Use Node.js as a base image
FROM node:18 AS build

# Step 2: Set the working directory to /app
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the project files into the container
COPY . .

# Step 6: Build the React app (via Vite)
RUN npm run build

# Step 7: Use Nginx image to serve the build
FROM nginx:alpine

# Step 8: Copy the built app from the build stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose port 80 (default for Nginx)
EXPOSE 80

# Step 10: Run Nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]
