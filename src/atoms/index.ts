/*
--- EXAMPLE ---
 export const showDeleteModal = atom<boolean>({
    key: 'showDeleteModal',
    default: false,
 }); 
 */

import { atom } from "recoil";

export const loginEmailState = atom<string>({
  key: "loginEmailState",
  default: "",
});

export const loginPasswordState = atom<string>({
  key: "loginPasswordState",
  default: "",
});

export {};
