'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Category } from '../../Models/Category';
import styles from './BudgetManagement.module.css';
import { Budget } from '../../Models/Budget';
import { TransactionGroup } from '../../Models/Transaction';

type Props = {
    budget: Budget;
    setIsEditingBudget: Dispatch<SetStateAction<boolean>>;
    updateBudget: CallableFunction;
};

export default function BudgetManagementEdit({ budget, setIsEditingBudget, updateBudget }: Props) {
    const [newBudget, setNewBudget] = useState<number>(budget.amount);
    return (
        <tr
            key={`budget-${budget.id}`}
        >
            <td className={styles['table-cell']}>{budget.category.name}</td>
            <td
                className={styles['table-cell']}
                colSpan={5}
            >
                <form onSubmit={event => event.preventDefault()} className='flex flex-row'>
                    <div className="flex flex-wrap grow">
                        <div className="w-full">
                            <input
                                className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                type="text"
                                value={newBudget}
                                onChange={
                                    (event) => {setNewBudget(isNaN(parseInt(event.currentTarget.value)) ? 0 : parseInt(event.currentTarget.value))}
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap pb-1 mx-3">
                        <div className="w-full flex gap-x-1">
                            <button
                                className={styles['btn-save']}
                                onClick={
                                    async () => {
                                        updateBudget({
                                            id: budget.id,
                                            userId: budget.userId,
                                            amount: newBudget,
                                            categoryId: budget.category.id
                                        });
                                        setIsEditingBudget(false);
                                    }
                                }
                            >Save</button>
                            <button className={styles['btn-cancel']} onClick={() => { setIsEditingBudget(false); setNewBudget(budget.amount); }}>Cancel</button>
                        </div>
                    </div>
                </form>

            </td>
        </tr>
    )
}