"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const paymentSchema = z.object({
  stripeEnabled: z.boolean(),
  paypalEnabled: z.boolean(),
  applePayEnabled: z.boolean(),
  googlePayEnabled: z.boolean(),
  bankTransferEnabled: z.boolean(),
});

const shippingSchema = z.object({
  defaultCarrier: z.string(),
  freeShippingThreshold: z.coerce.number().min(0),
  flatRate: z.coerce.number().min(0),
  expressEnabled: z.boolean(),
  internationalEnabled: z.boolean(),
  handlingDays: z.coerce.number().min(0),
});

const currencySchema = z.object({
  defaultCurrency: z.string(),
  displayFormat: z.string(),
  autoConvert: z.boolean(),
  usdRate: z.string(),
  eurRate: z.string(),
  gbpRate: z.string(),
});

const languageSchema = z.object({
  defaultLocale: z.string(),
  english: z.boolean(),
  spanish: z.boolean(),
  french: z.boolean(),
  german: z.boolean(),
  arabic: z.boolean(),
});

const notificationsSchema = z.object({
  emailOrders: z.boolean(),
  emailVendors: z.boolean(),
  emailMarketing: z.boolean(),
  smsOrders: z.boolean(),
  smsAlerts: z.boolean(),
  pushOrders: z.boolean(),
  pushPromos: z.boolean(),
});

const apiSchema = z.object({
  baseUrl: z.string().url(),
  webhookUrl: z.string().url().or(z.literal("")),
  apiKey: z.string(),
});

type PaymentForm = z.infer<typeof paymentSchema>;
type ShippingForm = z.infer<typeof shippingSchema>;
type CurrencyForm = z.infer<typeof currencySchema>;
type LanguageForm = z.infer<typeof languageSchema>;
type NotificationsForm = z.infer<typeof notificationsSchema>;
type ApiForm = z.infer<typeof apiSchema>;

