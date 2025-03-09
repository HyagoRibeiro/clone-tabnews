import database from "infra/database";
import { ServiceError } from "infra/errors";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function runMigrations({ dryRun } = { dryRun: true }) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun,
      migrationsTable: "pgmigrations",
    });
    return pendingMigrations;
  } catch (error) {
    throw new ServiceError({
      message: "Falha ao executar migrations",
      cause: error,
    });
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations: runMigrations,
  runPendingMigrations: () => runMigrations({ dryRun: false }),
};

export default migrator;
