import { useState, SetStateAction, Dispatch } from 'react';
import { Category } from '../../Models/Category';
import styles from './CategoryManagement.module.css';

type Props = {
    category: Category;
    setEditingCategory: CallableFunction;
    userId: number;
    updateCategory: CallableFunction;
};

export default function CategoryManagementEdit({ userId, setEditingCategory, category, updateCategory }: Props) {
    const [name, setName] = useState<string>(category.name);

    return (
        <tr>
            <td colSpan={2}>
            <form className="w-full mt-4 px-2" onSubmit={event => event.preventDefault()}>
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
                            await updateCategory({
                                ...category, name: name
                            });
                            setEditingCategory(false); setName('');
                        }
                    }
                    >Save</button>
                    <button className={styles['btn-create']} onClick={()=>{setEditingCategory(false); setName('');}}>Cancel</button>
                </div>
            </div>
        </form>
            </td>
        </tr>
    )
}