import { GroceriesActionBar } from '@/components/groceries/actions/GroceriesActionBar.jsx';
import { GroceryListAdd } from '@/components/groceries/addBar/GroceryListAdd.jsx';
import GroceryList from '@/components/groceries/GroceryList.jsx';
import { useListThemeClass } from '@/components/groceries/lists/hooks.js';
import { hooks } from '@/stores/groceries/index.js';
import { PageContent, PageFixedArea, PageRoot } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';
import classNames from 'classnames';
import { ReactNode, Suspense, useEffect } from 'react';

export const TopControls = ({
	children,
	...props
}: {
	children: ReactNode;
}) => (
	<div
		className="w-full flex flex-row justify-between items-center gap-2 p-2 mt-1"
		{...props}
	>
		{children}
	</div>
);

export const ListSelectWrapper = ({
	children,
	...props
}: {
	children: ReactNode;
}) => (
	<div className="flex flex-row items-center gap-2 pl-1" {...props}>
		<Suspense fallback={<div className="h-28px w-full" />}>{children}</Suspense>
	</div>
);

export const MainActions = () => {
	return (
		<PageFixedArea className="flex flex-col gap-2 px-3 py-2">
			<Suspense fallback={<div className="w-full h-41px hidden md:flex" />}>
				<GroceryListAdd className="hidden md:flex" />
			</Suspense>
			<Suspense>
				<GroceriesActionBar />
			</Suspense>
		</PageFixedArea>
	);
};

export const List = () => (
	<Suspense>
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
		<Suspense fallback={<PageRoot>{children}</PageRoot>}>
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
				className={classNames('md:mt-lg', className, theme)}
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
