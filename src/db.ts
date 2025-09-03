import pg from 'pg';
const { Client } = pg
 
const client = new Client({
  user: 'nodejs_tutorial',
  password: 'nodejs_tutorial',
  host: 'nodejs_tutorial-db-1',
  port: 5432,
  database: 'nodejs_tutorial',
});

(async () => {
  try {
    await client.connect();
    console.log('database connection success');
  } catch (err) {
    console.error('error connecting to database: ', err);
  }
})();

export default client;

