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

 
        

 //Toggling icon
 $(".rotate").click(function () {
    $(this).toggleClass("down");
})       