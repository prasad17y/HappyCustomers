import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'email', type: 'string', isOptional: true},
        {name: 'role', type: 'string'},
        // indexed column for case-insensitive sorting
        {name: 'sortable_name', type: 'string', isIndexed: true},
      ],
    }),
  ],
});
