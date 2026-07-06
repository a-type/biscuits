import { withClassName } from '@a-type/ui';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import cls from './TitleAndImageLayout.module.css';

export const TitleAndImageLayout = withClassName('div', cls.root);

export const TitleContainer = withClassName('div', cls.title);

export const ImageContainer = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	return <div className={classNames(cls.image, className)} {...props} />;
};
