'use client';

import { useState } from 'react';
import { Transaction, TransactionTable } from '../../Models/Transaction';
import { Category } from '../../Models/Category';
import styles from './CategoryManagement.module.css';
import CategoryManagementCreate from '../categoryManagement/CategoryManagementCreate'
import CategoryManagementEdit from './CategoryManagementEdit';

type Props = {
    category: Category;
    userId: number;
    updateCategory: CallableFunction;
};

export default function CategoryManagementItem({ userId, category, updateCategory }: Props) {
    const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
    return (

        !isEditingCategory ?
            (
                <tr
                    key={`category-${category.id}-${category.name}`}
                >
                    <td className={styles['table-cell']}>{category.name}</td>
                    <td className={`${styles['table-cell']} text-right`}>
                        <button className={styles['btn-edit']} onClick={() => {setIsEditingCategory(true)}}>edit</button>
                    </td>
                </tr >
            )
            :
            (
                <CategoryManagementEdit updateCategory={updateCategory} userId={userId} category={category} setEditingCategory={setIsEditingCategory}/>
            )

    )
}