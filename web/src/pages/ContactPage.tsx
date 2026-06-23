import { Box, Button, Heading, P, PageContent, PageRoot } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import classes from './ContactPage.module.css';

export interface ContactPageProps {}

export function ContactPage({}: ContactPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<Box col gap="lg">
					<Heading emphasis="primary">Contact</Heading>
					<P>
						Biscuits is kinda just one person! I just like making little apps.
						You&apos;re probably here because you encountered an issue, so get
						in touch with me at{' '}
						<a href="mailto://hi@gnocchi.club" className={classes.link}>
							this email address
						</a>{' '}
						and I&apos;ll see what I can do.
					</P>
					<Button
						render={<Link to="/" />}
						style={{ alignSelf: 'start' }}
						emphasis="primary"
					>
						Go home
					</Button>
				</Box>
			</PageContent>
		</PageRoot>
	);
}

export default ContactPage;
