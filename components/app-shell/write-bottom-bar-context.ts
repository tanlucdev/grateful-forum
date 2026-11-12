"use client";

import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export const WriteBottomBarContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {});
export const useWriteBottomBar = () => useContext(WriteBottomBarContext);
