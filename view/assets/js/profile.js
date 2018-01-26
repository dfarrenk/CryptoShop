$(function() {

  let userInfo = ({
    firstname: "",
    lastname: "",
    address: {
      addressOne: "",
      addressTwo: "",
      city: "",
      state: "",
      zip: "",
    }
  });

  $("#editUsernameValues").click(function(e) {
    e.preventDefault();
    $("#firstName").attr("readonly", false);
    $("#lastName").attr("readonly", false);
    $("#inputAddress").attr("readonly", false);
    $("#inputAddress2").attr("readonly", false);
    $("#inputCity").attr("readonly", false);
  });

  $("#saveUserUpdates").click(function(e) {
    e.preventDefault();
    $("#firstName").attr("readonly", true);
    $("#lastName").attr("readonly", true);
    $("#inputAddress").attr("readonly", true);
    $("#inputAddress2").attr("readonly", true);
    $("#inputCity").attr("readonly", true);

    userInfo.firstname = $("#firstName").val().trim();
    userInfo.lastname = $("#lastName").val().trim();
    userInfo.address.addressOne = $("#inputAddress").val().trim();
    userInfo.address.addressTwo = $("#inputAddress2").val().trim();
    userInfo.address.city = $("#inputCity").val().trim();
    userInfo.address.state = $("#inputState").val().trim();
    userInfo.address.zip = $("#inputZip").val().trim();

    console.log(userInfo);

    $.ajax({
      url: "/api/user",
      method: "PUT",
      data: userInfo
    });
  });

  $("#editEmailBtn").click(function(e) {
    e.preventDefault();
    $("#editEmail").attr("readonly", false);
  });

  $("#editPassBtn").click(function(e) {
    e.preventDefault();
    $("#editPass").attr("readonly", false);
  });

  // let editUserEmail;
  // let editUserPass;

  // $("#emailSave").click(function(e) {
  //   e.preventDefault();
  //   let editUserEmail = $("#editEmail").val().trim();

  //   $("#passConfirm").modal();
  // });

  // $("#passSave").click(function(e) {
  //   e.preventDefault();
  //   let editUserPass = $("#editPass").val().trim();
  //   $("#passConfirm").modal();
  // });

  // let passConfirm;

  $(".saveInfo").click(function(e) {
    e.preventDefault();
    $("#passConfirm").modal();
  });

  $("#passConfirmSave").click(function(e) {
    e.preventDefault();
    let newEmail = $("#editEmail").val().trim();
    let newPass = $("#editPass").val().trim();
    let url = "/user/changePass";

    const userInfoUpdate = ({
      password: $("#passConfirmation").val().trim(),
      newpassword: newPass
    });

    if (newEmail) {
      userInfoUpdate.email = newEmail;
      delete userInfoUpdate.newpassword;
      url = "/user/changeEmail";
    }
    console.log(userInfoUpdate);
    $.ajax({
      method: "PUT",
      url,
      data: userInfoUpdate
    }).then(function(res) {
      console.log(res);
    });
  });



  // $("#editBillingValues").click(function(e) {
  //   e.preventDefault();
  //   $("#billingFirstName").attr("readonly", false);
  //   $("#billingLastName").attr("readonly", false);
  //   $("#inputBillingAddress").attr("readonly", false);
  //   $("#inputBillingAddress2").attr("readonly", false);
  //   $("#inputBillingCity").attr("readonly", false);
  // });


  // $("#saveBillingUpdates").click(function(e) {
  //   e.preventDefault();
  //   $("#billingFirstName").attr("readonly", true);
  //   $("#billingLastName").attr("readonly", true);
  //   $("#inputBillingAddress").attr("readonly", true);
  //   $("#inputBillingAddress2").attr("readonly", true);
  //   $("#inputBillingCity").attr("readonly", true);
  // });






});
//Document Ready End
