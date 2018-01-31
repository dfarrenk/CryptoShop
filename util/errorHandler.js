module.exports = function() {
   process.on("unhandledRejection", (reason, p) => {
      console.log("Unhandled Rejection at:", p, "reason:", reason);
   });

   process.on("unhandledException", (reason, p) => {
      console.log("Unhandled Rejection at:", p, "reason:", reason);
      process.exitCode(1);
   });
}