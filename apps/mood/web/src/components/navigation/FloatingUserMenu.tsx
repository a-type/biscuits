import { withClassName } from '@a-type/ui';
import { UserMenu } from '@biscuits/client/apps';
import cls from './FloatingUserMenu.module.css';

export const FloatingUserMenu = withClassName(UserMenu, cls.root);
