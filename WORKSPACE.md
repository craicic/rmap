# Install the development workspace

Make sure you have docker installed.

## Database Setup

1. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
    You may have to change the values in `.env` to match your environment.

2. Build and start the services:
   ```bash
   docker-compose up -d --build
   ```

3. Check that services are running:
   ```bash
   docker-compose ps
   ```

## Accessing the Services

### PostgreSQL Database
- **Host**: `localhost`
- **Port**: `5432` (or value in `.env`)
- **Database**: `rmap` (or value in `.env`)
- **User**: `postgres` (or value in `.env`)
- **Password**: `postgres` (or value in `.env`)

Connect via command line:
```bash
  psql postgresql://postgres:postgres@localhost:5432/rmap
```

### Common Commands

Stop services:
```bash
  docker-compose down
```

Stop and remove all data:
```bash
  docker-compose down -v
```

View logs:
```bash
  docker-compose logs -f
```

Rebuild after Dockerfile changes:
```bash
  docker-compose up -d --build
```

## Access pgAdmin:
http://localhost:5050

**Email**: admin@admin.com (or what's in your .env as PGADMIN_DEFAULT_EMAIL)\
**Password**: admin (or what's in your .env as PGADMIN_DEFAULT_PASSWORD)

## First Connection to PostgreSQL:

After logging in, you should see "rmap-dev" server in the left sidebar under Servers.
Click on it, and pgAdmin will ask for the PostgreSQL password.\
**Password**: postgres (or what's in your .env as POSTGRES_PASSWORD)