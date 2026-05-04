# Bangkok Laptop Hunt — Playwright scraper in headless Chromium
# Multi-stage build for smaller image

# ---- Build stage ----
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY src/ ./src/
COPY scripts/ ./scripts/

# ---- Runtime stage ----
FROM node:20-slim

WORKDIR /app

# Install Playwright system dependencies (Chromium needs these in headless mode)
# See: https://playwright.dev/docs/docker
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# Copy node_modules and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY data/ ./data/

# Install Playwright browsers (Chromium only — we don't need Firefox/WebKit)
RUN npx playwright install chromium

# Create scraper user and set ownership before VOLUME declaration
RUN groupadd -r scraper && useradd -r -g scraper -d /app scraper \
    && chown -R scraper:scraper /app

# Output directory
VOLUME ["/app/data"]

USER scraper

# Default: scrape all platforms
ENTRYPOINT ["node", "src/index.js"]
CMD ["--all"]
