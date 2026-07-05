"use client";

import React, { Suspense } from "react";
import { CreateListingProvider, useCreateListing } from "./_components/CreateListingContext";
import { CreateListingHeader } from "./_components/CreateListingHeader";
import { Step1 } from "./_components/Step1/Step1";
import { Step2 } from "./_components/Step2";
import { Step3 } from "./_components/Step3";

export default function CreateListingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-500 font-bold">
          Đang tải...
        </div>
      }
    >
      <CreateListingProvider>
        <CreateListingPageInner />
      </CreateListingProvider>
    </Suspense>
  );
}

function CreateListingPageInner() {
  const {
    currentStep,
    setCurrentStep,
    setImageFiles,
    setImageUrls,
    imageUrls,
    isEditMode,
    handleSubmitListing,
    isSubmitting,
    submitMessage,
  } = useCreateListing();

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col font-sans text-[14px] text-[#2c2c2c]">
      <CreateListingHeader />

      <div className={currentStep === 1 ? "block" : "hidden"}>
        <Step1 />
      </div>

      <div className={currentStep === 2 ? "block" : "hidden"}>
        <Step2
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
          onFilesChange={setImageFiles}
          onImageUrlsChange={setImageUrls}
          imageUrls={imageUrls}
          isEditMode={isEditMode}
        />
      </div>

      <div className={currentStep === 3 ? "block" : "hidden"}>
        <Step3
          onBack={() => setCurrentStep(2)}
          onSubmit={handleSubmitListing}
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
        />
      </div>

      {/* Floating Action Button (Chat) */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          type="button"
          className="w-[52px] h-[52px] bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#c42c23] transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM13 14H11V12H13V14ZM13 10H11V6H13V10Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}