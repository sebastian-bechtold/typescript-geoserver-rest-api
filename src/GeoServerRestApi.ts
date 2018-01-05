export class GeoServerRestApi {

    private mGeoserverUrl: string;

    get geoServerUrl(): string {
        return this.mGeoserverUrl;
    }

    constructor(geoserverUrl: string) {
        this.mGeoserverUrl = geoserverUrl;
    }

    public asyncLoadLayer(workspace: string, name: string): Promise<any> {

        return new Promise((resolve, reject) => {
            let url = "/rest/layers/" + workspace + ":" + name + ".json";

            this.asyncLoad(url).then((response: any) => { resolve(response); });
        });
    }


    public asyncLoadLayerGroup(workspace: string, name: string): Promise<any> {

        return new Promise((resolve, reject) => {
            let url = (workspace == null) ? "/rest/layergroups/" + name + ".json" : "/rest/workspaces/" + workspace + "/layergroups/" + name + ".json";

            this.asyncLoad(url).then((response: any) => {

                let argument = (response != null) ? response.layerGroup : null;
                
                resolve(argument);
            });
        });
    }


    public asyncLoadLayerGroupList(workspace: string): Promise<Array<any>> {

        return new Promise((resolve, reject) => {

            let url = workspace == null ? "/rest/layergroups.json" : "/rest/workspaces/" + workspace + "/layergroups.json";

            this.asyncLoad(url).then((response: any) => {

                if (typeof response.layerGroups.layerGroup !== "undefined") {
                    resolve(response.layerGroups.layerGroup);
                }
                else {
                    resolve([]);
                }
            });
        });
    }


    public asyncloadLayers(): Promise<Array<any>> {

        return new Promise((resolve, reject) => {

            let url = "/rest/layers.json";

            this.asyncLoad(url).then((response: any) => {

                if (typeof response.layers.layer !== "undefined") {
                    resolve(response.layers.layer);
                }
                else {
                    resolve([]);
                }
            });
        });
    }


    public asyncloadWorkspaces(): Promise<any> {

        return new Promise((resolve, reject) => {
            let url = "/rest/workspaces.json";
            this.asyncLoad(url).then((response: any) => { resolve(response.workspaces.workspace); });
        });
    }


    private asyncLoad(relUrl: string): Promise<any> {

        //################# BEGIN Promise definition ####################
        return new Promise((resolve, reject) => {

            let url = this.mGeoserverUrl + relUrl;

            let request: XMLHttpRequest = new XMLHttpRequest();


            request.open("GET", url, true);

            request.onload = () => {
                try {
                    let obj = JSON.parse(request.responseText);                
                    resolve(obj);
                }
                catch(e) {
                    console.debug("Exception while parsing JSON: " + e);
                    //reject();
                    // TODO: 2 Is it good style to resolve() the promise here even if the request failed?
                    resolve(null);
                }
            }

            request.onerror = () => {
                console.error("HTTP request failed: " + request.statusText, request.responseText);
                reject();
            }

            request.send();
        });
        //################# END Promise definition ####################
    }
}
