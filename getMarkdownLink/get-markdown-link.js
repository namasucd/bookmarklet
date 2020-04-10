javascript:(
    function(){
        let title = document.title;
        let href = document.location.href;
        let mdLink = '['+title+']'+'('+getCanonical()+')';
        alert(mdLink);

        function getCanonical(){
            try{
                return document.querySelector('link[rel="canonical"]').href
            }catch{
                return document.location.href;
            }
        }
    }
)();
