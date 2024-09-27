# Use an official Ubuntu base image
FROM ubuntu:22.04

# Install required packages
RUN apt-get update && apt-get install -y wget perl curl software-properties-common make libwx-perl

# Install ChordPro
RUN cpan -T chordpro

# Add the third-party repository for Chromium
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Update and install Chromium
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt-get install -y nodejs \
    && rm nodesource_setup.sh

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb [arch=amd64] http://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn

WORKDIR /app

# Install Python dependencies
COPY requirements.txt /app
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY web/yarn.lock /app/web/yarn.lock
COPY web/package.json /app/web/package.json
WORKDIR /app/web
RUN yarn install

# Build the Next.js app
COPY web /app/web
RUN yarn build

# Go back to the main app directory
WORKDIR /app

# Copy the entire project
COPY . /app

# Install the project
RUN pip3 install .

# Remove nodejs, yarn, and node_modules
RUN apt-get remove -y nodejs yarn
RUN rm -rf /app/web/node_modules

ENV PORT=8081
ENV PYTHONPATH=/app

CMD ["python3", "src/app.py"]

