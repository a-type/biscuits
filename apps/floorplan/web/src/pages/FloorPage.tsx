import { FloorplanRenderer } from '@/components/floorplans/FloorplanRenderer.jsx';
import { useParams } from '@verdant-web/react-router';

const FloorPage = () => {
	const { floorId } = useParams<{ floorId: string }>();

	return <FloorplanRenderer className="h-full w-full" id={floorId} />;
};

export default FloorPage;
