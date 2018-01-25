$(function() {

  const loggedInUser = ({
    username: username,
    password: password,
    email: email
  });
  let username;
  let email;
  let password;

  $("#logInStatic").click(function() {
    username = $("#loginEmail").val().trim();
    email = $("#loginEmail").val().trim();
    password = $("#loginPass").val().trim();

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

}); // Document Ready End
