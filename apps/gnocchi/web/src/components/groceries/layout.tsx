import { GroceriesActionBar } from '@/components/groceries/actions/GroceriesActionBar.jsx';
import { GroceryListAdd } from '@/components/groceries/addBar/GroceryListAdd.jsx';
import GroceryList from '@/components/groceries/GroceryList.jsx';
import { useListThemeClass } from '@/components/groceries/lists/hooks.js';
import { hooks } from '@/stores/groceries/index.js';
import { PageContent, PageFixedArea } from '@a-type/ui';
import { useNavigate } from '@tanstack/react-router';
import classNames from 'classnames';
import { ReactNode, Suspense, useEffect } from 'react';
import cls from './layout.module.css';

export const TopControls = ({
	children,
	...props
}: {
	children: ReactNode;
}) => (
	<div className={cls.topControls} {...props}>
		{children}
	</div>
);

export const ListSelectWrapper = ({
	children,
	...props
}: {
	children: ReactNode;
}) => (
	<div className={cls.listSelectWrapper} {...props}>
		<Suspense fallback={<div className={cls.listSelectPlaceholder} />}>
			{children}
		</Suspense>
	</div>
);

export const MainActions = () => {
	return (
		<PageFixedArea className={cls.mainActions}>
			<Suspense fallback={<div className={cls.addPlaceholder} />}>
				<GroceryListAdd className={cls.add} />
			</Suspense>
			<Suspense>
				<GroceriesActionBar />
			</Suspense>
		</PageFixedArea>
	);
};

export const List = () => (
	<Suspense fallback={<div>LIST LOADING</div>}>
		<GroceryList />
	</Suspense>
);

export function ThemedPageContent({
	children,
	listId,
	className,
}: {
	children: ReactNode;
	listId: string | null | undefined;
	className?: string;
}) {
	return (
		<Suspense fallback={<PageContent>{children}</PageContent>}>
			<ThemedPageContentInner listId={listId} className={className}>
				{children}
			</ThemedPageContentInner>
		</Suspense>
	);
}

function ThemedPageContentInner({
	children,
	listId,
	className,
}: {
	children: ReactNode;
	listId: string | null | undefined;
	className?: string;
}) {
	const theme = useListThemeClass(listId);

	return (
		<Suspense fallback={children}>
			<PageContent
				gap="none"
				p="none"
				className={classNames(cls.pageContent, className, theme)}
				id="page-content"
			>
				{children}
			</PageContent>
		</Suspense>
	);
}

function UnknownListRedirectInner({ listId }: { listId: string }) {
	const list = hooks.useList(listId);
	const navigate = useNavigate();

	useEffect(() => {
		if (!list) {
			navigate('/');
		}
	}, [list, navigate]);

	return null;
}

export function UnknownListRedirect({ listId }: { listId?: string | null }) {
	if (!listId) return null;
	return (
		<Suspense>
			<UnknownListRedirectInner listId={listId} />
		</Suspense>
	);
}
