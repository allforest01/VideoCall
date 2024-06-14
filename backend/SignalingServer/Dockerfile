# Use a Java development kit (JDK) as base image
FROM openjdk:17-slim

# Install curl
RUN apt-get update && apt-get install -y curl

# Set the working directory
WORKDIR /app

# Copy the project files
COPY . .

# Package the application
RUN ./mvnw package -DskipTests

# Rename the JAR file
RUN mv target/SignalingServer-0.0.1-SNAPSHOT.jar target/SignalingServer.jar

# Run the application
CMD ["java", "-jar", "target/SignalingServer.jar"]
