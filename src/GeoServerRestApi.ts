// TODO: 3 Use promises

export class GeoServerRestApi {

    private geoserverBaseUrl: URL;
    private proxyUrl: URL;

    // NOTE: If username is empty (username == ""), requests will be sent without credentials.
    private username: string;
    private password: string;

    constructor(geoserverUrl: URL, proxyUrl: URL, username: string, password: string) {

        this.geoserverBaseUrl = geoserverUrl;
        this.proxyUrl = proxyUrl;

        this.username = username;
        this.password = password;
    }


    public loadLayerAsync(workspace: string, name: string, handler: any) {
        let url = "/rest/layers/" + workspace + ":" + name + ".json";

        this.load(url, (response: any) => { handler(response); });
    }


    public loadLayerGroupAsync(workspace: string, name: string, handler: any) {
        let url = workspace == null ? "/rest/layergroups/" + name + ".json" : "/rest/workspaces/" + workspace + "/layergroups/" + name + ".json";
        
        this.load(url, (response: any) => { handler(response.layerGroup); });
    }


    public loadLayerGroupListAsync(workspace: string, handler: any): any {
        let url = workspace == null ? "/rest/layergroups.xml" : "/rest/workspaces/" + workspace + "/layergroups.json";

        this.load(url, (response: any) => {

            if (typeof response.layerGroups.layerGroup !== "undefined") {
                handler(response.layerGroups.layerGroup);
            }
            else {
                handler([]);
            }
        });
    }


    loadWorkspacesAsync(handler: any) {
        let url = "/rest/workspaces.json";

        this.load(url, (response: any) => { handler(response.workspaces.workspace); });
    }


    private load(relUrl: string, successHandler: any) {

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
