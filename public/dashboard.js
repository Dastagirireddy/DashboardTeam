(function() {
  var Validator = (function() {
    var Validator = function() {
    
      var xmlhttp;
      if (window.XMLHttpRequest){

          xmlhttp=new XMLHttpRequest();
      }
      else {

        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange=function() {

        if (xmlhttp.readyState==4 && xmlhttp.status==200) {

            //document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
            //document.getElementById('dashboard-app').innerHTML = xmlhttp.responseText;
            var iframe = document.createElement('iframe');
            iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(xmlhttp.responseText);
            iframe.setAttribute('id', 'iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = 0;
            iframe.style.bottom = "-15px";
            iframe.style.height = "406px";
            iframe.style.width = "306px";
            iframe.style.border = "none";
            document.body.appendChild(iframe);            
            console.log(xmlhttp.responseText);
        }
        //console.log(xmlhttp.responseText);
      }
      var dashboard = document.getElementById('dashboard');
      xmlhttp.open("GET","http://localhost:3000/v/"+dashboard.value,true);
      xmlhttp.send();

      // var form = document.createElement('form');
      // form.action = "http://192.168.0.8:3000/v/123456789";
      // form.method = "post";
      // form.submit();      
    };

    return Validator;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Validator;
  else
    window.Validator = Validator;
})();