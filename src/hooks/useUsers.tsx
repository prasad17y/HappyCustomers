import {useState, useEffect} from 'react';
import {Q, type Query} from '@nozbe/watermelondb';
import {database} from '../db';
import UserModel from '../db/models/UserModel';
import {UserType, Role} from '../types/types';

// queries the database, and subscribes to changes
export const useUsers = (roleFilter?: Role) => {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const usersCollection = database.collections.get<UserModel>('users');
    let query: Query<UserModel>;

    if (roleFilter) {
      query = usersCollection.query(
        Q.sortBy('name', Q.asc),
        Q.where('role', roleFilter),
      );
    } else {
      query = usersCollection.query(Q.sortBy('name', Q.asc));
    }

    const subscription = query.observe().subscribe(latestUserModels => {
      const usersList: UserType[] = latestUserModels.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      setUsers(usersList);
    });

    return () => subscription.unsubscribe();
  }, [roleFilter]);

  return users;
};
