import { useState, SetStateAction, Dispatch } from 'react';
import { Transaction } from '../../Models/Transaction';
import styles from './TransactionList.module.css';
import moment from 'moment';

type Props = {
    transaction: Transaction;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    deleteTransaction: CallableFunction
};

export default function TransactionItemView({ transaction, setIsEditing, deleteTransaction }: Props) {
    return (
        <tr>
            <td
                className={styles['table-cell']}
            >{moment(transaction.date).format('YYYY-MM-DD')}</td>
            <td
                className={styles['table-cell']}
            >{transaction.amount}</td>
            <td
                className={styles['table-cell']}
            >{transaction.category.name}</td>
            <td
                className={styles['table-cell']}
            >{transaction.type}</td>
            <td
                className={styles['table-cell']}
            >{transaction.note}</td>
            <td
                className={styles['table-cell']}
            ><button className={styles['btn-edit']} onClick={()=>{setIsEditing(true)}}>edit</button></td>
            <td
                className={styles['table-cell']}
            ><button className={styles['btn-delete']} onClick={async () => {await deleteTransaction(transaction)}}>delete</button></td>
        </tr>
    )
}