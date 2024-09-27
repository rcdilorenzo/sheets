# Use an official Ubuntu base image
FROM ubuntu:22.04

# Install required packages
RUN apt-get update -y

# Install deps
RUN apt-get install -y wget perl curl software-properties-common make libwx-perl

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
RUN apt-get install -y python3

# Install pip
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3 get-pip.py

COPY requirements.txt /app/requirements.txt
WORKDIR /app

# Install any needed packages specified in requirements.txt
RUN pip3 install --no-cache-dir --ignore-installed -r requirements.txt

COPY src /app/src
COPY data /app/data
COPY setup.py /app/setup.py

# Install the project
RUN pip3 install -e .

ENV PORT=8081

CMD ["python3", "src/app.py"]

