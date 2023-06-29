import { Sql } from 'postgres';

// TS language camelcase
export type Transaction = {
  id: number | null;
  userId: number;
  amount: number;
  note: string;
  type: string;
  categoryId?: number;
};

export async function up(sql: Sql) {
  // SQL language require snakecase
  await sql`
CREATE TABLE transactions (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
date DATE NOT NULL DEFAULT NOW(),
category_id varchar(200),
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
