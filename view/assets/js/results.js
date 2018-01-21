$(function() {

  var searchTerm;

  $("#searchBtn").click(function(e) {
    e.preventDefault();
    searchTerm = $("#searchBar").val().trim();
    console.log(searchTerm);
    ebayAPI(searchTerm);
    walmartAPI(searchTerm);

  });

  // Function to make Walmart API call and Display Results
  function walmartAPI(searchTerm) {
    // var priceRange = 40;
    console.log(searchTerm);

    var key = "5v2k2wffwxhrptsdztu8g69c";
    var url = "https://api.walmartlabs.com/v1/search?";

    $.ajax({
      url: url,
      method: "GET",
      jsonp: "callback",
      dataType: "jsonp",
      data: {
        query: searchTerm,
        format: "json",
        //"facet.range": priceRange, //
        apiKey: key
      },
    }).done(function(result) {
      console.log(result);
      try {
        result.items[0];
      }
      catch (err) {
        console.log(err);
        $("#productDisplay").html("<h3>No goods found</h3>");
        return 1;
      }
      for (var i = 0; i < 10; i++) {
        var newCard = $("<div class='col collapse multi-collapse showWalmart'>" +
          "<div class='card card-size'>" +
          "<img class'card-img-top' src='" + result.items[i].imageEntities[0].mediumImage + "'>" +
          "<div class='card-body'>" +
          "<h5 class='card-title'>" + result.items[i].name + "</h5>" +
          "<p class='card-text'>" + "$" + result.items[i].salePrice + "</p>" +
          "<a class='card-text' href='" + result.item[i].productUrl + "' target='_blank'>View on Walmart</a>" +
          "<a href='#' class=btn btn-primary'> Buy It Now </a>" +
          "</div>" +
          "</div>" +
          "</div>");
        $("#productDisplay").append(newCard);
      }
    });
  }

  //Function to make Ebay API call and Display Results
  function ebayAPI(searchTerm) {
    var key = "StephenC-SecretSa-PRD-6132041a0-943144c9";
    var url = "https://svcs.ebay.com/services/search/FindingService/v1";

    $.ajax({
      url: url,
      method: "GET",
      dataType: "jsonp",
      data: {
        "OPERATION-NAME": "findItemsByKeywords",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": "StephenC-SecretSa-PRD-6132041a0-943144c9",
        "RESPONSE-DATA-FORMAT": "JSON",
        "paginationInput.entriesPerPage": "10",
        keywords: searchTerm
      }

    }).done(function(result) {
      console.log(result);

      var short = result.findItemsByKeywordsResponse[0].searchResult[0];
      try {
        short.item[0];
      }
      catch (err) {
        if (err) {
          console.log(err);
          $("#productDisplay").html("<h3>No goods found</h3>");
          return 1;
        }
      }
      for (var i = 0; i < 10; i++) {
        var newCard = $("<div class='col collapse multi-collapse showEbay'>" +
          "<div class='card card-size'>" +
          "<img class'card-img-top' src='" + short.item[i].galleryURL[0] + "'>" +
          "<div class='card-body'>" +
          "<h5 class='card-title'>" + short.item[i].title[0] + "</h5>" +
          "<p class='card-text'>" + "$" + short.item[i].sellingStatus[0].currentPrice[0].__value__ + "</p>" +
          "<a class='card-text' href='" + short.item[i].viewItemURL[0] + "' target='_blank'>View on eBay</a>" +
          "<a href='#' class='btn btn-primary'> Buy It Now </a>" +
          "</div>" +
          "</div>" +
          "</div>");
        $("#productDisplay").append(newCard);
      }
    });
  }


});
//Document Ready End
