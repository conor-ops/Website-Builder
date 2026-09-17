/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { calculateBOM } from './estimateCalculator';
import { YardSegment, GateConfig } from '../types';

describe('estimateCalculator - calculateBOM', () => {
  it('correctly calculates basic backyard fence and bill of materials', () => {
    const segments: YardSegment[] = [
      { id: 'seg-1', name: 'Left Side', lengthFeet: 50, singleGates: 1, doubleGates: 0, hasTearOut: false },
      { id: 'seg-2', name: 'Back Side', lengthFeet: 50, singleGates: 0, doubleGates: 0, hasTearOut: false },
    ];

    const gates: GateConfig = {
      singleGatesCount: 1,
      singleGateWidthFt: 4,
      doubleGatesCount: 0,
      doubleGateWidthFt: 0,
      automatedSolarOperator: false,
      keypadAccess: false,
      antiSagKits: false,
    };

    const result = calculateBOM({
      segments,
      tearOutFeet: 0,
      postSpacingFeet: 8,
      railCount: 3,
      heightFeet: 6,
      postType: 'cedar_4x4',
      material: 'cedar_privacy',
      hasRotBoard: false,
      hasCapAndTrim: false,
      hasStaining: false,
      terrain: 'flat',
      gates,
    });

    expect(result.totalLinearFeet).toBe(100);
    expect(result.singleGateKits).toBe(1);
    expect(result.doubleGateKits).toBe(0);
    expect(result.materialsCost).toBeGreaterThan(0);
    expect(result.laborCost).toBeGreaterThan(0);
    expect(result.totalCost).toBe(result.subtotal + result.tax);
  });

  it('correctly includes postmaster steel adder and slope modifiers', () => {
    const segments: YardSegment[] = [
      { id: 'seg-1', name: 'Left Side', lengthFeet: 50, singleGates: 1, doubleGates: 0, hasTearOut: false },
    ];

    const gates: GateConfig = {
      singleGatesCount: 1,
      singleGateWidthFt: 4,
      doubleGatesCount: 0,
      doubleGateWidthFt: 0,
      automatedSolarOperator: false,
      keypadAccess: false,
      antiSagKits: false,
    };

    const flatResult = calculateBOM({
      segments,
      tearOutFeet: 0,
      postSpacingFeet: 8,
      railCount: 3,
      heightFeet: 6,
      postType: 'cedar_4x4',
      material: 'cedar_privacy',
      hasRotBoard: false,
      hasCapAndTrim: false,
      hasStaining: false,
      terrain: 'flat',
      gates,
    });

    const steepPostmasterResult = calculateBOM({
      segments,
      tearOutFeet: 0,
      postSpacingFeet: 8,
      railCount: 3,
      heightFeet: 6,
      postType: 'postmaster_steel',
      material: 'cedar_privacy',
      hasRotBoard: false,
      hasCapAndTrim: false,
      hasStaining: false,
      terrain: 'steep_slope',
      gates,
    });

    expect(steepPostmasterResult.materialsCost).toBeGreaterThan(flatResult.materialsCost);
    expect(steepPostmasterResult.laborCost).toBeGreaterThan(flatResult.laborCost);
  });
});
