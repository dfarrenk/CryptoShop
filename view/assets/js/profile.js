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
