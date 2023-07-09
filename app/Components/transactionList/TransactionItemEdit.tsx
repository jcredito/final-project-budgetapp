import { useState, SetStateAction, Dispatch, useEffect } from 'react';
import { Transaction, TransactionsType } from '../../Models/Transaction';
import styles from './TransactionList.module.css';
import moment from 'moment';
import { Category } from '../../Models/Category';

type Props = {
    transaction: Transaction;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    setEditingTransaction: Dispatch<SetStateAction<Transaction>>;
    updateTransaction: CallableFunction;
    categories: Category[];
};

export default function TransactionItemEdit({ transaction, setIsEditing, setEditingTransaction, updateTransaction, categories }: Props) {
    const [date, setDate] = useState<Date>(transaction.date);
    const [amount, setAmount] = useState<number>(transaction.amount);
    const [category, setCategory] = useState<number>(transaction.category.id ?? 0);
    const [type, setType] = useState(transaction.type);
    const [note, setNote] = useState(transaction.note ?? '');

    useEffect(() => {
        console.log("useEffect::TransactionItemEdit", categories);
      }, [categories]);
    return (
        <tr>
            <td
                className={styles['table-cell']}
                colSpan={6}
            >
                <form className="w-full">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <input
                                className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
                                id="grid-first-name"
                                type="date"
                                value={moment(date).format('YYYY-MM-DD')}
                                onChange={
                                    (event) => setDate(new Date(event.currentTarget.value))
                                }
                            />
                            <p className="text-gray-600 text-xs">Date</p>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <input
                                className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
                                id="grid-first-name"
                                type="text"
                                value={amount}
                                onChange={
                                    (event) => setAmount(isNaN(parseInt(event.currentTarget.value)) ? 0 : parseInt(event.currentTarget.value))
                                }
                            />
                            <p className="text-gray-600 text-xs">Amount</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <select
                                className='block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                                value={category}
                                onChange={
                                    (event) => setCategory(parseInt(event.currentTarget.value))
                                }
                            >
                                {
                                    categories.map(
                                        option => {
                                            return (
                                                <option
                                                    value={option.id}
                                                    defaultChecked={option.id===transaction.category.id}
                                                    key={`key-${option.id}-${option.name}`}
                                                >
                                                    {option.name}
                                                </option>
                                            );
                                        }
                                    )
                                }
                            </select>
                            <p className="text-gray-600 text-xs">Category</p>
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <select
                                className='block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                                value={type}
                                onChange={
                                    (event) => setType(event.currentTarget.value)
                                }
                            >
                                {
                                    TransactionsType.map(
                                        option => {
                                            return (
                                                <option
                                                    value={option}
                                                    defaultChecked={option===transaction.type}
                                                    key={`key-${option}-type`}
                                                >
                                                    {option}
                                                </option>
                                            );
                                        }
                                    )
                                }
                            </select>
                            <p className="text-gray-600 text-xs">Type</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <input
                                className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-password"
                                type="text" value={note ?? ''}
                                onChange={
                                    (event) => setNote(event.currentTarget.value)
                                }
                            />
                            <p className="text-gray-600 text-xs">Note</p>
                        </div>
                    </div>
                </form>
            </td>
            <td
                className={styles['table-cell']}
            >
                <div className='flex flex-col'>
                <button
                    className={styles['btn-edit']}
                    onClick={
                        () => {
                            setIsEditing(false);
                            updateTransaction({
                                ...transaction,
                                date: date,
                                amount: amount,
                                categoryId: category,
                                type: type,
                                note: note
                            });
                            setEditingTransaction({
                                ...transaction,
                                date: date,
                                amount: amount,
                                category: categories.find(cat => cat.id && cat.id === (category)) ?? transaction.category,
                                type: type,
                                note: note
                            })
                        }
                    }
                >save</button>
                <button
                onClick={
                    () => {
                        setIsEditing(false);
                        setEditingTransaction(transaction);
                    }
                }
                className={styles['btn-cancel'] + ' mt-1'}
                >cancel</button>
                </div>
            </td>
        </tr>
    )
}
