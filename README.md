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
