import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Heading, Link } from "components/documentation";

const FEATURES = [
  {
    src: featureFreeSrc,
    title: "Free Forever",
    text: "OpenResume is created with the belief that everyone should have free and easy access to a modern professional resume design",
  },
  {
    src: featureUSSrc,
    title: "EU + US Presets",
    text: "Built-in A4 and Letter defaults with regional headings and ATS-friendly formatting.",
  },
  {
    src: featurePrivacySrc,
    title: "Privacy Focus",
    text: "OpenResume stores data locally in your browser so only you have access to your data and with complete control",
  },
  {
    src: featureOpenSourceSrc,
    title: "Open-Source",
    text: (
      <>
        OpenResume is an open-source project. This fork is maintained at{" "}
        <Link href="https://github.com/alteixeira20/open-resume">
          GitHub
        </Link>
        , with the original project credited and preserved.
      </>
    ),
  },
];

export const Features = () => {
  return (
    <section className="mx-auto max-w-6xl py-6">
      <div className="w-full">
        <div className="text-center">
          <Heading className="!mt-0 !mb-3">What’s kept from the original?</Heading>
        </div>
        <p className="mt-3 text-center text-sm text-gray-600">
          This fork honors Xitang Zhao’s original vision: a free, open‑source,
          privacy‑first resume builder that keeps the experience simple and
          accessible.
        </p>
        <dl className="mt-6 grid grid-cols-1 justify-items-center gap-y-8 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-16">
          {FEATURES.map(({ src, title, text }) => (
            <div className="px-2" key={title}>
              <div className="relative w-96 self-center rounded-2xl border border-gray-200 bg-white/90 p-4 pl-16 shadow-sm backdrop-blur">
                <dt className="text-2xl font-bold">
                  <Image
                    src={src}
                    className="absolute left-0 top-1 h-12 w-12"
                    alt="Feature icon"
                  />
                  {title}
                </dt>
                <dd className="mt-2">{text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
