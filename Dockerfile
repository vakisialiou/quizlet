# Step 1: Use the official Node.js image as a base
FROM node:18.19

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the yarn.lock and package.json files
COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN yarn generate
RUN yarn build

# Step 10: Expose the port your app will run on
EXPOSE 3000

# Step 11: Command to run the application
CMD ["yarn", "start"]
