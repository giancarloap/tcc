function sendMail() {
    return "mailto:ap.giancarlo@gmail.com"
        + "?cc=eduardobr.55@gmail.com"
        + "&subject=" + decodeURIComponent("Contact from Chrome Extension")
        + "&body=" + "Name: " + decodeURIComponent(document.getElementById('name').value)
        + " Email: " + decodeURIComponent(document.getElementById('email').value)
        + " Phone: " + decodeURIComponent(document.getElementById('phone').value)
        + " Message: " + decodeURIComponent(document.getElementById('message').value)
        ;
}

function goToInterface(interfaceFile) {
    $('head').append('<meta http-equiv="refresh" content="0;url=../../../templates/master_page/index.html">');
    //$.ajax({
    //    url: chrome.extension.getURL(interfaceFile),
    //    async: false,
    //    dataType: 'html',
    //    success: function (interfaceHtml) {
    //        document.open('text/html');
    //        document.write(interfaceHtml);
    //        document.close();
    //    }
    //});
}

function fillLegalContent(legalContentFile) {
    $.ajax({
        url: chrome.extension.getURL(legalContentFile),
        async: false,
        dataType: 'html',
        success: function (legalContentHtml) {
            $("#intro-heading").html(legalContentHtml);
        }
    });
}

function changeToOriginalContent(legalContentFile) {
    $("#services").removeClass("hide");
    $("#evaluation").removeClass("hide");
    $("#about").removeClass("hide");
    $("#team").removeClass("hide");
    $("#clients").removeClass("hide");
    $("#bottomlinkslegal").removeClass("hide");


    $("#getproductivebutton").removeClass("hide");
    $("#navbarright").html('<li class="hidden"> <a href="#page-top"></a> </li> <li> <a class="page-scroll" href="#services">Services</a> </li> <li> <a class="page-scroll" href="#evaluation">Evaluation</a> </li> <!--<li>--> <!--<a class="page-scroll" href="#portfolio">Portfolio</a>--> <!--</li>--> <li> <a class="page-scroll" href="#about">About</a> </li> <li> <a class="page-scroll" href="#team">Team</a> </li> <li> <a class="page-scroll" href="#contact">Contact</a> </li>');

    $("#intro-heading").html("It's Time To Get Productive on the Web");
}

function changeToLegalContent(legalContentFile) {
    $("#services").addClass("hide");
    $("#evaluation").addClass("hide");
    $("#about").addClass("hide");
    $("#team").addClass("hide");
    $("#clients").addClass("hide");
    $("#bottomlinkslegal").addClass("hide");


    $("#getproductivebutton").addClass("hide");
    $("#navbarright").html('<li class="hidden"> <a href="#page-top"></a> </li> <li> <a id="toplinkprivacypolicy" class="page-scroll" href="#">Privacy Policy</a> </li> <li> <a id="toplinktermsofuse" class="page-scroll" href="#">Terms of Use</a> </li> <li> <a class="page-scroll" href="#contact">Contact</a> </li>');

    fillLegalContent(legalContentFile);

    document.getElementById("toplinkprivacypolicy").addEventListener("click", function () {
        fillLegalContent('templates/index_page/privacy_policy.html');
    });

    document.getElementById("toplinktermsofuse").addEventListener("click", function () {
        fillLegalContent('templates/index_page/terms_of_use.html');
    });

    document.getElementById("toplinkwebproductivity").addEventListener("click", function () {
        return false;
    });

    document.getElementById("toplinkwebproductivity").addEventListener("click", function () {
        changeToOriginalContent('modules/index_page/views/index.html');
    });
}

function start() {
    document.getElementById("getproductivebutton").addEventListener("click", function () {
        goToInterface('modules/interface/views/index.html');
    });

    document.getElementById("sendmessage").addEventListener("click", function () {
        document.getElementById("contactForm").action = sendMail();
    });

    document.getElementById("privacypolicy").addEventListener("click", function () {
        changeToLegalContent('templates/index_page/privacy_policy.html');
    });
    document.getElementById("termsofuse").addEventListener("click", function () {
        changeToLegalContent('templates/index_page/terms_of_use.html');
    });

    document.getElementById("member1twitter").addEventListener("click", function () {
        chrome.tabs.create({url: $(member1twitter).attr('href')});
    });
    document.getElementById("member1facebook").addEventListener("click", function () {
        chrome.tabs.create({url: $(member1facebook).attr('href')});
    });
    document.getElementById("member1linkedin").addEventListener("click", function () {
        chrome.tabs.create({url: $(member1linkedin).attr('href')});
    });

    document.getElementById("member2twitter").addEventListener("click", function () {
        chrome.tabs.create({url: $(member2twitter).attr('href')});
    });
    document.getElementById("member2facebook").addEventListener("click", function () {
        chrome.tabs.create({url: $(member2facebook).attr('href')});
    });
    document.getElementById("member2linkedin").addEventListener("click", function () {
        chrome.tabs.create({url: $(member2linkedin).attr('href')});
    });

    document.getElementById("member3googleplus").addEventListener("click", function () {
        chrome.tabs.create({url: $(member3googleplus).attr('href')});
    });
    document.getElementById("member3facebook").addEventListener("click", function () {
        chrome.tabs.create({url: $(member3facebook).attr('href')});
    });
    document.getElementById("member3linkedin").addEventListener("click", function () {
        chrome.tabs.create({url: $(member3linkedin).attr('href')});
    });
}

document.addEventListener('DOMContentLoaded', function () {
    start();
});