import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Solutions() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Solutions</h1>
      <p className="text-muted-foreground">
        Purpose‑built solutions for farmers, cooperatives and agribusinesses.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Weather‑indexed crop cover</AccordionTrigger>
            <AccordionContent>
              Payouts triggered by rainfall and temperature thresholds using
              Open‑Meteo data. Works even without field loss surveys.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Parametric livestock protection</AccordionTrigger>
            <AccordionContent>
              Region‑level disease and heat stress indicators inform automatic
              claim approvals with vet verification workflows.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Equipment & motor insurance</AccordionTrigger>
            <AccordionContent>
              Digital KYC, policy issuance and claim pickup at farm‑gate for
              tractors and farm vehicles.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Credit‑linked insurance</AccordionTrigger>
            <AccordionContent>
              Embedded covers with lenders and FPOs. Bulk onboarding, premium
              collection and renewal reminders.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
