import { useState, SetStateAction, Dispatch } from 'react';
import { Category } from '../../Models/Category';
import styles from './CategoryManagement.module.css';

type Props = {
    createCategory: CallableFunction;
    setCreatingCategory: CallableFunction;
    userId: number;
};

export default function CategoryManagementCreate({ createCategory, userId, setCreatingCategory }: Props) {
    const [name, setName] = useState<string>('');

    return (
        <form className="w-full mt-4" onSubmit={event => event.preventDefault()}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <input
                        className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="text" value={name}
                        onChange={
                            (event) => setName(event.currentTarget.value)
                        }
                    />
                    <p className="text-gray-600 text-xs">Name</p>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <button
                    className={styles['btn-save']}
                    onClick={
                        async () => {
                            console.log("createCategory");
                            await createCategory({
                                name: name,
                                userId: userId
                            });
                            setCreatingCategory(false); setName('');
                        }
                    }
                    >Save</button>
                    <button className={styles['btn-create']} onClick={()=>{setCreatingCategory(false); setName('');}}>Cancel</button>
                </div>
            </div>
        </form>
    )
}