function selectService(index,indexFigure){
    document.getElementById('step1').setAttribute("class","l_gray");
    document.getElementById('step2').setAttribute("class","l_gray");
    document.getElementById('step3').setAttribute("class","l_gray");
    document.getElementById('step4').setAttribute("class","l_gray");
    document.getElementById('step5').setAttribute("class","l_gray");
    document.getElementById('step6').setAttribute("class","l_gray");
    document.getElementById('step7').setAttribute("class","l_gray");

    document.getElementById('step1_fig').setAttribute("class","hide");
    document.getElementById('step2_fig').setAttribute("class","hide");
    document.getElementById('step3_fig').setAttribute("class","hide");
    document.getElementById('step4_fig').setAttribute("class","hide");
    document.getElementById('step5_fig').setAttribute("class","hide");
    document.getElementById('step6_fig').setAttribute("class","hide");
    document.getElementById('step7_fig').setAttribute("class","hide");

    document.getElementById(index).setAttribute("class","activeli");
    document.getElementById(indexFigure).setAttribute("class","show");
}




function activateimg(id){
    document.getElementById('active1').style.display="none";
    document.getElementById('active2').style.display="none";
    document.getElementById('active3').style.display="none";
    document.getElementById('active4').style.display="none";
    //document.getElementById('carousel1').style.display="none";
    //document.getElementById('carousel2').style.display="none";


    document.getElementById(id).style.display="grid";
    
    
    
    

}
function activecar(id){
  document.getElementById('carousel1').style.display="none";
    document.getElementById('carousel2').style.display="none";


    document.getElementById(id).style.display="grid";
}


function activatef(id){
    document.getElementById('active').style.display="none";
    document.getElementById('inactive1').style.display="none";
    document.getElementById('inactive2').style.display="none";

    document.getElementById(id).style.display="block";

}





function toggle_visibility(index){
    
                    
    
    if(document.getElementById(index).getAttribute("class") === "inactive")
        {
            document.getElementById(index).setAttribute("class", "active");
                        
                        
        }
        else
            {
                document.getElementById(index).setAttribute("class", "inactive");
            }
        }

 
        

 


//For dentistry page slide show
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
 
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
 
  slides[slideIndex-1].style.display = "grid";  
  
}


//Frequently asked questions

function showFaq(id) {
    var element = document.getElementById(id);
    var icon = document.getElementById("icon" + id);
    if (element.style.display != "block") {
      element.style.display = "block";
      icon.classList.replace("fa-angle-down", "fa-angle-up");
    } else {
      element.style.display = "none";
      icon.classList.replace("fa-angle-up", "fa-angle-down");
    }
  }

  //Carousel for tvastra plus