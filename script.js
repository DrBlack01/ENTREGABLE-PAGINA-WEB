//hace que cambie el titulo cuando cambias de pestaña
document.addEventListener
("visibilitychange", () => {
if(document.hidden){
    document.title ="!REGRESA! 😢";

}else{

    document.title ="Gracias por volver 🙂";
    }}
)

