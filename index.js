const run = async () => {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    return console.error(`two arguments expected, ${args.length} provided.`);
  }

  const { main } = await import('./src/main.js');

  await main({
    in: args[0],
    out: args[1],
    encoding: 'utf-8',
  });
}

await run();
