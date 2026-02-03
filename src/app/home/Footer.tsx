import { Link } from "components/documentation";

export const Footer = () => {
  return (
    <footer className="mx-auto mt-16 max-w-5xl border-t border-gray-200 pt-8 text-sm text-gray-600">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-semibold text-gray-900">OpenResume fork by Alexandre Teixeira</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="https://github.com/alteixeira20">Alexandre on GitHub</Link>
          <Link href="https://github.com/alteixeira20/open-resume">Fork repository</Link>
          <Link href="https://github.com/xitanggg">Original creator (Xitang Zhao)</Link>
        </div>
      </div>
    </footer>
  );
};
