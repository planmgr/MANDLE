interface Tab {
  label: string;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  tabs?: Tab[];
  dark?: boolean;
}

export default function PageHeader({
  title,
  description,
  tabs,
  dark = false,
}: PageHeaderProps) {
  const textColor = dark ? "text-fg-inverse" : "text-fg-primary";
  const subColor = dark ? "text-fg-tertiary" : "text-fg-secondary";

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <h1 className={`font-heading text-[36px] md:text-[48px] tracking-[2px] ${textColor}`}>
        {title}
      </h1>
      {description && (
        <p className={`font-body text-[14px] md:text-[15px] ${subColor} leading-[1.6] max-w-[600px]`}>
          {description}
        </p>
      )}
      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-6 mt-2 border-b border-border-light">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`pb-3 font-caption text-[11px] md:text-[12px] font-medium tracking-[1.5px] transition-colors ${
                tab.active
                  ? `${textColor} border-b-2 ${dark ? "border-fg-inverse" : "border-fg-primary"}`
                  : `${subColor} ${dark ? "hover:text-fg-inverse" : "hover:text-fg-primary"}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
