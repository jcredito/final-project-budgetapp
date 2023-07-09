import { sql } from './connect';
import { cache } from 'react';
import {Category} from '../app/Models/Category'

export const getCategoriesForUser = cache(async (user_id: number) => {
  const categories = await sql<Category[]>`
  SELECT
  *
FROM
categories c
WHERE c."user_id" = ${user_id}
  `;
  
  return categories;
});

export const createCategory = cache(
  async (
    userId: number,
    name: string
  ) => {
    const [category] = await sql<Category[]>`
  INSERT INTO categories
  (user_id, name)
  VALUES (${userId}, ${name})
  RETURNING *
  `;

    return category;
  },
);

export const updateCategoryById = cache(
  async (
    categoryId: number,
    name: string
  ) => {
    const [category] = await sql<Category[]>`
  UPDATE categories
  SET
  name = ${name}
  WHERE id = ${categoryId}
  RETURNING *
  `;
    return category;
  },
);