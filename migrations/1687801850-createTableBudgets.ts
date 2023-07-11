import { Sql } from 'postgres';

export async function up(sql: Sql) {
  // SQL language require snakecase
  await sql`
CREATE TABLE budgets (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
user_id integer,
amount decimal(10,2) NOT NULL,
category_id integer
)
`;
}

export async function down(sql: Sql) {
  await sql`
DROP TABLE budgets
`;
}
