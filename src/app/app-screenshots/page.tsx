import type { Metadata } from "next";
import { AppScreenshotsViewer } from "./app-screenshots-viewer";

export const metadata: Metadata = {
  title: "Customer App Screenshots",
  description: "Vendora customer app screens for Android and iOS",
};

export default function AppScreenshotsPage() {
  return <AppScreenshotsViewer />;
}
