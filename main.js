let menuList=document.getElementById("menuList");
let manuList=document.getElementById("manuList");
menuList.style.maxWidth="0%";
manuList.style.maxWidth="0%";
function togglemenu()
{
    if(menuList.style.maxWidth=="0%")
    {
        menuList.style.maxWidth="30%";
        manuList.style.maxWidth="100%";
        manuList.style.opacity="100%"; 
        menuList.style.opacity="100%";  
        first.classList.add('first-anim');
        second.classList.add('second-anim');
    }
    else 
    {
        menuList.style.maxWidth="0%";
        manuList.style.maxWidth="0%";
        manuList.style.opacity="0%"; 
        menuList.style.opacity="0%";  
        first.classList.remove('first-anim');
        second.classList.remove('second-anim');
    }
}

