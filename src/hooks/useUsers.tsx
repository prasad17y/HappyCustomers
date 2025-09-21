import {useState, useEffect} from 'react';
import {Q} from '@nozbe/watermelondb';
import {database} from '../db';
import UserModel from '../db/models/UserModel';
import {UserType, Role} from '../types/types';

interface UseUsersResult {
  users: UserType[] | undefined;
  error: Error | undefined;
}

export const useUsers = (
  roleFilter?: Role,
  searchQuery?: string,
  isEnabled: boolean = true,
): UseUsersResult => {
  const [users, setUsers] = useState<UserType[] | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    setError(undefined);

    const usersCollection = database.collections.get<UserModel>('users');
    const queryConditions: any[] = [Q.sortBy('sortable_name', Q.asc)];

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

    const subscription = query.observe().subscribe({
      next: latestUserModels => {
        const userTypes: UserType[] = latestUserModels.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }));
        setUsers(userTypes);
      },
      error: err => {
        console.error('Error in useUsers subscription:', err);
        setError(err);
      },
    });

    return () => subscription.unsubscribe();
  }, [roleFilter, searchQuery, isEnabled]);

  return {users, error};
};