function maskKey(key: string) {
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 7)}${"•".repeat(12)}${key.slice(-4)}`;
}

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      stripeEnabled: true,
      paypalEnabled: true,
      applePayEnabled: false,
      googlePayEnabled: true,
      bankTransferEnabled: false,
    },
  });

  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      defaultCarrier: "ups",
      freeShippingThreshold: 75,
      flatRate: 6.99,
      expressEnabled: true,
      internationalEnabled: true,
      handlingDays: 1,
    },
  });

  const currencyForm = useForm<CurrencyForm>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      defaultCurrency: "USD",
      displayFormat: "symbol",
      autoConvert: true,
      usdRate: "1.00",
      eurRate: "0.92",
      gbpRate: "0.79",
    },
  });

  const languageForm = useForm<LanguageForm>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      defaultLocale: "en-US",
      english: true,
      spanish: true,
      french: false,
      german: false,
      arabic: true,
    },
  });

  const notificationsForm = useForm<NotificationsForm>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailOrders: true,
      emailVendors: true,
      emailMarketing: false,
      smsOrders: true,
      smsAlerts: true,
      pushOrders: true,
      pushPromos: false,
    },
  });

  const apiForm = useForm<ApiForm>({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      baseUrl: "https://api.marketplace.example.com/v1",
      webhookUrl: "https://admin.marketplace.example.com/webhooks",
      apiKey: "mp_live_a8f3c9e2b1d04765f0e9c8a7b6d5e4f3",
    },
  });

  function saveTab(tab: string) {
    toast.success("Settings saved", {
      description: `${tab} configuration updated successfully.`,
    });
  }

  async function copyApiKey() {
    const key = apiForm.getValues("apiKey");
    try {
      await navigator.clipboard.writeText(key);
      toast.success("API key copied");
    } catch {
      toast.error("Unable to copy API key");
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure marketplace payments, shipping, and platform options"
      />

      <Tabs defaultValue="payment" className="space-y-6">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment settings</CardTitle>
              <CardDescription>
                Connect processors and enable checkout methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {(
                  [
                    ["stripeEnabled", "Stripe"],
                    ["paypalEnabled", "PayPal"],
                    ["applePayEnabled", "Apple Pay"],
                    ["googlePayEnabled", "Google Pay"],
                    ["bankTransferEnabled", "Bank transfer"],
                  ] as const
                ).map(([field, label]) => (
                  <div
                    key={field}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <Label htmlFor={field}>{label}</Label>
                    <Switch
                      id={field}
                      checked={paymentForm.watch(field)}
                      onCheckedChange={(checked) =>
                        paymentForm.setValue(field, checked)
                      }
                    />
                  </div>
                ))}
              </div>
              <Button onClick={() => saveTab("Payment")}>
                <Save className="h-4 w-4" />
                Save payment settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping settings</CardTitle>
              <CardDescription>
                Default carriers, rates, and fulfillment options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Default carrier</Label>
                  <Select
                    value={shippingForm.watch("defaultCarrier")}
                    onValueChange={(v) =>
                      shippingForm.setValue("defaultCarrier", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="free-ship">Free shipping threshold ($)</Label>
                  <Input
                    id="free-ship"
                    type="number"
                    {...shippingForm.register("freeShippingThreshold")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="flat-rate">Flat rate ($)</Label>
                  <Input
                    id="flat-rate"
                    type="number"
                    step="0.01"
                    {...shippingForm.register("flatRate")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="handling">Handling days</Label>
                  <Input
                    id="handling"
                    type="number"
                    {...shippingForm.register("handlingDays")}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <Label htmlFor="express">Express shipping</Label>
                  <Switch
                    id="express"
                    checked={shippingForm.watch("expressEnabled")}
                    onCheckedChange={(c) =>
                      shippingForm.setValue("expressEnabled", c)
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <Label htmlFor="intl">International shipping</Label>
                  <Switch
                    id="intl"
                    checked={shippingForm.watch("internationalEnabled")}
                    onCheckedChange={(c) =>
                      shippingForm.setValue("internationalEnabled", c)
                    }
                  />
                </div>
              </div>
              <Button onClick={() => saveTab("Shipping")}>
                <Save className="h-4 w-4" />
                Save shipping settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency">
          <Card>
            <CardHeader>
              <CardTitle>Currency settings</CardTitle>
              <CardDescription>
                Default store currency and exchange rate display.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Default currency</Label>
                  <Select
                    value={currencyForm.watch("defaultCurrency")}
                    onValueChange={(v) =>
                      currencyForm.setValue("defaultCurrency", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                      <SelectItem value="GBP">GBP — British Pound</SelectItem>
                      <SelectItem value="AED">AED — UAE Dirham</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Display format</Label>
                  <Select
                    value={currencyForm.watch("displayFormat")}
                    onValueChange={(v) =>
                      currencyForm.setValue("displayFormat", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="symbol">Symbol ($100)</SelectItem>
                      <SelectItem value="code">Code (USD 100)</SelectItem>
                      <SelectItem value="name">Name (100 US dollars)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <Label htmlFor="auto-convert">Auto-convert prices</Label>
                  <p className="text-xs text-muted-foreground">
                    Show localized prices based on visitor location
                  </p>
                </div>
                <Switch
                  id="auto-convert"
                  checked={currencyForm.watch("autoConvert")}
                  onCheckedChange={(c) => currencyForm.setValue("autoConvert", c)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label>USD rate</Label>
                  <Input readOnly {...currencyForm.register("usdRate")} />
                </div>
                <div className="grid gap-2">
                  <Label>EUR rate</Label>
                  <Input readOnly {...currencyForm.register("eurRate")} />
                </div>
                <div className="grid gap-2">
                  <Label>GBP rate</Label>
                  <Input readOnly {...currencyForm.register("gbpRate")} />
                </div>
              </div>
              <Button onClick={() => saveTab("Currency")}>
                <Save className="h-4 w-4" />
                Save currency settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language settings</CardTitle>
              <CardDescription>
                Default locale and available storefront languages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2 max-w-sm">
                <Label>Default locale</Label>
                <Select
                  value={languageForm.watch("defaultLocale")}
                  onValueChange={(v) => languageForm.setValue("defaultLocale", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="ar-AE">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-4">
                {(
                  [
                    ["english", "English"],
                    ["spanish", "Spanish"],
                    ["french", "French"],
                    ["german", "German"],
                    ["arabic", "Arabic"],
                  ] as const
                ).map(([field, label]) => (
                  <div
                    key={field}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <Label htmlFor={field}>{label}</Label>
                    <Switch
                      id={field}
                      checked={languageForm.watch(field)}
                      onCheckedChange={(c) => languageForm.setValue(field, c)}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={() => saveTab("Language")}>
                <Save className="h-4 w-4" />
                Save language settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification settings</CardTitle>
              <CardDescription>
                Channel preferences for transactional and marketing alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold">Email</h3>
                <div className="space-y-3">
                  {(
                    [
                      ["emailOrders", "Order confirmations"],
                      ["emailVendors", "Vendor updates"],
                      ["emailMarketing", "Marketing campaigns"],
                    ] as const
                  ).map(([field, label]) => (
                    <div
                      key={field}
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                    >
                      <Label htmlFor={field}>{label}</Label>
                      <Switch
                        id={field}
                        checked={notificationsForm.watch(field)}
                        onCheckedChange={(c) =>
                          notificationsForm.setValue(field, c)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">SMS</h3>
                <div className="space-y-3">
                  {(
                    [
                      ["smsOrders", "Order status SMS"],
                      ["smsAlerts", "Security & fraud alerts"],
                    ] as const
                  ).map(([field, label]) => (
                    <div
                      key={field}
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                    >
                      <Label htmlFor={field}>{label}</Label>
                      <Switch
                        id={field}
                        checked={notificationsForm.watch(field)}
                        onCheckedChange={(c) =>
                          notificationsForm.setValue(field, c)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">Push</h3>
                <div className="space-y-3">
                  {(
                    [
                      ["pushOrders", "Order push notifications"],
                      ["pushPromos", "Promo push notifications"],
                    ] as const
                  ).map(([field, label]) => (
                    <div
                      key={field}
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                    >
                      <Label htmlFor={field}>{label}</Label>
                      <Switch
                        id={field}
                        checked={notificationsForm.watch(field)}
                        onCheckedChange={(c) =>
                          notificationsForm.setValue(field, c)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => saveTab("Notifications")}>
                <Save className="h-4 w-4" />
                Save notification settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API settings</CardTitle>
              <CardDescription>
                Integration endpoints and platform API credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="base-url">Base URL</Label>
                  <Input id="base-url" {...apiForm.register("baseUrl")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" {...apiForm.register("webhookUrl")} />
                </div>
                <div className="grid gap-2">
                  <Label>API key</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      className="font-mono text-sm"
                      value={
                        showApiKey
                          ? apiForm.watch("apiKey")
                          : maskKey(apiForm.watch("apiKey"))
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey((v) => !v)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={copyApiKey}>
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={() => saveTab("API")}>
                <Save className="h-4 w-4" />
                Save API settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
