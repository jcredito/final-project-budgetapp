import { Sql } from 'postgres';

export async function up(sql: Sql) {
  // SQL language require snakecase
  await sql`
CREATE TABLE transactions (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
date DATE NOT NULL DEFAULT NOW(),
user_id integer,
amount float NOT NULL,
category_id integer,
type text NOT NULL,
note varchar(255)
)
`;
}

export async function down(sql: Sql) {
  await sql`
DROP TABLE transactions
`;
}
