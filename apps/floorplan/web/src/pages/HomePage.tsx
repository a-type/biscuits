import { useInitialFloorId } from '@/hooks/useLastFloorId.js';
import { PageRoot } from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	const initialFloor = useInitialFloorId();
	const navigate = useNavigate();
	useEffect(() => {
		if (initialFloor) {
			navigate(`/floors/${initialFloor}`);
		}
	}, [initialFloor, navigate]);
	return <PageRoot>...</PageRoot>;
}

export default HomePage;
