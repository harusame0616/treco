FROM openjdk:19-slim-buster

WORKDIR /treco/firebase/projects/workspace

RUN apt-get update -qq && \
    apt-get install -qqy nodejs npm curl && \
    npm install -g n firebase-tools && \
    n lts && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "firebase", "emulators:start" ]
