$(document).ready(function() {
  var CURRENT_PAGE_LEADS = 0;
  var CURRENT_PAGE_SOURCE = 0;
  var CURRENT_URL = ""
  $( "#fetch-data" ).hide();
  // $('#table-result').DataTable();
// http://localhost:3001/api/v1/leads/search_others?name=james&phone=555-555-5555&records=10&page=1
  // http://localhost:3000/api/v1/leads?&records=2&page=2

  function createTable(data) {
    $('#result-search-container').remove();
    $('.result-featured-container').append("<div id='result-search-container'><div id='result-search'></div></div>");
    $("#result-search").append("<table id='table-result' class='display' style='width:100%'></table>");
    $("#table-result").append("<thead><tr><th>Zoho id</th><th>Name</th><th>Company</th><th>Phone</th><th>Mobile</th><th>Source</th></tr></thead><tbody id='bodyResult'></tbody>");
    data.forEach(function(element) {
      $("#bodyResult").append("<tr>"
                                    + "<td>" + element.zoho_id + "</td>"
                                    + "<td>" + element.name + "</td>"
                                    + "<td>" + element.company + "</td>"
                                    + "<td>" + element.phone + "</td>"
                                    + "<td>" + element.mobile + "</td>"
                                    + "<td>" + element.source + "</td>"
                                  + "</tr>"
                                );
    });
    $('#table-result').DataTable();
  }

  function fetchDataToTable(data){
    var t = $('#table-result').DataTable();
    data.forEach(function(element) {
      t.row.add( [
        element.zoho_id,
        element.name,
        element.company,
        element.phone,
        element.mobile,
        element.source
      ] ).draw( false );
    });
  }

  function evalutePage(data, url) {
    if (CURRENT_PAGE_LEADS == 1 || CURRENT_PAGE_SOURCE == 1) {
      CURRENT_URL = url;
      createTable(data);
    } else {
      fetchDataToTable(data);
    }
  }

  function createURL(name, company, phone){
    first = true;
    url = 'http://localhost:3001/api/v1/leads/search_others?'
    if (name != "") {
      url += "name=" + name;
    }
    if (company != "") {
      url += "&company=" + company;
    }
    if (phone != "") {
      url += "&phone=" + phone;
    }
    url += "&records=2&page="
    return url;
  }

  function createURLSource(source){
    url = 'http://localhost:3001/api/v1/leads/seach_source?'
    if (source != "") {
      url += "source=" + source;
    }
    url += "&records=2&page="
    return url;
  }

  leadFormEvent = function(event){
    event.preventDefault();
    CURRENT_PAGE_LEADS = 1;
    CURRENT_PAGE_SOURCE = 0;
    var name = $("#leads-form-container").find('input[name="name"]').val().trim();
    var company = $("#leads-form-container").find('input[name="company"]').val().trim();
    var phone = $("#leads-form-container").find('input[name="phone"]').val().trim();
    var url = createURL(name, company, phone);
    $.ajax({
      url : url + CURRENT_PAGE_LEADS,
      type: 'GET',
      success: function(data){
        $( "#fetch-data" ).show();
        evalutePage(data, url)
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
      }
    })
  }

  sourceFormEvent = function(event){
    event.preventDefault();
    CURRENT_PAGE_SOURCE = 1;
    CURRENT_PAGE_LEADS = 0;
    var source = $("#source-form-container").find('input[name="source"]').val().trim();
    var url = createURLSource(source);
    $.ajax({
      url : url + CURRENT_PAGE_SOURCE,
      type: 'GET',
      success: function(data){
        console.log(data);
        console.log(url + CURRENT_PAGE_SOURCE);
        $( "#fetch-data" ).show();
        evalutePage(data, url)
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
      }
    })
  }

  $("#leadForm").submit(leadFormEvent);
  $("#sourceForm").submit(sourceFormEvent);

  $( "#fetch-data" ).click(function() {
    var page = 0;
    if (CURRENT_PAGE_LEADS != 0) {
      page = ++CURRENT_PAGE_LEADS;
      console.log("LEADS" + page);
    } else {
      page = ++CURRENT_PAGE_SOURCE;
      console.log("SOURCE" + page);
    }
    console.log( CURRENT_URL + page);
    $.ajax({
      url : CURRENT_URL + page,
      type: 'GET',
      success: function(data){
        console.log(data);
        if (data.length == 0) {
          $( "#fetch-data" ).hide();
        } else {
          fetchDataToTable(data);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
      }
    })
  });

  $("#submitForm").submit(function(event) {
    event.preventDefault();
    var zoho_id = $("#submit-form-container").find('input[name="zoho_id"]').val();
    var phone = $("#submit-form-container").find('input[name="phone"]').val();
    var mobile = $("#submit-form-container").find('input[name="mobile"]').val();
    console.log("Nombre del zoho_id: " + zoho_id);
    console.log("Nombre del phone: " + phone);
    console.log("Nombre del mobile: " + mobile);
    $('#table-result').remove();
    $("#result-search-container").append("<table id='table-result' style='width:100%'></table>");
    $.ajax({
      url : 'http://localhost:3001/api/v1/leads/search_lead?id=' + zoho_id,
      type: 'GET',
      success: function(data){
        console.log(data);
        $('#search-counter').text(data.length);
        data.forEach(function(element) {
          console.log(element);
          $("#table-result").append("<tr><th>Zoho id</th><th>Phone</th><th>Mobile</th></tr>");
          $("#table-result").append("<tr>"
                                        + "<td>" + element.name + "</td>"
                                        + "<td>" + element.company + "</td>"
                                        + "<td>" + element.source + "</td>"
                                      + "</tr>"
                                    );
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
      }
    })
  });
});
