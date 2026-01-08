// import yargs from "yargs";
// import { hideBin } from "yargs/helpers";
// import { initRepo } from "./repo/initRepo.js";
// import { addRepo } from "./repo/addRepo.js";

// yargs(hideBin(process.argv))
//   .command("init", "Initialize a new repository", () => {}, async () => {
//     await initRepo();
//   })
//   .command("add <file>", "Add a file to repo", (yargs) => {
//         yargs.positional("file", {
//         describe: "File to add to the repository",
//         type: "string",
//         });
//     }, async (argv) => {
//         await addRepo(argv.file);
//     })
//   .demandCommand(1, "You need at least one command before moving on")
//   .strict()
//   .help().argv;



export { initRepo } from "./repo/initRepo.js";
export { writeObject } from "./objects/writeObject.js";
export { readObject } from "./objects/readObject.js";
export { addRepo } from "./repo/addRepo.js";
export { commitRepo } from "./repo/commitRepo.js";