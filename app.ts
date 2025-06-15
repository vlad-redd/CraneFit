console.log('Hello world');

import { OpenPlans } from "@opengeometry/openplans"
import { Crane } from "./crane"
//import { PolylineBuilder } from "@opengeometry/openplans/types/shape-builder/polyline-builder";

export function hello() { return "Hi" }

export class CraneFit { 
    openPlans: OpenPlans
    constructor(container : HTMLDivElement) {
        this.openPlans = new OpenPlans(container)
    }

    async init() {
        await this.openPlans.setupOpenGeometry("./opengeometry_bg.wasm");

    } 

    addCrane() {
        const crane = new Crane()

        //@ts-ignore
        this.openPlans.addCustomObject(crane)
        return crane
    }

}
