function onStart()
{
    messageBox=document.getElementById("msg_box");
    if(messageBox.innerHTML!="")
    {
      messageBox.style.display="block";
    }
    formElement=document.getElementById("loginForm");
    formElement.addEventListener('submit', function(event) {
        if (formElement.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        formElement.className='was-validated';
      }, false);
}