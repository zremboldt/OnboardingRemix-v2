import { cn } from "~/lib/utils";

export const MultiStepProgress = ({ className, location }) => {
  const sections = [
    {
      name: "Profile",
      index: 0,
      paths: [
        "/sign-in",
        "/name",
        "/dob",
        "/address",
        "/homeowner",
        "/recently-moved",
        "/marital-status",
      ],
    },
    {
      name: "Vehicles",
      index: 1,
      paths: ["/which-vehicles"],
    },
    {
      name: "Drivers",
      index: 2,
      paths: ["/which-drivers", "/recent-accident"],
    },
    {
      name: "Review",
      index: 3,
      paths: ["/profile-review", "/create-login"],
    },
    {
      name: "Quote",
      index: 4,
      paths: ["/end"],
    },
  ];

  const currentSectionIndex = sections.findIndex(({ paths }) =>
    paths.includes(location.pathname),
  );

  return (
    <ol
      aria-label="Progress"
      className={cn("flex justify-between gap-3", className)}
    >
      {sections.map(({ name }, i) => (
        <li key={i} className="flex-1">
          <div className="h-0.5 bg-muted-foreground/40">
            <div
              className={cn(
                "h-full bg-foreground w-full transition-all duration-1000 origin-left scale-x-0",
                currentSectionIndex >= i && "scale-x-100",
              )}
            />
          </div>
          <p
            className={cn(
              "text-xs sm:text-sm tracking-tight text-muted-foreground/80 transition-all duration-1000",
              currentSectionIndex >= i && "text-foreground",
            )}
          >
            {name}
          </p>
        </li>
      ))}
    </ol>
  );
  //
  // return (
  //   <ol
  //     className={cn(
  //       "flex items-center w-full text-sm font-medium text-center text-muted-foreground sm:text-base",
  //       className,
  //     )}
  //   >
  //     <li className="flex md:w-full items-center text-primary sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-muted-foreground after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
  //       <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-muted-foreground">
  //         <svg
  //           className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
  //           aria-hidden="true"
  //           xmlns="http://www.w3.org/2000/svg"
  //           fill="currentColor"
  //           viewBox="0 0 20 20"
  //         >
  //           <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
  //         </svg>
  //         Profile
  //       </span>
  //     </li>
  //     <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-muted-foreground after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
  //       <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-muted-foreground">
  //         <span className="me-2">2</span>
  //         Account
  //       </span>
  //     </li>
  //     {/* <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-muted-foreground after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
  //       <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-muted-foreground">
  //         <span className="me-2">3</span>
  //         Review
  //       </span>
  //     </li> */}
  //     <li className="flex items-center">
  //       <span className="me-2">3</span>
  //       Quote
  //     </li>
  //   </ol>
  // );
  //
  // return (
  //   <div className={cn("p-4 space-y-2", className)}>
  //     <h3 className="text-foreground font-semibold">
  //       Step 4: Review your profile
  //     </h3>
  //     <div className="flex max-w-xs gap-3">
  //       <span className="flex-1 h-2 rounded-sm border border-primary bg-primary"></span>
  //       <span className="flex-1 h-2 rounded-sm border border-primary bg-primary"></span>
  //       <span className="flex-1 h-2 rounded-sm border border-primary bg-gray-800"></span>
  //       <span className="flex-1 h-2 rounded-sm border border-primary bg-gray-400"></span>
  //       <span className="flex-1 h-2 rounded-sm border border-primary bg-gray-400"></span>
  //     </div>
  //   </div>
  // );
};
