$(function() {

  let username;
  let email;
  let password;

  $("#logInStatic").click(function(e) {
    e.preventDefault();
    username = $("#loginEmail").val().trim();
    // email = $("#loginEmail").val().trim();
    password = $("#loginPass").val().trim();

    const loggedInUser = ({
      username: username,
      password: password,
    });

    if (username.match(/(.*?@[a-z]+\.[a-z]+)+$/g)) {
      console.log("it's email format");
      loggedInUser.email = username;
      delete loggedInUser.username;
    }

    $.post({
      url: "/login",
      data: loggedInUser
    }).then((response) => {
      console.log(response);
      tokenSession(response.token).then(getMainPage);
    }).catch(console.log.bind(console));
  });

  function tokenSession(token) {
    sessionStorage.setItem("token", token);
    return Promise.resolve(token);
  }

  function getMainPage(token) {
    $.ajax({
      method: "GET",
      url: "/user"
    }).then((res) => {
      console.log("authorized");
      location.assign("./profile.html");
    }).catch(console.log.bind(console));
  }

  $("#registerStatic").click(function(e) {
    username = $("#signUpUsername").val().trim();
    email = $("#signUpEmail").val().trim();
    password = $("#signUpPass").val().trim();

    const loggedInUser = ({
      username: username,
      password: password,
      email: email
    });

    $.post({
      url: "/register",
      data: loggedInUser
    }).then((response) => {
      console.log(response);
      tokenSession(response.token).then(getMainPage);
    }).catch(console.log.bind(console));
  });


  $(".signOutStatic").click(function(e) {
    e.preventDefault();
    console.log("posting");
    $.post({
      url: "/logout"
    }).then(function(res) {
      console.log(res);
      location.assign(res);
    }).catch(err => {
      console.log("If you are looking at this..means that you are not signed in");
      console.log(err);
      const { status, responseJSON: error } = err;
      const errmsg = error.message;
      $("#errmsg").text(errmsg);
      $("#error").modal();
      location.reload();
    });
  });
}); // Document Ready End
