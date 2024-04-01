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
};
