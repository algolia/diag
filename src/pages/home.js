module.exports = home;

function home() {
  $('input[name="t"]').val(Date.now());
}
