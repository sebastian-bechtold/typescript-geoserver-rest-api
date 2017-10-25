// TODO: 2 Remove ProxyURL as separate variable, combine it with GeoServerURL

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
            let url = workspace == null ? "/rest/layergroups/" + name + ".json" : "/rest/workspaces/" + workspace + "/layergroups/" + name + ".json";

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


    public loadLayersAsync(): Promise<Array<any>> {

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


    loadWorkspacesAsync(): Promise<any> {

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
                resolve(JSON.parse(request.responseText));
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
