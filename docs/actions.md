# Actions

Actions are what connects the frontend to the backend. They are functions that are invoced when a user either requests data, or performs an action that requires a response from the backend.

All actions are defined in the `frontend/src/actions` directory. All actions have two things in common:

1. They all have a function that defines _how_ the action sends the request, and processes the response.
2. They all have a function to allow the frontend to call the action _client-side_

## Creating new actions

Before creating a new action, you first have to identify if the action should _get_ someting or _modify_ something.

- **Getters**

  Getters are actions that retrieve data from the backend, and are usually always GET-functions. Getters do not modify any data.

- **Mutators**

  Mutators are actions that modify data on the backend. This can be anything from creating a new user, to deleting a file.

#### 1. Define how the action sends the request

Create a new function for defining the action. This function should be named after the action, such as `getUser` or `createUser`.

The function _must_ take in a `FetchFunction` as one of its arguments. This is because the action can both be called from client-side or server-side. By default this function is set to `Fetch`, imported from `frontend/src/utils/fetch`. This function is a server side fetch wrapper, meaning that the default actions behavior is always server-side.

Example:

```javascript

export const getUser = async (userId: number, fetcher: FetchFunction = Fetch): Promise<User>{
    return await fetcher<User>(`/api/user/${userId}`, {
        method: 'GET',
    });
}

```

#### 2. Define how the action is called client-side

Create a new function for calling the action client-side. This function should be named after the action, such as `useUser` or `useCreateUser`.

Now it becomes important to note if the action is a getter or mutator. If the action is a getter, you should use `useQuery`, and if the action is a mutator, you should use `useMutation`, both from `react-query`. These functions are used to handle the state of the action, such as loading, error, and success states. They also handle caching and refetching of data.

Continuing from the previous example, the `useUser` function would look like this:

```javascript

export const useUser = (userId: number) => {
    const fetcher = useFetch();

    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUser(userId, fetcher),
    });
}

```

We see that this function, although simple, has a few things to note:

- we get a client side fetch function from the `useFetch` hook. This hook automatically sets up a fetch function with proper authentication headers.
- we use `useQuery` to handle the state of the action. This function takes in a query key, which is used to identify the query, and a query function, which is the action we defined earlier.
- we use the `queryKey` to identify the query. This is important for caching and refetching data. The query key is an array, where the first element is the name of the query, and the second element is the userId. This means that if we call `useUser(1)` and `useUser(2)`, they will be cached separately.
- we use the `queryFn` to call the action we defined earlier. This is the function that actually sends the request to the backend.

#### 3. Defining types

For many queries, you might need special types for both sending requests and receiving responses. You can define these types under either `frontend/src/types/apiRequests` or `frontend/src/types/apiResponses`. The types should be named after the action, such as `GetUserRequest` or `CreateUserResponse`.

#### 4. Using the action

Now that we have defined the action, we can use it in our components. To do this, we simply call the `useUser` function, and pass in the userId. This will return an object with the following properties:

- `data`: the data returned from the action. This will be `undefined` if the action is still loading or has errored.
- `isPending`: a boolean that indicates if the action is still loading.
- `isError`: a boolean that indicates if the action has errored.
- `error`: the error object returned from the action. This will be `undefined` if the action is still loading or has not errored.

This is how we can use the action in a component:

```javascript
import { useUser } from "../actions/userActions";

export default function UserComponent({ userId }) {
  const { data, isPending, isError, error } = useUser(userId);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

If we need to use the server side action, we need no extra steps. We can simply call the action directly, and pass in the fetch function. This is how we can use the action in a server side component:

```javascript
import { getUser } from "../actions/userActions";

export default async function UserComponent({ userId }) {
  const user = await getUser(userId);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

Which one to use depends on the use case. If you need advanced features such as query invalidation, refetching or caching, you should use the client side action. In almonst every single other case, the server side action is the way to go. This is because the server itself can start fetching data before the page is sent to the client, meaning that the data is already available when the page is rendered. You will however, need to define a `loading.tsx` component or a suspense boundry, to display a loading state while the data is being fetched. Read more about this in the [nextjs documentation](https://nextjs.org/docs/app/getting-started/fetching-data#streaming).
