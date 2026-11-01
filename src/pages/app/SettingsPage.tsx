import { useState } from "react";
import { applyTheme, usePrefs } from "@/store/prefsStore";
import type { ThemePref } from "@/store/prefsStore";
import { applyReduceMotionClass } from "@/lib/motion";
import { useTrips } from "@/store/tripStore";
import type { Currency } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label, Select } from "@/components/ui/Field";
import { PageHeader } from "@/components/PageHeader";

export function SettingsPage() {
  const prefs = usePrefs();
  const resetDemo = useTrips((s) => s.resetDemo);
  const [confirming, setConfirming] = useState(false);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Currency, theme, and demo data." />
      <div className="max-w-xl p-4 lg:p-8">
        <Card className="mb-4 p-5">
          <h2 className="text-h2 mb-4">Appearance</h2>
          <div className="mb-4">
            <Label htmlFor="theme">Theme</Label>
            <Select
              id="theme"
              value={prefs.theme}
              onChange={(e) => {
                const v = e.target.value as ThemePref;
                prefs.setTheme(v);
                applyTheme(v);
              }}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="motion">Reduce motion</Label>
            <Select
              id="motion"
              value={prefs.reduceMotion}
              onChange={(e) => {
                const v = e.target.value as "system" | "on" | "off";
                prefs.setReduceMotion(v);
                applyReduceMotionClass(v);
              }}
            >
              <option value="system">System</option>
              <option value="on">On</option>
              <option value="off">Off</option>
            </Select>
          </div>
        </Card>

        <Card className="mb-4 p-5">
          <h2 className="text-h2 mb-4">Regional</h2>
          <Label htmlFor="currency">Currency</Label>
          <Select
            id="currency"
            value={prefs.currency}
            onChange={(e) => prefs.setCurrency(e.target.value as Currency)}
          >
            <option value="PHP">PHP — Philippine peso</option>
            <option value="USD">USD — US dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — Pound sterling</option>
          </Select>
        </Card>

        <Card className="p-5">
          <h2 className="text-h2 mb-2">Data</h2>
          <p className="mb-4 text-[0.875rem] text-[var(--color-ink-muted)]">
            Your plans and bookings are stored on this device. Resetting erases
            every trip and booking.
          </p>
          {confirming ? (
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  resetDemo();
                  setConfirming(false);
                }}
              >
                Erase everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                Keep my data
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirming(true)}>
              Reset demo data
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
