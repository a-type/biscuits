import { FloorplanRenderer } from '@/components/floorplans/FloorplanRenderer.jsx';
import { PageRoot } from '@a-type/ui';
import { useParams } from '@verdant-web/react-router';

const FloorPage = () => {
	const { floorId } = useParams<{ floorId: string }>();

	return (
		<PageRoot>
			<FloorplanRenderer className="w-full h-full" id={floorId} />
		</PageRoot>
	);
};

export default FloorPage;
