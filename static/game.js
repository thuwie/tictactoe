const url = 'http://localhost:3000/api';
$(function () {
  const urlParams = new URLSearchParams(window.location.search);
  // const title = window.location.href.substring(window.location.href.lastIndexOf('/'));
  const title = urlParams.get('id');
  console.log(title);
  $('#title').text(title);
});