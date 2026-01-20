import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./repo/initRepo.js";
import { addRepo } from "./repo/addRepo.js";
import { pullRepo } from "./repo/pullRepo.js";
import { pushRepo } from "./repo/pushRepo.js";
import { setRemote } from "./repo/setRemote.js";
import { commitRepo } from "./repo/commitRepo.js";

yargs(hideBin(process.argv))
  .command("init", "Initialize a new repository", () => {}, async () => {
    await initRepo(process.cwd());
  })
  .command("add <file>", "Add a file to repo", (yargs) => {
        yargs.positional("file", {
        describe: "File to add to the repository",
        type: "string",
        });
    }, async (argv) => {
        await addRepo(process.cwd(), argv.file);
    })
    .command("commit <message>", "Commit changes to repo", (yargs) => {
        yargs.positional("message", {
        describe: "Commit message",
        type: "string",
        });
    }, async (argv) => {
        await commitRepo(process.cwd(), argv.message, "Default Author");
    })
  .command("pull", "Pull changes from remote repository", () => {}, async () => {
    await pullRepo();
  })
  .command("push", "Push changes to remote repository", () => {}, async () => {
    await pushRepo();
  })
  .command("set-remote <url>", "Set the remote repository URL", (yargs) => {
        yargs.positional("url", {
        describe: "URL of the remote repository",
        type: "string",
        });
    }, async (argv) => {
        await setRemote(argv.url);
    })
  .demandCommand(1, "You need at least one command before moving on")
  .strict()
  .help().argv;



// export { initRepo } from "./repo/initRepo.js";
// export { writeObject } from "./objects/writeObject.js";
// export { readObject } from "./objects/readObject.js";
// export { addRepo } from "./repo/addRepo.js";
// export { commitRepo } from "./repo/commitRepo.js";