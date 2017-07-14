import {GeoServerRestApi} from "../../src/GeoServerRestApi";


console.log("GeoServerRestReader Test");


// NOTE: URL must NOT have a trailing "/"
// TODO: 3 Make URL building more error tolerant



var proxyUrl = new URL("http://localhost/proxy.php?csurl=");

//TODO: 1 DO NOT UPLOAD LOGIN CREDENTIALS TO GIT!!!

var geoServerUrl = new URL("<your_geoserver_url>");


var reader = new GeoServerRestApi(geoServerUrl, proxyUrl, "username", "password");




//################## BEGIN Get Layer Group List ##################
/*
reader.getLayerGroups("workspace_name", function (result) {

    for (var ii = 0; ii < result.layerGroups.layerGroup.length; ii++) {
        var lg = result.layerGroups.layerGroup[ii];

        //console.log(lg.href);
    }
});
*/
//################## END Get Layer Group List ##################


//################## BEGIN Get Layer Group ##################
/*
reader.getLayerGroup("fa_simulations", "layer_group_name",
    function (result) {

        for (var pub of result.getPublishedList()) {
            //   console.log(pub.name);

            var layer = reader.getLayer(result.getWorkspaceName(), pub.name, function (result) {
                // console.log(result);
            });
        }
    }
);
*/
//################## END Get Layer Group ##################

reader.getWorkspaces(function(result) {
    console.log(result);
});