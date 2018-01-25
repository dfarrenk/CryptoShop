module.exports = function(options) {
   const Context = {
      imageLinks: [
         "https://media.giphy.com/media/3ohzAs4mteOGOJvw5O/giphy.gif",
         "https://media.giphy.com/media/xT0xeCZiDf2TUJ6mGs/source.gif",
         "https://media.giphy.com/media/H34dW1FHF4JmE/giphy.gif",
         "https://media.giphy.com/media/5wWf7HapUvpOumiXZRK/giphy.gif",
         "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif",
         "https://media.giphy.com/media/oa3RwJngHrivu/giphy.gif",
         "https://media.giphy.com/media/1077cM08hUSmFa/giphy.gif"
      ],
      routes: [
         "/login/email_verification?u=" + options.username + "&p=" + options.password,
         "/login?challenger=" + options.challenger_id + "&instance=" + options.instance_id, /*+ "&challenge_id=" + options.challenge_id*/
         "/login",
         "/login",
         "/login",
         "/login",
         "/login"
      ],
      subjects: [
         "Verify your email and start challenging today!!",
         "You've been challenged.",
         "Challenge accepted!!",
         "Time to look at the result",
         "Congratulations, you've completed the Challenge!!!",
         "Challenge rejected :(",
         "Proof rejected"
      ],
      linktext: [
         "Click me to verify",
         "Click to know more about the challenge",
         "View your challenge board",
         "View your challenge board",
         "Start challenging now",
         "Challenge another",
         "Try another challenge"
      ],
      flag_name: [
         "email_verification.html",
         "email_chalrecipient.html",
         "email_chalaccepted.html",
         "email_proofsub.html",
         "email_proofaccept.html",
         "email_chalrejected.html",
         "email_proofrejected.html"
      ]
   };

   return Context;
}