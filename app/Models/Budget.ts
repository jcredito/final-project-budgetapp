import { Category } from "./Category";


export type Budget = {
    id: number | undefined;
    userId: number;
    amount: number;
    category: Category;
};

export type BudgetTable = {
    id: number | undefined;
    userId: number;
    amount: number;
    categoryId: number;
};