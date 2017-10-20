// TODO: 3 Use promises

export class GeoServerRestApi {

    private pGeoserverBaseUrl: string;
    private pProxyUrl: string;

    constructor(geoserverUrl: string, proxyUrl: string) {

        this.pGeoserverBaseUrl = geoserverUrl;
        this.pProxyUrl = proxyUrl;
    }

    get geoServerBaseUrl(): string {
        return this.pGeoserverBaseUrl;
    }

    public loadLayerAsync(workspace: string, name: string, handler: any) {
        let url = "/rest/layers/" + workspace + ":" + name + ".json";

        this.load(url, (response: any) => { handler(response); });
    }


    public loadLayerGroupAsync(workspace: string, name: string, handler: any) {
        let url = workspace == null ? "/rest/layergroups/" + name + ".json" : "/rest/workspaces/" + workspace + "/layergroups/" + name + ".json";

        this.load(url, (response: any) => { 
        
            let argument = (response != null) ? response.layerGroup : null;
            handler(argument); 
        });
    }


    public loadLayerGroupListAsync(workspace: string, handler: any): any {
        let url = workspace == null ? "/rest/layergroups.json" : "/rest/workspaces/" + workspace + "/layergroups.json";

        this.load(url, (response: any) => {

            if (typeof response.layerGroups.layerGroup !== "undefined") {
                handler(response.layerGroups.layerGroup);
            }
            else {
                handler([]);
            }
        });
    }

    public loadLayersAsync(handler: any): any {
        let url = "/rest/layers.json";

        this.load(url, (response: any) => {

            if (typeof response.layers.layer !== "undefined") {
                handler(response.layers.layer);
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


    private load(relUrl: string, responseHandler: any) {

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

                responseHandler(JSON.parse(request.responseText));
            } else {
                console.error("HTTP request failed: " + request.statusText, request.responseText);

                responseHandler(null);
            }
        });

        request.send();
    }
}
