import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class UserModel extends Model {
  static table = 'users';

  @field('name') name!: string;
  @field('email') email!: string | null;
  @field('role') role!: string;
}
