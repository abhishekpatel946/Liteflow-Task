# Liteflow Task

## Database
Create Table Query for Postgres
```sql
 CREATE TABLE Sales (
	id TEXT PRIMARY KEY,
    transaction_hash TEXT,
    created_at TIMESTAMP NOT NULL,
    from_address TEXT,
    to_address TEXT,
    collection_hash TEXT,
    token_id TEXT,
    value TEXT,
    quantity TEXT
);
```

## Blockchain Indexer
1. Install the relevant packages
```sh
npm install
```
2. Create and .env for
```sh
ALCHEMY_WEBSOCKET=<alchemy_websocket_api>

POSTGRES_DB_PASSWORD=<supabase_postgres_database_pasword>
POSTGRES_API_KEY=<supabase_postgres_database_anon_key>
POSTGRES_DB_URL=<supabase_postgres_database_url>

LOCAL_POSTGRES_USER=<localhost_postgres_user>
LOCAL_POSGRES_HOST=<localhost_postgres_hostname>
LOCAL_POSGRES_DATABASE=<localhost_postgres_database_name>
LOCAL_POSRGRES_PASSWORD=<localhost_postgres_database_password>
```
3. Run the Script
```sh
npm start
```

## Postgraphile
1. Get the latest docker images
```sh
docker pull graphile/postgraphile
```
2. Run the docker image with local postgres
```sh
docker run --init -p 5000:5000 graphile/postgraphile --connection postgres://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:POSTGRES_PORT/POSTGRES_DATABASE --schema app_public --watch
```