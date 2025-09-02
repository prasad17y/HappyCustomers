import {useState, useEffect} from 'react';
import {Q} from '@nozbe/watermelondb';
import {database} from '../db';
import UserModel from '../db/models/UserModel';
import {UserType, Role} from '../types/types';

// queries the database, and subscribes to changes
export const useUsers = (roleFilter?: Role, searchQuery?: string) => {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const usersCollection = database.collections.get<UserModel>('users');
    const queryConditions: any[] = [Q.sortBy('name', Q.asc)];

    // Add role filter
    if (roleFilter) {
      queryConditions.push(Q.where('role', roleFilter));
    }

    // Add search filter
    if (searchQuery && searchQuery.trim().length > 0) {
      const sanitizedQuery = searchQuery.trim();
      // Case-insensitive search for names that start with the query
      queryConditions.push(
        Q.where('name', Q.like(`${Q.sanitizeLikeString(sanitizedQuery)}%`)),
      );
    }

    const query = usersCollection.query(...queryConditions);

    const subscription = query.observe().subscribe(latestUserModels => {
      const userTypes: UserType[] = latestUserModels.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
      setUsers(userTypes);
    });

    return () => subscription.unsubscribe();
  }, [roleFilter, searchQuery]); // Rerun if filter or search changes

  return users;
};
