import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MarketingLayout } from "./pages/marketing/MarketingLayout";
import { HomePage } from "./pages/marketing/HomePage";
import { AboutPage } from "./pages/marketing/AboutPage";
import { FeaturesPage } from "./pages/marketing/FeaturesPage";
import { DownloadPage } from "./pages/marketing/DownloadPage";
import { HelpPage } from "./pages/marketing/HelpPage";
import { LegalPage } from "./pages/marketing/LegalPage";
import { AppShell } from "./components/AppShell";
import { FlightsPage } from "./pages/app/FlightsPage";
import { HotelsPage } from "./pages/app/HotelsPage";
import { FoodPage } from "./pages/app/FoodPage";
import { CateringPage } from "./pages/app/CateringPage";
import { TripsPage } from "./pages/app/TripsPage";
import { TripCanvasPage } from "./pages/app/TripCanvasPage";
import { CheckoutPage } from "./pages/app/CheckoutPage";
import { BookingsPage } from "./pages/app/BookingsPage";
import { SettingsPage } from "./pages/app/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoginPage } from "./pages/LoginPage";
import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/legal/terms" element={<LegalPage kind="terms" />} />
          <Route path="/legal/privacy" element={<LegalPage kind="privacy" />} />
        </Route>

        {/* App */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/trips" replace />} />
          <Route path="flights" element={<FlightsPage />} />
          <Route path="hotels" element={<HotelsPage />} />
          <Route path="food" element={<FoodPage />} />
          <Route path="catering" element={<CateringPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="trips/:tripId" element={<TripCanvasPage />} />
          <Route
            path="checkout/:tripId/:planId"
            element={<CheckoutPage />}
          />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
