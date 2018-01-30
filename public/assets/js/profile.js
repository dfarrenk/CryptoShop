$(function() {
   const DEBUG = false;

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
            dataType: "json",
            data: userInfoUpdate
         }).then(function(res) {
            if (!res) {
               throw res;
            }
            console.log(res);
         })
         .catch(function(err) {
            if (err === undefined) {
               return console.log("This is a 304");
            }
            console.log(err);
         });
   });


   var url = "https://" + window.location.hostname + ":4443/api/myOrders";
   $.get(url).done(function(result) {
      DEBUG && console.log("orders list received!");
      DEBUG && console.log(result);
      for (var i = result.length - 1; i >= 0; i--) {

         $("#purchases").prepend(`<tr>
          <td><img src="" />ebay img</td>
          <td>${result[i].ebayId}</td>
          <td>${result[i].amountRecieved}</td>
          <td>${result[i].amountRecieved/12000}</td>
          </tr>`);
      }
   }).catch(console.log.bind(console));
});

//Document Ready End

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
