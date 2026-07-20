import { FloorplanRenderer } from '@/components/floorplans/FloorplanRenderer.jsx';
import { useParams } from '@biscuits/client';

const FloorPage = () => {
	const { floorId } = useParams({ from: '/floors/$floorId' });

	return <FloorplanRenderer className="h-full w-full" id={floorId} />;
};

export default FloorPage;
