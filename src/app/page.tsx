import { Suspense } from "react";
import { QrCodeGenerator } from "@/components/qr-code-generator";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-(family-name:--font-geist-sans)">
      <Suspense fallback={<div>Loading...</div>}>
        <QrCodeGenerator />
      </Suspense>
    </div>
  );
}
