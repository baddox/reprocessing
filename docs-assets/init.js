myCode1Mirror.setOption("extraKeys", {
  Tab: function(cm) {
    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
    cm.replaceSelection(spaces);
  }
});

function contentFromResponse(gist) {
    $
        .ajax({ url: 'https://api.github.com/gists/' + gist })
        .done(function (resp) {
            var files = resp.files;
            var content = [];
            for (var file in files) {
                content.push(files[file].content)
            }
            if (content.length > 0) {
                myCode1Mirror.setValue(content[0]);
                return;
            } else {
                return;
            }
        });
    return;
};

function queryGist() {
    var qd = {};
    location.search.substr(1).split("&").forEach(
        function (item) {
            var s = item.split("="), k = s[0], v = s[1] && decodeURIComponent(s[1]); (k in qd) ? qd[k].push(v) : qd[k] = [v]
        }
    );
    return qd['gist'];
}
function loadGist (gist) {
    if(gist){
        contentFromResponse(gist)
    }

    $.
    ajax(
    {url : "examples/examples.json",
        dataType : "json",
        cache: true})
    .done(function (response){
        examplesDataSet = response;
        for(var k in examplesDataSet){
            examplesDropdown.appendChild(createExample(k))
        }
        if (location && location.hash ){
            var id =  location.hash.substr(1)
            switchExample(id)
        } else {
          // TODO: Load and compile the default exapmple
          // If there is no location we load the default example and eval it
          $.ajax({
            url: "examples/default.re",
            cache: true
          })
          .done(function (response) {
            var rsp = compile(response)
            if (rsp.js_code !== undefined) {
              evalCode(rsp.js_code)
            } else {
              jsCode1Mirror.setValue(rsp.js_error_msg);
            }
          });
        }
    })
    .fail(function(xhr, textStatus, thrown){
        console.log(arguments)
    })

}

// var gist = '1ce559ca46157b9dc15649450bea46fa';
var clientGist = queryGist();
//

if(clientGist){
    start(clientGist)
}else{
 start()
}
