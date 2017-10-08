$(document).ready(function() {
  var CURRENT_PAGE_LEADS = 0;
  var CURRENT_PAGE_SOURCE = 0;
  var CURRENT_URL = "";
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  $( "#fetch-data" ).hide();

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

  function createSubmitURL(zoho_id, phone, mobile){
    first = true;
    url = 'http://localhost:3001/api/v1/leads/search_lead?'
    if (zoho_id != "") {
      url += "id=" + zoho_id;
    } else {
      if (phone != "") {
        url += "&phone=" + phone;
      }
      if (mobile != "") {
        url += "&mobile=" + mobile;
      }
    }
    url += "&records=25&page=1"
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
        toastr.success('Search success');
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
        toastr.success('Search success');
        $( "#fetch-data" ).show();
        evalutePage(data, url)
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
      }
    })
  }

  submitFormEvent = function(event){
    event.preventDefault();
    var zoho_id = $("#submit-form-container").find('input[name="zoho_id"]').val().trim();
    var phone = $("#submit-form-container").find('input[name="phone"]').val().trim();
    var mobile = $("#submit-form-container").find('input[name="mobile"]').val().trim();
    var url = createSubmitURL(zoho_id, phone, mobile);
    $.ajax({
      url : url,
      type: 'GET',
      success: function(data){
        console.log(data);
        toastr.success('Lead added');
        createTable(data)
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
      }
    })
  }

  $("#leadForm").submit(leadFormEvent);
  $("#sourceForm").submit(sourceFormEvent);
  $("#submitForm").submit(submitFormEvent);

  $( "#fetch-data" ).click(function() {
    var page = 0;
    if (CURRENT_PAGE_LEADS != 0) {
      page = ++CURRENT_PAGE_LEADS;
    } else {
      page = ++CURRENT_PAGE_SOURCE;
    }
    $.ajax({
      url : CURRENT_URL + page,
      type: 'GET',
      success: function(data){
        if (data.length == 0) {
          $( "#fetch-data" ).hide();
          toastr.info('Nothing else to show');
        } else {
          toastr.success('More data fetched');
          fetchDataToTable(data);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
      }
    })
  });
});
