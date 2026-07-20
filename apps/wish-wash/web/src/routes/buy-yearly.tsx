import BuyYearlyPage from '@/pages/BuyYearlyPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/buy-yearly')({
	component: BuyYearlyPage,
});
