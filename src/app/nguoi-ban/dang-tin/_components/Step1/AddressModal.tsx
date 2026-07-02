import React from "react";
import { SearchAddressModal } from "./SearchAddressModal";
import { ConfirmAddressModal } from "./ConfirmAddressModal";

export function AddressModal() {
  return (
    <>
      <SearchAddressModal />
      <ConfirmAddressModal />
    </>
  );
}
