'use client';

import { useState } from 'react';
import { Category } from '../../Models/Category';
import styles from './BudgetManagement.module.css';
import { Budget } from '../../Models/Budget';
import { TransactionGroup } from '../../Models/Transaction';
import BudgetManagementEdit from './BudgetManagementEdit';
import BudgetManagementItem from './BudgetManagementItem';

type Props = {
    categories: Category[];
    userId: number;
    budgets: Budget[];
    transactionGroups: TransactionGroup[];
};

export default function BudgetManagement({ userId, categories, budgets, transactionGroups }: Props) {
    const budgetHeaders: string[] = [
        'Category', 'Budget', 'Transactions', 'Balance', '', ''
    ];
    const [managedBudgets, setManageBudget] = useState<Budget[]>(budgets);
    return (
        <div className='m-50 px-28 bg-gray-200 py-2'>
            <div className='border-b-2 py-2 mb-2 px-4 bg-white'>
                <h3 className='font-bold'>Budget Management</h3>
            </div>
            <div>
                <table className={styles['table']}>
                    <thead>
                        <tr>
                            {
                                budgetHeaders.map(
                                    (title, index) => {
                                        return (
                                            <th
                                                className={styles['table-title']}
                                                key={`title-${index}-${title}`}
                                            >{title}</th>
                                        )
                                    }
                                )
                            }
                        </tr>
                    </thead>
                    <tbody
                        className={styles['table-body']}
                    >
                        {
                            managedBudgets.map((budget) => {
                                return (

                                    <BudgetManagementItem
                                            budget={budget}
                                            transactionGroup={transactionGroups.find(b => b.category.id === budget.category.id)}
                                        />
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}