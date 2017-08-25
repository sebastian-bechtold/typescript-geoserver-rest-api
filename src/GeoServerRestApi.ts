// TODO: 3 Use promises

export class RestLayer {
    data: any;

    constructor(data: any) {
        this.data = data;
    }
}

export class RestLayerGroup {

    data: any;

    constructor(data: any) {
        this.data = data.layerGroup;
    }


    getLayerList() {

    }

    getPublishedList() {
        return this.data.publishables.published;
    }

    getTitle() {
        return this.data.title;
    }

    getWorkspaceName() {
        return this.data.workspace.name;
    }
}


export class GeoServerRestApi {

    geoserverBaseUrl: URL;
    proxyUrl: URL;

    // NOTE: If username is empty (username == ""), requests will be sent without credentials.
    username: string;
    password: string;

    constructor(geoserverUrl: URL, proxyUrl: URL, username: string, password: string) {

        this.geoserverBaseUrl = geoserverUrl;
        this.proxyUrl = proxyUrl;

        this.username = username;
        this.password = password;
    }


    getLayer(workspace: string, name: string, handler: any) {

        let url = "/rest/layers/" + workspace + ":" + name + ".json";

        let responseHandler = function (response: string) {
            handler(new RestLayer(response));
        }

        this.load(url, responseHandler);
    }


    getLayerGroup(workspace: string, name: string, handler: any) {
        let url = workspace == null ? "/rest/layergroups/" + name + ".json" : "/rest/workspaces/" + workspace + "/layergroups/" + name + ".json";

        let responseHandler = function (response: string) {
            handler(new RestLayerGroup(response));
        }

        this.load(url, responseHandler);
    }


    getLayerGroups(workspace: string, handler: any): any {
        let url = workspace == null ? "/rest/layergroups.xml" : "/rest/workspaces/" + workspace + "/layergroups.json";

        this.load(url, handler);
    }


    getWorkspaces(handler: any) {
        this.load("/rest/workspaces.json", handler);
    }


    load(relUrl: string, successHandler: any) {

        //######### BEGIN Build request URL ###########             
        let url = "";

        if (typeof this.proxyUrl != "undefined") {
            url += this.proxyUrl.toString();
        }

        url += this.geoserverBaseUrl.toString() + relUrl;
        //######### END Build request URL ###########

        let request = new XMLHttpRequest();

        if (this.username != "") {
            request.withCredentials = true;
            request.open("GET", url, true, this.username, this.password);
        }
        else {
            request.open("GET", url, true);
        }
        
        request.addEventListener('load', function (event) {
            if (request.status >= 200 && request.status < 300) {

                successHandler(JSON.parse(request.responseText));
            } else {
                console.error("HTTP request failed: " + request.statusText, request.responseText);
            }
        });

        request.send();
    }
}
