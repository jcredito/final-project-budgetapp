import { Sql } from 'postgres';

// TS language camelcase
export type Transaction = {
  id: number | undefined;
  date: string;
  userId: number;
  amount: number;
  category: string;
  type: string;
  note: string | null;
};

export async function up(sql: Sql) {
  // SQL language require snakecase
  await sql`
CREATE TABLE transactions (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
date DATE NOT NULL DEFAULT NOW(),
user_id integer,
amount decimal(10,2) NOT NULL,
category varchar(200) NOT NULL,
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
