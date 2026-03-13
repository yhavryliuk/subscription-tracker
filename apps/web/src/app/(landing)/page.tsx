import Link from "next/link";

const metrics = [
  { value: "42%", label: "Fewer unnecessary subscriptions in 30 days" },
  { value: "2.3x", label: "Faster team expense control" },
  { value: "99.9%", label: "Uptime and reliable data access" },
];

const features = [
  {
    title: "Unified view of all subscriptions",
    description:
      "Track SaaS, streaming services, and tools in one interface with tags and filters.",
  },
  {
    title: "Smart reminders",
    description:
      "Get notified before renewal and decide in advance: keep, switch, or cancel.",
  },
  {
    title: "Analytics and forecasting",
    description:
      "Track monthly spending trends and forecast budget impact.",
  },
  {
    title: "Team workspaces",
    description:
      "Separate personal and business subscriptions, assign owners, and track statuses.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Import your subscriptions",
    description:
      "Add services manually or upload a CSV in minutes with no complex setup.",
  },
  {
    step: "02",
    title: "Configure rules",
    description:
      "Set limits, categories, and automated reminders to match your workflow.",
  },
  {
    step: "03",
    title: "Optimize your budget",
    description:
      "Find duplicates, cancel what you do not need, and track results in spend reports.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For personal tracking and first steps",
    features: [
      "Up to 15 active subscriptions",
      "Basic reminders",
      "3 months of payment history",
    ],
    cta: "Start for free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For freelancers and small teams",
    features: [
      "Unlimited subscriptions",
      "Advanced analytics",
      "Team access for up to 5 users",
    ],
    cta: "Choose Pro",
    href: "/sign-up",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "$39",
    period: "/month",
    description: "For teams with a large SaaS stack",
    features: [
      "Roles and access permissions",
      "Report export and API",
      "Priority support",
    ],
    cta: "Contact us",
    href: "/sign-up",
    highlighted: false,
  },
];

const feedback = [
  {
    quote:
      "In the first quarter, we removed 7 duplicate services and saved over $2,000.",
    author: "Marina, COO @ Delta Studio",
  },
  {
    quote:
      "Now we see all upcoming renewals in advance and no longer get surprise charges.",
    author: "Ilya, Founder @ Pixel Forge",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-cover bg-center opacity-15"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-8rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-emerald-400/30 blur-3xl"
      />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-14 pt-16 sm:px-6 lg:pb-20 lg:pt-24">
        <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Spend control without the busywork
        </span>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-6">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Manage subscriptions like a product metric, not a notes list.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Subscription Tracker gives you a complete spending view, warns you
              before renewals, and helps you quickly disable underperforming
              services.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                href="/sign-up"
              >
                Try for free
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
                href="#pricing"
              >
                View pricing
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">Upcoming charge</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">$49.00</p>
            <p className="mt-1 text-sm text-slate-600">Notion Team • March 14</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <span className="text-sm text-slate-600">Expected payments</span>
                <span className="text-sm font-semibold text-slate-900">
                  $312
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <span className="text-sm text-slate-600">Savings potential</span>
                <span className="text-sm font-semibold text-emerald-700">
                  $96 / month
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((item) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center sm:px-5"
              key={item.label}
            >
              <p className="text-2xl font-semibold tracking-tight text-slate-900">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16"
        id="features"
      >
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need for transparent subscription management
          </h2>
          <p className="mt-3 text-slate-600">
            From first import to monthly reporting, with no complicated onboarding
            or extra clicks.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              key={feature.title}
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16"
        id="workflow"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Go live in one day
          </h2>
          <p className="mt-3 text-slate-600">
            The onboarding process is split into three steps you can complete
            without a dedicated integration team.
          </p>
          <div className="mt-6 space-y-4">
            {workflow.map((item) => (
              <div className="flex gap-3" key={item.title}>
                <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {feedback.map((item) => (
            <blockquote
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              key={item.author}
            >
              <p className="text-base leading-relaxed text-slate-700">
                “{item.quote}”
              </p>
              <footer className="mt-4 text-sm font-medium text-slate-900">
                {item.author}
              </footer>
            </blockquote>
          ))}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Results after rollout
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-900">
              Up to 30% savings on SaaS
            </p>
            <p className="mt-2 text-sm text-emerald-800/90">
              On average, teams find 3 to 10 unused subscriptions in the first
              two weeks.
            </p>
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:pb-16"
        id="pricing"
      >
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Transparent pricing with no hidden terms
          </h2>
          <p className="mt-3 text-slate-600">
            Start with a free plan and scale as your team grows.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                plan.highlighted
                  ? "border-emerald-300 ring-1 ring-emerald-200"
                  : "border-slate-200"
              }`}
              key={plan.name}
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-semibold tracking-tight text-slate-900">
                  {plan.price}
                </span>
                <span className="pb-1 text-sm text-slate-600">
                  {plan.period}
                </span>
              </div>
              <ul className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <li className="text-sm text-slate-700" key={feature}>
                    • {feature}
                  </li>
                ))}
              </ul>
              <Link
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "border border-slate-300 text-slate-800 hover:bg-slate-100"
                }`}
                href={plan.href}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Start controlling subscriptions today
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              No card required, no commitment. Initial setup takes about 10
              minutes.
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            href="/sign-up"
          >
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}
