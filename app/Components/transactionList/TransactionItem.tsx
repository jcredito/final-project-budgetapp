import { useState, SetStateAction, Dispatch } from 'react';
import { Transaction } from '../../Models/Transaction';
import TransactionItemView from './TransactionItemView';
import TransactionItemEdit from './TransactionItemEdit';
import { Category } from '../../Models/Category';

type Props = {
    transaction: Transaction;
    deleteTransaction: CallableFunction;
    updateTransaction: CallableFunction;
    categories: Category[];
};

export default function TransactionItem({ transaction, deleteTransaction, updateTransaction, categories }: Props) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction>(transaction)
    return (
        !isEditing ? 
        <TransactionItemView
            transaction={editingTransaction}
            setIsEditing={setIsEditing}
            deleteTransaction={deleteTransaction}
        />
        : <TransactionItemEdit
            transaction={transaction}
            setIsEditing={setIsEditing}
            setEditingTransaction={setEditingTransaction}
            updateTransaction={updateTransaction}
            categories={categories}
        /> 
    )
}