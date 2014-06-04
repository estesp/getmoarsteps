
function postIotCredentials() {
	var uname = document.getElementById('username').value;
	if(uname === '') {
		document.getElementById('echo').innerHTML = 'Please input a valid username.';
		document.getElementById('username').focus();
		return;
	}
	var pass = document.getElementById('pw').value;
  if(pass === '') {
	  document.getElementById('echo').innerHTML = 'Please enter a password.';
	  document.getElementById('pw').focus();
	  return;
  }
	document.getElementById('echo').innerHTML = '';

	document.getElementById('iotcredentials').submit();

}
