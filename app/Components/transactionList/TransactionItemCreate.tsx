import { useState, SetStateAction, Dispatch, useEffect } from 'react';
import { TransactionTable, TransactionTypeOut, TransactionsType } from '../../Models/Transaction';
import styles from './TransactionList.module.css';
import moment from 'moment';
import { Category } from '../../Models/Category';

type Props = {
    createTransaction: CallableFunction;
    setCreatingTransaction: Dispatch<SetStateAction<boolean>>;
    categories: Category[];
};

export default function TransactionItemCreate({ createTransaction, categories, setCreatingTransaction }: Props) {
    const [date, setDate] = useState<Date>(new Date());
    const [amount, setAmount] = useState<number>(0);
    const [tempAmount, setTempAmount] = useState<string>('0');
    const [category, setCategory] = useState<number>(categories[0]?.id ?? 0);
    const [type, setType] = useState<string>(TransactionTypeOut);
    const [note, setNote] = useState<string>('');

    useEffect(() => {
        console.log(amount);
        setTempAmount(amount.toFixed(2));
      }, [amount]);

    return (
        categories.length > 0 ?
            (<form className="w-full mt-4 p-4" onSubmit={event => event.preventDefault()}>
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
                        value={tempAmount}
                        onChange={
                            (event) => setTempAmount(event.currentTarget.value)
                        }
                        onBlur={
                            (event) => {
                                if (tempAmount.match(/^\d{1,}(\.\d{0,4})?$/)) {
                                    setAmount(parseFloat(tempAmount));
                                } else {
                                    setTempAmount(amount.toFixed(2));
                                }
                            }
                        }
                    />
                    <p className="text-gray-600 text-xs">Amount</p>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <select 
                        className='block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
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
                                        key={`option-id-${option.id}`}
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
                <div className="w-full md:w-1/2 px-3 hidden">
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
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <button
                    className={styles['btn-save']}
                    onClick={
                        async () => {
                            createTransaction({
                                date: date,
                                amount: amount,
                                categoryId: category,
                                type: type,
                                note: note
                            })
                        }
                    }
                    >Save</button>
                    <button className={styles['btn-cancel']} onClick={() => { setCreatingTransaction(false) }}>Cancel</button>
                </div>
            </div>
        </form>) : (
            <div>
                <h3>No category available. Please create a new one.</h3>
                <button className={styles['btn-cancel']} onClick={() => { setCreatingTransaction(false) }}>Cancel</button>
            </div>
        )
    )
}