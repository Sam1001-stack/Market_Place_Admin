"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, TabletSmartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type Platform = "android" | "ios";

const SCREENS = [
  { id: "01-splash", label: "Splash" },
  { id: "02-login", label: "Login" },
  { id: "03-register", label: "Register" },
  { id: "04-otp", label: "OTP Verification" },
  { id: "05-forgot-password", label: "Forgot Password" },
  { id: "06-home", label: "Marketplace Home" },
  { id: "07-categories", label: "Categories" },
  { id: "08-search", label: "Search" },
  { id: "09-product-list", label: "Product Listing" },
  { id: "10-product-details", label: "Product Details" },
  { id: "11-vendor-store", label: "Vendor Store" },
  { id: "12-wishlist", label: "Wishlist" },
  { id: "13-cart", label: "Multi-vendor Cart" },
  { id: "14-checkout", label: "Checkout" },
  { id: "15-payment", label: "Payment" },
  { id: "16-order-confirmation", label: "Order Confirmation" },
  { id: "17-order-history", label: "Order History" },
  { id: "18-order-details", label: "Order Details" },
  { id: "19-tracking", label: "Tracking Timeline" },
  { id: "20-profile", label: "Profile / Account" },
  { id: "21-addresses", label: "Addresses" },
  { id: "22-wallet", label: "Wallet" },
  { id: "23-notifications", label: "Notifications" },
  { id: "24-settings", label: "Settings" },
] as const;

export function AppScreenshotsViewer() {
  const [platform, setPlatform] = useState<Platform>("android");

  const shots = useMemo(
    () =>
      SCREENS.map((screen) => ({
        ...screen,
        src: `/app-screenshots/${platform}/${screen.id}.png`,
      })),
    [platform]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e6f7f5_0%,_#f0f3f8_45%,_#e8edf5_100%)]">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              MarketHub · Public preview
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Customer app screenshots
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Vendora customer app screens for Android and iOS. This route is
              unprotected and sits outside the admin shell.
            </p>
          </div>

          <div
            role="group"
            aria-label="Platform toggle"
            className="inline-flex shrink-0 rounded-2xl bg-white/80 p-1.5 shadow-[var(--shadow-card)] ring-1 ring-slate-200/80 backdrop-blur"
          >
            <PlatformButton
              active={platform === "android"}
              onClick={() => setPlatform("android")}
              icon={<TabletSmartphone className="h-4 w-4" />}
              label="Android"
            />
            <PlatformButton
              active={platform === "ios"}
              onClick={() => setPlatform("ios")}
              icon={<Smartphone className="h-4 w-4" />}
              label="iOS"
            />
          </div>
        </header>

        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {platform === "android" ? "Android" : "iOS"}
            </span>{" "}
            · {shots.length} screens
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {shots.map((screen, index) => (
              <motion.figure
                key={screen.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.35), duration: 0.3 }}
                className="group overflow-hidden rounded-2xl bg-white/90 p-4 shadow-[var(--shadow-card)] ring-1 ring-slate-200/70"
              >
                <div className="relative mx-auto aspect-[9/19] w-full max-w-[260px] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={screen.src}
                    alt={`${screen.label} — ${platform}`}
                    fill
                    sizes="(max-width: 640px) 90vw, 260px"
                    className="object-contain"
                    priority={index < 4}
                  />
                </div>
                <figcaption className="mt-3 text-center">
                  <p className="text-sm font-medium text-slate-900">{screen.label}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                    {screen.id}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PlatformButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-teal-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
