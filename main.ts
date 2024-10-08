//% color=#4ef0f2 weight=100 icon="\uf468" block="Runtime Variables"
namespace runtimeVariables {
  let variables: { [key: string]: any } = {};

  function getNestedValue(obj: any, path: string): any {
    const keys = path.split(".");
    for (let key of keys) {
      if (obj === undefined || obj === null) {
        return undefined;
      }
      obj = obj[key];
    }
    return obj;
  }

  function setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined || current[keys[i]] === null) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  function removeNestedValue(obj: any, path: string): void {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined) {
        return;
      }
      current = current[keys[i]];
    }
    delete current[keys[keys.length - 1]];
  }

  function existsNestedKey(obj: any, path: string): boolean {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
      if (current[keys[i]] === undefined) {
        return false;
      }
      current = current[keys[i]];
    }
    return true;
  }

  /**
   * Sets a variable to a specified value.
   * @param key The name of the variable, supports dot notation for nested variables.
   * @param value The value to set.
   */
  //% block="set %key to %value"
  //% weight=90
  //% group="Variable Operations"
  export function set(key: string, value: any): void {
    setNestedValue(variables, key, value);
  }

  /**
   * Gets the value of a variable, optionally specifying the type.
   * @param key The name of the variable.
   */
  //% block="get %key"
  //% weight=80
  //% group="Variable Operations"
  //% expandableArgumentMode="toggle"
  export function get(key: string): any {
    let value = getNestedValue(variables, key);
  }

  /**
   * Changes a numeric variable by a specified value.
   * @param key The name of the variable.
   * @param value The value to change by.
   */
  //% block="change %key by %value"
  //% value.shadow=math_number
  //% weight=80
  //% group="Variable Operations"
  export function change(key: string, value: number): void {
    let currentValue = getNestedValue(variables, key);
    if (typeof currentValue !== "number") {
      currentValue = 0;
    }
    setNestedValue(variables, key, currentValue + value);
  }

  /**
   * Removes a variable.
   * @param key The name of the variable.
   */
  //% block="remove %key"
  //% weight=60
  //% group="Variable Operations"
  export function remove(key: string): void {
    removeNestedValue(variables, key);
  }

  /**
   * Checks if a variable exists.
   * @param key The name of the variable.
   */
  //% block="%key exists"
  //% weight=70
  //% group="Variable Operations"
  export function Exists(key: string): boolean {
    return existsNestedKey(variables, key);
  }

  //% block="Convert %value to Number"
  //% group="Type Conversion"
  export function convertToNumber(value: any): number {
    if (typeof value === "number") {
      return value;
    } else if (typeof value === "string") {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    } else {
      return 0;
    }
  }
  //% block="Convert %value to String"
  //% group="Type Conversion"
  export function convertToString(value: any): string {
    if (value === null || value === undefined) {
      return "";
    } else {
      return "" + value;
    }
  }
  //% block="Convert %value to Boolean"
  //% group="Type Conversion"
  export function convertToBoolean(value: any): boolean {
    if (typeof value === "boolean") {
      return value;
    } else if (typeof value === "string") {
      const lowerValue = value.toLowerCase();
      if (lowerValue === "true") return true;
      if (lowerValue === "false") return false;
      return value.length > 0;
    } else if (typeof value === "number") {
      return value !== 0;
    } else {
      return !!value;
    }
  }
  //% block="Convert %value to Sprite"
  //% group="Type Conversion"
  export function convertToSprite(value: any): Sprite {
    if (value && value.kind !== undefined && value.image !== undefined) {
      return value as Sprite;
    } else {
      return null;
    }
  }
  //% block="Convert %value to Image"
  //% group="Type Conversion"
  export function convertToImage(value: any): Image {
    if (
      value &&
      value.width !== undefined &&
      value.height !== undefined &&
      value.getPixel !== undefined
    ) {
      return value as Image;
    } else {
      return null;
    }
  }

  /**
   * Returns undefined.
   */
  //% block="undefined"
  //% weight=10
  //% group="Special Values"
  export function undefinedValue(): any {
    return undefined;
  }

  /**
   * Returns PI.
   */
  //% block="PI"
  //% weight=20
  //% group="Special Values"
  export function piValue(): any {
    return Math.PI;
  }

  /**
   * Returns null.
   */
  //% block="null"
  //% weight=0
  //% group="Special Values"
  export function nullValue(): any {
    return null;
  }
}
