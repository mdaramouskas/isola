export default function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className="py-5 xl:py-7.5 bg-gray-1">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="w-full text-center text-sm font-normal text-dark">
            &copy; {year}. All rights reserved by MikeD.
          </p>
        </div>
      </div>
    </div>
  );
}
