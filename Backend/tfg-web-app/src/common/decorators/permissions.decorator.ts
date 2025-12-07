import { SetMetadata } from '@nestjs/common';
import { RolePermissions } from '../constants/roles';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: (keyof RolePermissions)[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
