import { useMemo } from "react";
import { useAppConfig } from "@/context/AppConfigContext";
import { calculateTypeScale, getFontFamilyStack } from "@/lib/scale-utils";

export default function LandingPagePreview() {
  const { config } = useAppConfig();
  const scale = useMemo(
    () => calculateTypeScale(config.baseFontSize, config.scaleRatio),
    [config.baseFontSize, config.scaleRatio]
  );

  const sizeMap = Object.fromEntries(scale.map((e) => [e.token, e.px]));

  const bodyFont = getFontFamilyStack(config.body.fontFamily);
  const headingFont = config.headings.inherit
    ? bodyFont
    : getFontFamilyStack(config.headings.fontFamily);
  const headingWeight = config.headings.inherit ? config.body.fontWeight : config.headings.fontWeight;
  const headingLH = config.headings.inherit ? config.body.lineHeight : config.headings.lineHeight;
  const headingLS = config.headings.inherit ? config.body.letterSpacing : config.headings.letterSpacing;
  const headingColor = config.headings.inherit ? config.body.textColor : config.headings.color;

  return (
    <div
      className="flex h-full flex-col overflow-auto"
      style={{
        backgroundColor: config.body.backgroundColor,
        color: config.body.textColor,
        fontFamily: bodyFont,
        fontWeight: config.body.fontWeight,
        lineHeight: config.body.lineHeight,
        letterSpacing: `${config.body.letterSpacing}em`,
      }}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: `${config.body.textColor}15` }}>
        <span
          style={{
            fontSize: `${sizeMap.h5}px`,
            fontFamily: headingFont,
            fontWeight: headingWeight,
            color: headingColor,
          }}
        >
          Zephtor
        </span>
        <div className="hidden md:flex items-center gap-5">
          {["Home", "Features", "Pricing", "About Us", "Contact"].map((item) => (
            <span
              key={item}
              style={{ fontSize: `${sizeMap.small}px` }}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            >
              {item}
            </span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-1 items-center px-6 py-12 md:px-12">
        <div className="max-w-xl space-y-6">
          <h1
            style={{
              fontSize: `${sizeMap.h1}px`,
              fontFamily: headingFont,
              fontWeight: headingWeight,
              lineHeight: headingLH,
              letterSpacing: `${headingLS}em`,
              color: headingColor,
            }}
          >
            Your digital transformation begins here
          </h1>
          <p
            style={{ fontSize: `${sizeMap.p}px` }}
            className="opacity-75"
          >
            Unlock the full potential of your business. Start your journey today and experience the future of business software.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-lg px-5 py-2.5 font-medium transition-opacity hover:opacity-90"
              style={{
                fontSize: `${sizeMap.small}px`,
                backgroundColor: config.body.textColor,
                color: config.body.backgroundColor,
              }}
            >
              Explore features
            </button>
            <button
              className="rounded-lg border px-5 py-2.5 font-medium transition-opacity hover:opacity-80"
              style={{
                fontSize: `${sizeMap.small}px`,
                borderColor: `${config.body.textColor}30`,
              }}
            >
              Get started
            </button>
          </div>
          <p style={{ fontSize: `${sizeMap.xs}px` }} className="opacity-50">
            No credit card required
          </p>
        </div>

        {/* Decorative element */}
        <div className="ml-auto hidden lg:block">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke={`${config.body.textColor}15`} strokeWidth="1" />
            <circle cx="100" cy="100" r="60" stroke={`${config.body.textColor}10`} strokeWidth="1" />
            <circle cx="100" cy="100" r="40" stroke={`${config.body.textColor}08`} strokeWidth="1" />
            <line x1="20" y1="100" x2="180" y2="100" stroke={`${config.body.textColor}08`} strokeWidth="1" />
            <line x1="100" y1="20" x2="100" y2="180" stroke={`${config.body.textColor}08`} strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
