$(function() {


  $("#editUsernameValues").click(function(e) {
    e.preventDefault();
    $("#inputUsername").attr("readonly", false);
    $("#inputPass").attr("readonly", false);
    $("#firstName").attr("readonly", false);
    $("#lastName").attr("readonly", false);
    $("#inputAddress").attr("readonly", false);
    $("#inputAddress2").attr("readonly", false);
    $("#inputCity").attr("readonly", false);
  });


  $("#editBillingValues").click(function(e) {
    e.preventDefault();
    $("#billingFirstName").attr("readonly", false);
    $("#billingLastName").attr("readonly", false);
    $("#inputBillingAddress").attr("readonly", false);
    $("#inputBillingAddress2").attr("readonly", false);
    $("#inputBillingCity").attr("readonly", false);
  });


  $("#saveUserUpdates").click(function(e) {
    e.preventDefault();
    $("#inputUsername").attr("readonly", true);
    $("#inputPass").attr("readonly", true);
    $("#firstName").attr("readonly", true);
    $("#lastName").attr("readonly", true);
    $("#inputAddress").attr("readonly", true);
    $("#inputAddress2").attr("readonly", true);
    $("#inputCity").attr("readonly", true);
  })

  $("#saveBillingUpdates").click(function(e) {
    e.preventDefault();
    $("#billingFirstName").attr("readonly", true);
    $("#billingLastName").attr("readonly", true);
    $("#inputBillingAddress").attr("readonly", true);
    $("#inputBillingAddress2").attr("readonly", true);
    $("#inputBillingCity").attr("readonly", true);
  });




});
//Document Ready End
