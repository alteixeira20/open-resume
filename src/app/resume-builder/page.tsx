"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { ResumeDownloadBridge } from "components/Resume/ResumeDownloadBridge";

export default function Create() {
  return (
    <Provider store={store}>
      <main className="relative h-[calc(100vh-var(--top-nav-bar-height))] w-full overflow-hidden bg-gray-50">
        <div className="mx-auto grid h-full w-full max-w-screen-2xl grid-cols-3 px-[var(--resume-padding)] md:grid-cols-6">
          <div className="col-span-3 min-h-0 min-w-0">
            <ResumeForm preview={<Resume />} />
          </div>
          <div className="col-span-3 min-h-0 min-w-0 hidden md:block">
            <Resume />
          </div>
        </div>
        <ResumeDownloadBridge />
      </main>
    </Provider>
  );
}
