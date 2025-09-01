import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {mySchema} from './schema';
import UserModel from './models/UserModel';

const adapter = new SQLiteAdapter({
  schema: mySchema,
});

export const database = new Database({
  adapter,
  modelClasses: [UserModel],
});
