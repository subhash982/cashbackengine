# Multi-stage build for Spring Boot service
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew gradlew.bat ./
COPY gradle/ gradle/
COPY build.gradle settings.gradle ./
COPY cashbackengine-service/build.gradle cashbackengine-service/

# Ensure gradlew is executable (Windows hosts strip execute bit)
RUN chmod +x gradlew

# Download dependencies (cached layer)
RUN ./gradlew :cashbackengine-service:dependencies --no-daemon 2>/dev/null || true

# Copy source and build
COPY cashbackengine-service/src cashbackengine-service/src
RUN ./gradlew :cashbackengine-service:bootJar --no-daemon -x test

# Runtime image
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create non-root user
RUN addgroup -S cashback && adduser -S cashback -G cashback

COPY --from=build /app/cashbackengine-service/build/libs/*.jar app.jar

RUN chown cashback:cashback app.jar

USER cashback

EXPOSE 8080

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Dspring.profiles.active=docker", \
    "-jar", "app.jar"]
