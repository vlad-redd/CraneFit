// Crane.TS test

import { PolygonBuilder } from "@opengeometry/openplans";
import { IPolylineBuilder, PolylineBuilder } from "@opengeometry/openplans";
import * as THREE from "three";

interface ICrance extends IPolylineBuilder {
  // Additional Properties to Crane
  craneWidth: number;
  craneHeight: number;
  craneColor: number;
}

export class Crane extends PolylineBuilder {
  ogType: string = 'MobileCrane';
  mobileCraneShape: PolygonBuilder;

  subChild: Map<string, THREE.Object3D> = new Map();

  craneSet: ICrance = {
    craneWidth: 2,
    craneHeight: 5,
    craneColor: 0xFF0000,
    labelName: "",
    type: "polyline",
    dimensions: {
      start: {
        x: 0,
        y: 0,
        z: 0
      },
      end: {
        x: 1,
        y: 0,
        z: 0
      },
      width: 0
    },
    color: 0,
    coordinates: []
  }

  set craneWidth(value: number) {
    // @ts-ignore
    this.propertySet.craneWidth = value;
      this.mobileCraneShape = this.createCraneShape();

      // @ts-ignore
    this.add(this.mobileCraneShape);
  }

  set craneHeight(value: number) {
    // @ts-ignore
    this.propertySet.craneHeight = value;
      this.mobileCraneShape = this.createCraneShape();

      // @ts-ignore
    this.add(this.mobileCraneShape);
  }

  constructor(crane?: ICrance) {
    super();

    if (!crane) {
      this.propertySet = { ...this.propertySet, ...this.craneSet };
    } else {
      this.propertySet = { ...this.propertySet, ...crane };
    }

    this.insertPoint(0, 0, 0); // Start point
    this.insertPoint(2, 0, 0); // Right point

      this.mobileCraneShape = this.createCraneShape();

      // @ts-ignore
    this.add(this.mobileCraneShape);
  }

  createCraneShape() {
    if (this.subChild.has('craneShape')) {
      const existingShape = this.subChild.get('craneShape');
      if (existingShape instanceof PolygonBuilder) {
        existingShape.removeFromParent();
        existingShape.dispose();
        this.subChild.delete('craneShape');
      }
    }

    const points: Array<[number, number, number]> = [];

    const { craneWidth, craneHeight, craneColor } = this.propertySet as ICrance;
    console.log('Creating crane shape with width:', craneWidth, 'and height:', craneHeight);

    points.push(
      [0, 0, 0], // Start point
      [craneWidth, 0, 0], // Right point
      [craneWidth, 0, craneHeight], // Top right point
      [0, 0, craneHeight], // Top left point
    )

    const craneShape = new PolygonBuilder;
      craneShape.insertMultiplePoints(points);

      // @ts-ignore
    craneShape.material = new THREE.MeshBasicMaterial({
      color: craneColor,
      side: THREE.DoubleSide,
      depthWrite: true
    });

      // @ts-ignore
    this.subChild.set('craneShape', craneShape);
    return craneShape;
  }
}