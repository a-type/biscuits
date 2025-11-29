import { FloorplanRenderer } from '@/components/floorplans/FloorplanRenderer.jsx';
import { useParams } from '@verdant-web/react-router';

const FloorPage = () => {
	const { floorId } = useParams<{ floorId: string }>();

	return <FloorplanRenderer className="w-full h-full" id={floorId} />;
};

export default FloorPage;
