export class GeoServerRestApi {

    private pGeoserverBaseUrl: string;
    private pProxyUrl: string;

    constructor(geoserverUrl: string, proxyUrl: string) {

        this.pGeoserverBaseUrl = geoserverUrl;
        this.pProxyUrl = proxyUrl;
    }


    get geoServerBaseUrl(): string {
        return this.pProxyUrl + this.pGeoserverBaseUrl;
    }


    public loadLayerAsync(workspace: string, name: string, handler: any) {
        let url = "/rest/layers/" + workspace + ":" + name + ".json";

        this.asyncLoad(url).then((response: any) => { handler(response); });
    }


    public loadLayerGroupAsync(workspace: string, name: string, handler: any) {
        let url = workspace == null ? "/rest/layergroups/" + name + ".json" : "/rest/workspaces/" + workspace + "/layergroups/" + name + ".json";

        this.asyncLoad(url).then((response: any) => {

            let argument = (response != null) ? response.layerGroup : null;
            handler(argument);
        });
    }


    public loadLayerGroupListAsync(workspace: string, handler: any): any {
        let url = workspace == null ? "/rest/layergroups.json" : "/rest/workspaces/" + workspace + "/layergroups.json";

        this.asyncLoad(url).then((response: any) => {

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

        this.asyncLoad(url).then((response : any) => {

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

        this.asyncLoad(url).then( (response: any) => { handler(response.workspaces.workspace); });
    }


    private asyncLoad(relUrl: string) {

        //################# BEGIN Promise definition ####################
        return new Promise((resolve, reject) => {

            //######### BEGIN Build request URL ###########             
            let url = "";

            if (this.pProxyUrl != null) {
                url += this.pProxyUrl.toString();
            }

            url += this.pGeoserverBaseUrl.toString() + relUrl;
            //######### END Build request URL ###########

            let request : XMLHttpRequest = new XMLHttpRequest();


            request.open("GET", url, true);
            
            request.onload = () => {
                resolve(JSON.parse(request.responseText));
            }

            request.onerror = () => {
                console.error("HTTP request failed: " + request.statusText, request.responseText);
                reject(null);
            } 
           
            request.send();
        });
        //################# END Promise definition ####################
    }
}
