FROM postgres:16-alpine

LABEL description="PostgreSQL database for rmap development"

# Copy initialization script
COPY create-db.sql create-db-test.sql /docker-entrypoint-initdb.d/

EXPOSE 5432