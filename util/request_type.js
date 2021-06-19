  function GetRequestType(url){
   if(url.startsWith("/admin"))
        return "admin";
   else if (url.startsWith("/seller"))
        return "seller";
   else if(url.startsWith("/driver"))
        return "driver";
   else 
        return null;                
}
module.exports ={
GetRequestType
}