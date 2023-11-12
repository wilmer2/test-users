import { UserResponse } from './user-response.interface';

export interface User extends Omit<UserResponse, 'address'> {}
