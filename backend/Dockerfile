# Base stage (use latest Rust; pin was 1.84, too old for edition2024)
FROM rust:slim-bookworm as chef
WORKDIR /app
RUN cargo install cargo-chef --locked

# Planner stage
FROM chef as planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# Builder stage
FROM chef as builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching layer!
RUN cargo chef cook --release --recipe-path recipe.json

# Build application
COPY . .
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim as runtime
WORKDIR /app

# Install runtime dependencies (OpenSSL is critical for sqlx/postgres)
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/backend /usr/local/bin/backend
COPY --from=builder /app/migrations /app/migrations
# Configuration for running
ENV RUST_LOG=info

EXPOSE 3001
CMD ["backend"]
