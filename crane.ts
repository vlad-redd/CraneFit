// Crane.TS test
// @ts-ignore
import { BaseCircle, Vector3D, CirclePoly } from "@opengeometry/openplans";
import { OpenPlans } from "@opengeometry/openplans";
import { GenericBuilder, IGenericPropertySet } from "@opengeometry/openplans";
import { PolygonBuilder } from "@opengeometry/openplans";

// import { Glyphs } from "@opengeometry/openglyph";
import * as THREE from "three";

export type CraneType = 'mobile' | 'tower' | 'crawler';

// Some Properties Modify Geometry
// Some Properties Modify Material
// Some Properties Triggers other Actions
// TODO: Find a way to differentiate these properties and handle them accordingly

export interface ICranePropertySet extends IGenericPropertySet {
  craneRadius: number;
  craneWidth: number;
  craneHeight: number;
  craneColor: number;
  // craneType: CraneType;
}


export class Crane extends GenericBuilder {
  constructor(private openplans: OpenPlans, config?: ICranePropertySet) {
    super(config);
    // this.ogType = 'Crane';

    this.propertySet.type = 'crane';
    this.propertySet.craneWidth = 2.85; // Default width
    this.propertySet.craneHeight = 13.85; // Default height
    this.propertySet.craneColor = 0xFF0000; // Default color
    this.propertySet.craneRadius = 20; // Default radius

    this.createCraneBody();
    this.createCraneZone();
    this.createCraneLabel();
    this.createCraneZonePoly();

    // Update Geometry based on Event, one or more events can be added
    // this.onPropertyUpdate.add(() => this.createCraneBody());
  }

  set craneRotation(value: number) {
      this.builderRotation = value;
  }

  set craneWidth(value: number) {
    this.propertySet.craneWidth = value;
    this.createCraneBody();    
  }

  set craneHeight(value: number) {
    this.propertySet.craneHeight = value;
    this.createCraneBody();
  }

  set craneRadius(value: number) {
    this.propertySet.craneRadius = value;
    const craneZone = this.childNodes.get('craneZone');
    if (craneZone instanceof BaseCircle) {
      craneZone.radius = value;
      }
    this.createCraneLabel();
    this.createCraneZonePoly();
  }

  // A Polygon Shape
  createCraneBody() {
    if (this.childNodes.has('craneBody')) {
      const existingShape = this.childNodes.get('craneBody');
      if (existingShape instanceof PolygonBuilder) {
        // @ts-ignore
        existingShape.removeFromParent();
        existingShape.dispose();
        this.childNodes.delete('craneBody');
      }
    }

    // Create the body of the crane based on the type
    const points: Array<[number, number, number]> = [];
    const { craneWidth, craneHeight } = this.propertySet;
    // const { position } = this.propertySet.dimensions;

    points.push(
      [-craneWidth / 2, 0, -craneHeight / 2+4], // Bottom left
      [craneWidth / 2, 0, -craneHeight / 2+4], // Bottom right
      [craneWidth / 2, 0, craneHeight / 2+4], // Top right
      [-craneWidth / 2, 0, craneHeight / 2+4] // Top left
    );

    const craneShape = new PolygonBuilder();
    craneShape.insertMultiplePoints(points);
    // @ts-ignore
    craneShape.material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      depthTest: false
    });

    // @ts-ignore
    craneShape.outline = true; // Enable outline for the crane body
    // @ts-ignore
    this.add(craneShape);
    this.childNodes.set('craneBody', craneShape);
  }

    createCraneLabel() {
      if (this.childNodes.has('tonnageLabel')) {
        const existingShape = this.childNodes.get('tonnageLabel');
        existingShape.removeFromParent();
        this.childNodes.delete('tonnageLabel');            
      }
      // Create Label using OpenGlyph 
      const liftRadius = this.propertySet.craneRadius;
      const liftTonnage = 100 / liftRadius;

      const textMesh = this.openplans.glyph(
        `${liftTonnage.toFixed(1)}tonnes at ${liftRadius.toFixed(1)}m` ,
        10,
        0x000000,
        false
      );

      textMesh.position.set(0, 0, this.propertySet.craneRadius + 0.5)

      // @ts-ignore
      this.add(textMesh)
      this.childNodes.set('tonnageLabel', textMesh)
  }

  createCraneZonePoly() {
    if (this.childNodes.has('craneZonePoly')) {
      const existingShape = this.childNodes.get('craneZonePoly');
      if (existingShape instanceof CirclePoly) {
        console.log('Removing existing crane zone polygon');
        console.log(existingShape);
        existingShape.removeFromParent();
        existingShape.dispose();
        this.childNodes.delete('craneZonePoly');
      }
    }

    const baseCircle = this.childNodes.get('craneZone');
    if (!(baseCircle instanceof BaseCircle)) {
      console.error('Crane zone base circle not found or is not an instance of BaseCircle');
      return;
    }
    const circlePoly = new CirclePoly(baseCircle);
    circlePoly.geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: this.propertySet.craneColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      // wireframe: true
    });
    circlePoly.material = material;
    circlePoly.position.set(0, 0.01, 0);
    // @ts-ignore
    this.add(circlePoly);
    this.childNodes.set('craneZonePoly', circlePoly);
  }

  createCraneZone() {
    if (this.childNodes.has('craneZonePoly')) {
      const existingShape = this.childNodes.get('craneZonePoly');
      if (existingShape instanceof CirclePoly) {
        // @ts-ignore
        existingShape.removeFromParent();
        existingShape.dispose();
        this.childNodes.delete('craneZonePoly');
      }
    }


    const { craneRadius } = this.propertySet;
    
    const circleArc = new BaseCircle({
      radius: craneRadius,
      segments: 32,
      position: new Vector3D(0, 0, 0),
      startAngle: 0,
      endAngle: Math.PI * 2,
    })
    circleArc.color = this.propertySet.craneColor;

    // @ts-ignore
    this.add(circleArc);
    this.childNodes.set('craneZone', circleArc);
  }


}

