//import { Meta } from '../layout/Meta';
'use client';

import { useState } from 'react';
import { RegisterResponseBodyPost } from '../../api/(auth)/register/route';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <>
      <div className="mt-52 p-6 flex items-center justify-center">
        <div className="max-w-xs">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                placeholder="E-mail"
                //3. set the value
                value={email}
                //2. set the username
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </div>
            <div className="mb-6">
              {/* <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Reinsert Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={reInsertPassword}
                onChange={(event) =>
                  setReInsertPassword(event.currentTarget.value)
                }
              /> */}
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                // 1.fetch from api, after json.stringify u get the object with a controlled component (usestate)
                onClick={async () => {
                  const response = await fetch('/api/register', {
                    method: 'POST',
                    body: JSON.stringify({
                      email,
                      username,
                      password,
                      // reInsertPassword,
                    }),
                  });

                  const data: RegisterResponseBodyPost = await response.json();
                }}
              >
                Register
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2023 BudgetApp Corp. All rights reserved.
          </p>
        </div>
      </div>
      {/**
       * @TODO: Registration page
       */}
    </>
  );
}
