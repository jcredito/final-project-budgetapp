import { Category } from "./Category";


export type Transaction = {
    id: number | undefined;
    date: Date;
    userId: number;
    amount: number;
    category: Category;
    type: string;
    note: string | null;
};

export type TransactionTable = {
    id: number | undefined;
    date: Date;
    userId: number;
    amount: number;
    categoryId: number;
    type: string;
    note: string | null;
};

export type TransactionGroup = {
    category: Category;
    amount: number;
}

export const TransactionTypeIn: string = 'In';
export const TransactionTypeOut: string = 'Out';
export const TransactionsType: string[] = [TransactionTypeOut];
