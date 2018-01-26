// AJAX Get request to pull item ID from listings for crypto purchase on backend
$(document).on("click", ".buyItNow", function() {
  var data = $(event.target).attr("value");
  console.log("Clicked:"+data);
  $("#buyItNowModal").modal();

  //price
  $("#modalPrice").text($(event.target).parent().find("p").text());
  //image
  $("#modalImg").attr("src", $(event.target).parent().parent().find("img").attr("src"));
  //title
  $("#modalName").text($(event.target).parent().find(".card-title").text());
  $("#placeOrderBtn").attr("data-id", $(event.target).attr("data-id"))
});



$(function() {

  $(document).ajaxStart(function() {
    $(".loader").css("display", "block");
  });

  $(document).ajaxComplete(function() {
    $(".loader").css("display", "none");
  });

  let searchTerm = searchToObject();
  searchTerm = searchTerm.item;

  $("#searchBtn").click(function(e) {
    e.preventDefault();
    searchTerm = $("#searchBar").val().trim();
    console.log(searchTerm);
    $("#productMaster div").empty();
    // walmartAPI(searchTerm);
    ebayAPI(searchTerm).then(function(data) {
      $(".showEbay").collapse();
      // $("#hideMeOnSearch").toggle("hide");

    });
  });


  if (typeof searchTerm !== 'undefined') {
    // walmartAPI(searchTerm);
    $("#productMaster div").empty();
    ebayAPI(searchTerm).then(function(data) {
      $(".showEbay").collapse();
      // $("#hideMeOnSearch").toggle("hide");
    });
  }

  //TODO run a search with searchQuery.item
  //TODO replace iphone with text from search field

  function searchToObject() {
    var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

    for (i in pairs) {
      if (pairs[i] === "") continue;

      pair = pairs[i].split("=");
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return obj;
  }

  $("#homeSearch").click(function(e) {
    e.preventDefault();

    // TODO get string from search bar
    let searchQuery = $("#searchBar").val().trim();

    $.get("/search/" + searchQuery)
    .done(function(res) {
      console.log(res);
      location.assign(res).done(function() {});
    });
  });

  //Function to make Ebay API call and Display Results
  function ebayAPI(searchTerm) {
    return new Promise((resolve, reject) => {
      var key = "VitaliyV-CryptoSh-SBX-610683bd3-3a4db4d6";
      var url = "https://localhost:4443/find/"+searchTerm;

      $.get(url).done(function(result) {
        console.log(result);

        try {
          result[0].itemId;
        }
        catch (err) {
          if (err) {
            console.log(err);
            $("#productDisplay").html("<h3>No goods found</h3>");
            return 1;
          }
        }
        for (var i = 0; i < 10; i++) {
          let imageUrl;
          if(result[i].image){
            imageUrl = result[i].image.imageUrl;
          }else{
            imageUrl = "http://via.placeholder.com/350x150";
          }
          var newCard =
          $("<div class='col collapse multi-collapse showEbay' style='min-width: 14rem; max-width: 16rem; margin: 2%;'>" +
            "<div class='card card-size'>" +
            "<img class'card-img-top' src='" + imageUrl + "'>" +
            "<div class='card-body'>" +
            "<h6 class='card-title'>" + result[i].title + "</h6>" +
            "<p class='card-text price'>" + "$" + result[i].price.value + "</p>" +
            "<a class='card-text' href='" + result[i].itemWebUrl + "' target='_blank'>View on eBay</a>" +
            "<button class='btn btn-primary buyItNow' type='button' data-id='" + result[i].itemId.slice(3, 15) + "'> Buy It Now </button>" +
            "</div>" +
            "</div>" +
            "</div>");
          $("#productDisplay").append(newCard);
          resolve();
        }
      });
    });
  }

  // Function to make Walmart API call and Display Results
  // function walmartAPI(searchTerm) {
  //   // var priceRange = 40;
  //   // console.log(searchTerm);

  //   var key = "5v2k2wffwxhrptsdztu8g69c";
  //   var url = "https://api.walmartlabs.com/v1/search?";

  //   $.ajax({
  //     url: url,
  //     method: "GET",
  //     jsonp: "callback",
  //     dataType: "jsonp",
  //     data: {
  //       query: searchTerm,
  //       format: "json",
  //       //"facet.range": priceRange, //
  //       apiKey: key
  //     },
  //   }).done(function(result) {
  //     console.log(result);
  //     try {
  //       result.items[0];
  //     }
  //     catch (err) {
  //       console.log(err);
  //       $("#productDisplay").html("<h3>No goods found</h3>");
  //       return 1;
  //     }
  //     for (var i = 0; i < 10; i++) {
  //       var newCard =
  //         $("<div class='col collapse multi-collapse showWalmart' style='max-width: 16rem; margin: 2%;'>" +
  //           "<div class='card card-size'>" +
  //           "<img class'card-img-top' src='" + result.items[i].imageEntities[0].mediumImage + "'>" +
  //           "<div class='card-body'>" +
  //           "<h6 class='card-title'>" + result.items[i].name + "</h6>" +
  //           "<p class='card-text'>" + "$" + result.items[i].salePrice + "</p>" +
  //           "<a class='card-text' href='" + result.items[i].productUrl + "' target='_blank'>View on Walmart</a>" +
  //           "<button class='btn btn-primary buyItNow' type='button' value='" + result.items[i].itemId + "'> Buy It Now </button>" +
  //           "</div>" +
  //           "</div>" +
  //           "</div>");
  //       $("#productDisplay").append(newCard);
  //     }
  //   });
  // }




});
//Document Ready End
