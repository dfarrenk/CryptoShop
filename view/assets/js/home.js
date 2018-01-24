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
    });
  });

}); // Document Ready End
