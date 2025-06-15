console.log('Hello world');

import { OpenPlans } from "@opengeometry/openplans"
import { Crane } from "./crane"
//import { PolylineBuilder } from "@opengeometry/openplans/types/shape-builder/polyline-builder";

export function hello() { return "Hi" }

export class CraneFit { 
    openPlans: OpenPlans
    tileImage: Base64URLString = "";

    constructor(container : HTMLDivElement) {
        this.openPlans = new OpenPlans(container)
        this.openPlans.showGrid = false;
    }

    async init() {
        await this.openPlans.setupOpenGeometry("./opengeometry_bg.wasm");

    } 

    addCrane() {
        const crane = new Crane(this.openPlans)

        //@ts-ignore
        this.openPlans.addCustomObject(crane)
        return crane
    }


    generateTile(latitude: any, longitude: any, zoom: any) {
        const requestOptions: any = {
            method: "GET",
            redirect: "follow"
        };

        const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${latitude},${longitude},${zoom},0/300x200@2x?access_token=pk.eyJ1IjoibWFuZXZpc2h3YWplZXQxIiwiYSI6ImNsN2NrYnJiZzB0bWkzb254eG9nMjc4ZWkifQ.62_f1MIY7KL8MXJTyZUGkw`;

        fetch(mapboxUrl, requestOptions)
        .then((res) => res.blob()) // ✅ Fetch as blob
        .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                if (!dataUrl || typeof dataUrl !== 'string') return;
                this.openPlans.addImagePlane(dataUrl);
            };
            reader.readAsDataURL(blob);
        })
        .catch(console.error);
    }

}
