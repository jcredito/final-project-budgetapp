import { Sql } from 'postgres';

export async function up(sql: Sql) {
  // SQL language require snakecase
  await sql`
CREATE TABLE categories (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
user_id integer,
name varchar(255)
)
`;
}

export async function down(sql: Sql) {
  await sql`
DROP TABLE categories
`;
}
