import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiHome,
  FiMail,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { CreateSubscription } from "@/lib/actions/subsciption";
// import { CreateSubscription } from "@/lib/actions/subscription";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const formatAmount = (amount, currency) => {
  if (!amount) return "Paid";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount / 100);
};

export default async function Success({ searchParams }) {
  const params = await searchParams;
  const sessionId = params?.session_id;

  if (!sessionId) {
    redirect("/pricing");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    redirect("/pricing");
  }

  const customerEmail =
    session?.customer_details?.email || session?.customer_email || "";

  const metadata = session?.metadata || {};

  const lineItem = session?.line_items?.data?.[0];

  const planId = metadata?.planId || metadata?.plan_id || "";

  const planName =
    metadata?.planName ||
    lineItem?.description ||
    lineItem?.price?.nickname ||
    "Rolebix Plan";

  const paidAmount = formatAmount(session?.amount_total, session?.currency);

  if (session.status !== "complete") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.25),transparent_34%),linear-gradient(180deg,#181818_0%,#050505_55%,#000000_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[36px] border border-red-500/20 bg-[#111111]/90 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
              !
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">
              Payment not completed
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55">
              Your payment session was not completed. Please try again or choose
              another plan.
            </p>

            <Link
              href="/pricing"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Back to Pricing
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  let subscriptionResult = null;

  if (customerEmail && planId) {
    const subInfo = {
      email: customerEmail,
      planId,
      planName,
      stripeSessionId: session.id,
      stripeCustomerId: session.customer || "",
      stripeSubscriptionId: session.subscription || "",
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    };

    subscriptionResult = await CreateSubscription(subInfo);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.28),transparent_34%),linear-gradient(180deg,#181818_0%,#050505_55%,#000000_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-28 h-56 w-56 rounded-full bg-[#7C5CFF]/10 blur-[90px]" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[40px] border border-white/10 bg-[#111111]/90 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="relative p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_36%)]" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-green-400/25 bg-green-500/10 text-green-300 shadow-lg shadow-green-500/10">
                <FiCheckCircle className="h-10 w-10" />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-300">
                Payment Successful
              </div>

              <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Rolebix plan is active.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                Thank you for upgrading. A confirmation email will be sent to{" "}
                <span className="font-semibold text-white">
                  {customerEmail || "your email"}
                </span>
                .
              </p>

              <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
                <SuccessInfoCard
                  icon={<FiZap />}
                  label="Plan"
                  value={planName}
                />

                <SuccessInfoCard
                  icon={<FiCreditCard />}
                  label="Amount"
                  value={paidAmount}
                />

                <SuccessInfoCard
                  icon={<FiShield />}
                  label="Status"
                  value={
                    subscriptionResult?.success
                      ? "Confirmed"
                      : "Payment Confirmed"
                  }
                />
              </div>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Go to Dashboard
                  <FiArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <FiHome className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/6 p-4">
                <p className="flex flex-col items-center justify-center gap-2 text-sm leading-6 text-white/50 sm:flex-row">
                  <FiMail className="h-4 w-4 text-violet-300" />
                  Need help? Contact us at{" "}
                  <a
                    href="mailto:orders@example.com"
                    className="font-medium text-violet-300 transition hover:text-violet-200"
                  >
                    orders@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const SuccessInfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-5 text-left">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-violet-200">
        {icon}
      </div>

      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-white/80">
        {value || "Not available"}
      </p>
    </div>
  );
};