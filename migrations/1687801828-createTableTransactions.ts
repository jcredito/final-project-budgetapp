import { Sql } from 'postgres';

// TS language camelcase
export type Transaction = {
  id: number;
  categoryId?: number;
  userId: number;
  amount: number;
  note: string;
  type: string;
};

export async function up(sql: Sql) {
  // SQL language require snakecase
  await sql`
CREATE TABLE transactions (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
category_id integer,
user_id integer,
amount decimal(10,2),
note text,
type varchar(255)
)
`;
}

export async function down(sql: Sql) {
  await sql`
DROP TABLE transactions
`;
}
