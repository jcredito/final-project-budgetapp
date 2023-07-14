'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Category } from '../../Models/Category';
import styles from './CategoryManagement.module.css';
import CategoryManagementCreate from './CategoryManagementCreate';
import CategoryManagementItem from './CategoryManagementItem';

type Props = {
  categories: Category[];
  userId: number;
  refreshCategories: CallableFunction;
};

export default function CategoryManagement({
  userId,
  categories,
  refreshCategories,
}: Props) {
  const [managingCategories, setManagingCategories] = useState<boolean>(false);
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);
  const [categoriesManagement, setCategoriesManagement] =
    useState<Category[]>(categories);

  async function createCategory(category: Category) {
    const response = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        userId: category.userId,
        name: category.name,
      }),
    });
    const data = await response.json();
    setCategoriesManagement([...categories, data.category]);
    await refreshCategories([...categories, data.category]);
  }

  async function updateCategory(category: Category) {
    if (category.id) {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: category.name,
        }),
      });
      const data = await response.json();
      const updatedCategories = categories.map((category) => {
        if (category.id === data.category.id) {
          return data.category;
        }
        return category;
      });
      setCategoriesManagement(updatedCategories);
      await refreshCategories(updatedCategories);
    }
  }

  return (
    <div className="m-50 px-28 bg-gray-100">
      {!managingCategories && (
        <div className="px-4 py-4 flex flex-row-reverse">
          <button
            className={styles['btn-create']}
            onClick={() => {
              setManagingCategories(true);
            }}
          >
            Manage Categories
          </button>
        </div>
      )}
      {managingCategories && (
        <div className="py-4">
          <div className="flex justify-between border-b-2 py-2 mb-2 px-4 bg-white">
            <h3 className="font-bold">Category Management</h3>
            <button
              onClick={() => {
                setManagingCategories(false);
              }}
              className={styles['btn-cancel']}
            >
              close
            </button>
          </div>
          {!creatingCategory && (
            <div className="py-2">
              <button
                className={styles['btn-create']}
                onClick={() => {
                  setCreatingCategory(true);
                }}
              >
                Create Category
              </button>
            </div>
          )}
          {creatingCategory && (
            <div>
              <h3>New Category</h3>
              <CategoryManagementCreate
                createCategory={createCategory}
                setCreatingCategory={setCreatingCategory}
                userId={userId}
              />
            </div>
          )}
          {categoriesManagement.length > 0 && (
            <div>
              <table className={styles['table']}>
                <thead>
                  <tr>
                    <th className={styles['table-title']}>Name</th>
                    <th className={styles['table-title']}></th>
                  </tr>
                </thead>
                <tbody className={styles['table-body']}>
                  {categoriesManagement.map((category) => {
                    return (
                      <CategoryManagementItem
                        category={category}
                        userId={userId}
                        updateCategory={updateCategory}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {categoriesManagement.length === 0 && (
            <div className="flex items-center justify-center">
              <Image
                src={'/images/empty-folder.png'}
                width={250}
                height={250}
                alt="Empty"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
