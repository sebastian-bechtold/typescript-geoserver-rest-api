// TODO: 3 Use promises

export class GeoServerRestApi {

    private pGeoserverBaseUrl: URL;
    private pProxyUrl: URL | null;

  

    constructor(geoserverUrl: URL, proxyUrl: URL | null) {

        this.pGeoserverBaseUrl = geoserverUrl;
        this.pProxyUrl = proxyUrl;        
    }

    get geoServerBaseUrl() : URL {
        return this.pGeoserverBaseUrl;
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

        if (this.pProxyUrl != null) {
            url += this.pProxyUrl.toString();
        }

        url += this.pGeoserverBaseUrl.toString() + relUrl;
        //######### END Build request URL ###########

        let request = new XMLHttpRequest();
        
        request.open("GET", url, true);

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
