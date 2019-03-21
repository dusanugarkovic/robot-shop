DROP KEYSPACE IF EXISTS stan_cassandra;
CREATE KEYSPACE stan_cassandra WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'} AND durable_writes = true;
CREATE TABLE stan_cassandra.categories ( id UUID PRIMARY KEY, name text );
INSERT INTO stan_cassandra.categories (id, name) VALUES (5b6962dd-3f90-4c93-8f61-eabfa4a803e1, 'Artificial Intelligence');
INSERT INTO stan_cassandra.categories (id, name) VALUES (5b6962dd-3f90-4c93-8f61-eabfa4a803e2, 'Robot');