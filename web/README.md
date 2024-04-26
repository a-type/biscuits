![biscuits banner image](/web/public/og-image.png)

A suite of local-first apps, all using the same account, sync, and sharing.

Use any app for free, forever. Upgrade for device sync, collaboration, and special features.

## Apps

- `apps/gnocchi` | [Gnocchi](https://gnocchi.club): Organize your weekly groceries, save your favorite recipes, and collaborate on shopping and cooking.
- `apps/trip-tick` | [Trip Tick](https://trip-tick.biscuits.club): A smarter checklist for your next trip. Assemble your packing list from rules you set up once.

## How it's made

I'm using [🌿 Verdant](https://verdant.dev) to power the local-first app experiences.

The server (`/server`) is used for syncing, and also user and subscription management. It runs on a simple SQLite database.

There's also a general GraphQL API for powering server-based features for subscribers. (`/server/src/graphql`).

Apps interact with the core platform via a simple client layer (`/packages/client`).
