"use client";

import { useState, useRef, useCallback } from "react";
import { useClickOutside } from "./useClickOutside";
import { useEscapeKey } from "./useEscapeKey";

export function useDropdown(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);

  useClickOutside(ref, close);
  useEscapeKey(close, isOpen);

  return { isOpen, open, close, toggle, ref };
}
