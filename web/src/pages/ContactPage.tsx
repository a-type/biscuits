import { Button, H1, P, PageContent, PageRoot } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';

export interface ContactPageProps {}

export function ContactPage({}: ContactPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<div className="flex flex-col gap-6 relative px-8">
					<H1>Contact</H1>
					<P>
						Biscuits is kinda just one person! I just like making little apps.
						You&apos;re probably here because you encountered an issue, so get
						in touch with me at{' '}
						<a href="mailto://hi@gnocchi.club" className="font-bold">
							this email address
						</a>{' '}
						and I&apos;ll see what I can do.
					</P>
					<Button asChild className="self-start" color="primary">
						<Link to="/">Go home</Link>
					</Button>
				</div>
			</PageContent>
		</PageRoot>
	);
}

export default ContactPage;
