import atype from '@a-type/ui/uno-preset';
import { UserConfig } from 'unocss';

const config: UserConfig;

export default config;

export const contentConfig: UserConfig['content'];

export function withOptions(options: Parameters<typeof atype>[0]): UserConfig;
