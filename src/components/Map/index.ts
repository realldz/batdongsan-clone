import dynamic from "next/dynamic";

export const DraggableMap = dynamic(() => import("./DraggableMap"), {
  ssr: false,
});
