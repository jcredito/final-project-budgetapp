'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Category } from '../../Models/Category';
import styles from './BudgetManagement.module.css';
import { Budget } from '../../Models/Budget';
import { TransactionGroup } from '../../Models/Transaction';
import BudgetManagementEdit from './BudgetManagementEdit';

type Props = {
    budget: Budget;
    transactionGroup: TransactionGroup | undefined;
    updateBudget: CallableFunction;
};

export default function BudgetManagementItem({ budget, transactionGroup, updateBudget}: Props) {
    const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
    return (
        
            !isEditingBudget ? (
                <tr
            key={`budget-${budget.id}`}
        >
            <td className={styles['table-cell']}>{budget.category.name}</td>
            <td className={styles['table-cell']}>{budget.amount}</td>
            <td className={styles['table-cell']}>{transactionGroup?.amount ?? 0}</td>
            <td className={styles['table-cell']}>{budget.amount - (transactionGroup?.amount ?? 0)}</td>
            <td className={styles['table-cell']}>
                <button
                    className={styles['btn-edit']}
                    onClick={() => { setIsEditingBudget(true) }}
                >edit</button>
            </td>
            <td className={styles['table-cell']}><button className={styles['btn-delete']}>delete</button></td>
        </tr>
            ) : (
                <BudgetManagementEdit
                budget={budget}
                setIsEditingBudget={setIsEditingBudget}
                updateBudget={updateBudget}
            />
            ) 
        
    )
}