/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any) {
  // check if it as axios error and handle accordingly else just return the message
  if (error.response) {
    if (error.response.data) {
      const msg = error.response.data.message;
      if (Array.isArray(msg)) {
        return msg.join(", ");
      }
      return msg;
    }
  } else {
    return error.message;
  }
}

/**
 * function that takes a key string like 'name' or 'name.first' and returns a function that takes an object and returns the value of the key in the object
 * @param key - the key to get the value of
 * @param obj - the object to get the value from
 */
export const getObjValue = (key: string | number, obj: any) => {
  const keys = key.toString().split(".");
  let result = obj;
  for (const key of keys) {
    if (result && Object.prototype.hasOwnProperty.call(result, key)) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result as string;
};

export const fractionValue = (value: number, fractionDigits = 2) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const isDateString = (str: string) => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/; // ISO date format
  const yyyyMMddRegex = /^\d{4}-\d{2}-\d{2}$/; // yyyy-mm-dd
  const ddMMyyyyRegex = /^\d{2}-\d{2}-\d{4}$/; // dd-mm-yyyy
  const mmDDyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/; // mm/dd/yyyy

  // Check if it matches any date format regex
  if (
    isoRegex.test(str) ||
    yyyyMMddRegex.test(str) ||
    ddMMyyyyRegex.test(str) ||
    mmDDyyyyRegex.test(str)
  ) {
    const date = new Date(str);

    // Check if it is a valid date and not something like "3999" or "00"
    if (!isNaN(date.getTime())) {
      // Ensure it's a real date string by comparing parsed date with input
      const parsedStr = date.toISOString().split("T")[0];
      if (str.includes(parsedStr)) {
        return true;
      }
    }
  }

  return false;
};
