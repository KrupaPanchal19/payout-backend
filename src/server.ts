import { connect_db } from "./config/db";
import { env } from "./config/env";
import { build_app } from "./app";

async function main() {
  await connect_db();
  const app = build_app();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on :${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

