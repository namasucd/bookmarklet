javascript:(
    function(){
        var title = document.title;
        var href = document.location.href;
        var mdLink = '['+title+']'+'('+href+')';
        alert(mdLink);
        var text = document.createElement("textarea");
        text.value = mdLink;
        text.select();
        document.execCommand("Copy");
        text.parentNode.removeChild(text);
    }
)();
