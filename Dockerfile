FROM ubuntu:noble

# Install Node.js 22
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

# Create app directory
WORKDIR /usr/src/app

# Copy all source code first
COPY . .

# Install dependencies
RUN npm install

EXPOSE 8888

CMD ["npm", "run", "dev"] 