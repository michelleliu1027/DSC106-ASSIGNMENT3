/*!
* Start Bootstrap - Resume v7.0.2 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
    

});

// reference function: https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery 
function copy() {
    var aux = document.createElement("input");
    aux.setAttribute("value",'michelleliu1027');

    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    alert("Copied My Wechat:  " + aux.value);
    document.body.removeChild(aux);
  };

function showqrcode(){
    var sourceOfPicture = "assets/img/qrcode.JPG";
    var img = document.getElementById('wechatqr')
    img.setAttribute("src", sourceOfPicture)
    img.style.display = "block";
    console.log(img)
}

function clearqrcode(){
    var img = document.getElementById('wechatqr');
    img.style.display = "none";
}
