module.exports = home;

function home() {
  $('input[name="t"]').val(Date.now());
  prefillAdvancedOptions();

}

function prefillAdvancedOptions() {
  var formParameters = ['applicationId', 'apiKey', 'indexName'];
  var params = new URL(document.location).searchParams;

  for (var idx in formParameters){
    if (params.has(formParameters[idx])){
      document.getElementById(formParameters[idx]).value = params.get(formParameters[idx]);
    }
  }
 }