import {Q} from '@nozbe/watermelondb';
import {database} from '.';
import client from '../apollo/client';
import {LIST_ZELLER_CUSTOMERS} from '../apollo/queries';
import UserModel from './models/UserModel';
import {Role} from '../types/types';

// representation of the raw JSON data we receive from the GraphQL API
interface ApiCustomer {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
}

export const syncData = async () => {
  try {
    // fetch data from the grphQL API
    const {data} = await client.query({
      query: LIST_ZELLER_CUSTOMERS,
    });

    // to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const customersFromAPI: ApiCustomer[] = data.listZellerCustomers.items;

    // Filter out any invalid records from the API
    const validCustomers = customersFromAPI.filter(customer => {
      if (
        !customer.name ||
        !customer.role ||
        !Object.values(Role).includes(customer.role as Role)
      ) {
        console.log(`Filtering out invalid user from API: ID ${customer.id}`);
        return false;
      }
      return true;
    });

    await database.write(async () => {
      const usersCollection = database.collections.get<UserModel>('users');

      // array of ids of validCustomers
      const validCustomerIds = validCustomers.map(c => c.id);

      // fetch all users from db that are also present in validCustomers
      const localUsersFound = await usersCollection
        .query(Q.where('id', Q.oneOf(validCustomerIds)))
        .fetch();

      const localUsersById = new Map(localUsersFound.map(u => [u.id, u]));

      const operations = validCustomers.map(customer => {
        const localUser = localUsersById.get(customer.id);

        // update if customer already exists
        if (localUser) {
          return localUser.prepareUpdate(user => {
            user.name = customer.name!;
            user.email = customer.email;
            user.role = customer.role! as Role;
          });
        }

        return usersCollection.prepareCreate(user => {
          user._raw.id = customer.id;
          user.name = customer.name!;
          user.email = customer.email;
          user.role = customer.role! as Role;
        });
      });

      await database.batch(...operations);
      console.log('Database synchronized successfully (Upsert complete)!');
    });
  } catch (error) {
    console.log('Failed to sync data:', error);
    throw error;
  }
};

interface AddUserParams {
  firstName: string;
  lastName: string;
  email: string | null;
  role: Role;
}

export const addUser = async ({
  firstName,
  lastName,
  email,
  role,
}: AddUserParams) => {
  try {
    await database.write(async () => {
      const usersCollection = database.collections.get<UserModel>('users');
      await usersCollection.create(user => {
        // random Id is generated automatically
        user.name = `${firstName} ${lastName}`;
        user.email = email;
        user.role = role;
      });
    });
    console.log('User added successfully!');
  } catch (error) {
    console.log('Failed to add user:', error);
    throw error;
  }
};
