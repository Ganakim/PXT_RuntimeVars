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

  function convertToType(value: any, type: VariableType): any {
    switch (type) {
      case VariableType.Number:
        if (typeof value === "number") {
          return value;
        } else if (typeof value === "string") {
          const num = parseFloat(value);
          return isNaN(num) ? 0 : num;
        } else {
          return 0;
        }
      case VariableType.String:
        if (value === null || value === undefined) {
          return "";
        } else {
          // Use concatenation to convert value to string
          return "" + value;
        }
      case VariableType.Boolean:
        if (typeof value === "boolean") {
          return value;
        } else if (typeof value === "string") {
          const lowerValue = value.toLowerCase();
          if (lowerValue === "true") return true;
          if (lowerValue === "false") return false;
          // Non-empty strings are considered true
          return value.length > 0;
        } else if (typeof value === "number") {
          return value !== 0;
        } else {
          // Use double negation to convert other types to boolean
          return !!value;
        }
      case VariableType.Sprite:
        // Check if value is a Sprite by looking for Sprite-specific properties
        if (value && value.kind !== undefined && value.image !== undefined) {
          return value as Sprite;
        } else {
          return null;
        }
      case VariableType.Image:
        // Check if value is an Image by looking for Image-specific properties
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
      default:
        return value;
    }
  }

  export enum VariableType {
    //% block="any"
    Any = 0,
    //% block="number"
    Number = 1,
    //% block="string"
    String = 2,
    //% block="boolean"
    Boolean = 3,
    //% block="sprite"
    Sprite = 4,
    //% block="image"
    Image = 5,
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
   * @param type [Optional] The type to get the variable as, defaults to 'any'.
   */
  //% block="get %key || as %type"
  //% weight=80
  //% group="Variable Operations"
  //% expandableArgumentMode="toggle"
  //% type.defl=VariableType.Any
  export function get(key: string, type: VariableType = VariableType.Any): any {
    let value = getNestedValue(variables, key);

    return convertToType(value, type);
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
