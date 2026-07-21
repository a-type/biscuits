import { FloorplanRenderer } from '@/components/floorplans/FloorplanRenderer.jsx';
import { useParams } from '@tanstack/react-router';

const FloorPage = () => {
	const { floorId } = useParams({ from: '/floors/$floorId' });

	return <FloorplanRenderer className="h-full w-full" id={floorId} />;
};

export default FloorPage;
