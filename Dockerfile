FROM node:18-alpine

# Create app directory
WORKDIR /

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install -g pnpm
RUN pnpm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .
RUN pnpm run build

EXPOSE 5173
CMD [ "pnpm", "run" , "dev" ]
