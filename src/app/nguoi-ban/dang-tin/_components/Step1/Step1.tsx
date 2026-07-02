import React from "react";
import { useCreateListing } from "../CreateListingContext";
import { DemandSection } from "./DemandSection";
import { AddressSection } from "./AddressSection";
import { MainInfoSection } from "./MainInfoSection";
import { OtherInfoSection } from "./OtherInfoSection";
import { ContactSection } from "./ContactSection";
import { ContentSection } from "./ContentSection";
import { AddressModal } from "./AddressModal";

export function Step1() {
  const { isAddressConfirmed, setCurrentStep } = useCreateListing();

  return (
    <main className="flex-1 w-[700px] max-w-full mx-auto px-4 py-8 pb-32">
      <DemandSection />
      <AddressSection />

      {isAddressConfirmed && (
        <>
          <MainInfoSection />
          <OtherInfoSection />
          <ContactSection />
          <ContentSection />
        </>
      )}

      <AddressModal />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="w-[700px] max-w-full flex justify-end">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="bg-primary hover:bg-[#c42c23] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm"
          >
            Tiếp tục
          </button>
        </div>
      </footer>
    </main>
  );
}
export default Step1;
