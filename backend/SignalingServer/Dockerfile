# Use a Java development kit (JDK) as base image
FROM openjdk:17-slim

# Install curl and Maven
RUN apt-get update && apt-get install -y curl maven

# Set the working directory
WORKDIR /app

# Copy Maven wrapper files to the container
COPY mvnw mvnw
COPY .mvn .mvn

# Copy pom.xml to the container
COPY pom.xml .

# Install Maven dependencies (this will leverage Docker cache)
RUN ./mvnw dependency:go-offline

# The source code will be mounted by docker-compose, so no need to copy it here
