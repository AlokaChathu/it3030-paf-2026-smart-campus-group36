import { Link } from "react-router-dom";
import Img1 from "../../assets/Img1.avif";
import {
  Building2,
  CalendarCheck2,
  Wrench,
  BellRing,
  ShieldCheck,
  Search,
  ClipboardCheck,
  Ticket,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    title: "Facilities & Assets Catalogue",
    description:
      "Browse lecture halls, labs, meeting rooms, and equipment with capacity, location, availability, and status details.",
    icon: Building2,
  },
  {
    title: "Booking Management",
    description:
      "Submit and manage bookings with approval workflows, conflict prevention, and booking visibility.",
    icon: CalendarCheck2,
  },
  {
    title: "Maintenance & Incident Ticketing",
    description:
      "Report incidents, attach evidence, assign technicians, and monitor issue resolution professionally.",
    icon: Wrench,
  },
  {
    title: "Smart Notifications",
    description:
      "Receive timely alerts for booking decisions, ticket changes, comments, and operational updates.",
    icon: BellRing,
  },
];

const workflows = [
  {
    title: "Find Resources",
    description:
      "Search lecture halls, labs, meeting rooms, and equipment using smart filters and availability details.",
    icon: Search,
  },
  {
    title: "Request Bookings",
    description:
      "Submit booking requests with purpose, date, time range, and expected attendees through a clear workflow.",
    icon: ClipboardCheck,
  },
  {
    title: "Track Incidents",
    description:
      "Create tickets for campus issues, monitor statuses, and follow technician updates until resolution.",
    icon: Ticket,
  },
  {
    title: "Stay Notified",
    description:
      "Get instant notifications for approvals, rejections, ticket changes, and new ticket comments.",
    icon: BellRing,
  },
  {
    title: "Role-Based Access",
    description:
      "Secure access ensures different user roles see and manage only the relevant system features.",
    icon: ShieldCheck,
  },
  {
    title: "Manage Operations",
    description:
      "Support admins, staff, and technicians with a centralized, organized, and auditable operational platform.",
    icon: Users,
  },
];

const stats = [
  { value: "120+", label: "Campus Resources" },
  { value: "24/7", label: "Platform Access" },
  { value: "Real-Time", label: "Notifications" },
  { value: "Secure", label: "Role-Based Access" },
];

const roleCards = [
  {
    title: "Students & Staff",
    description:
      "Request bookings, report incidents, receive notifications, and track operational updates easily.",
  },
  {
    title: "Administrators",
    description:
      "Manage users, review requests, monitor workflows, and control campus operations centrally.",
  },
  {
    title: "Technicians",
    description:
      "Handle assigned tickets, update maintenance progress, and provide resolution notes effectively.",
  },
];

const highlights = [
  "Smart booking workflow",
  "Incident reporting support",
  "Operational visibility",
  "Secure role-based access",
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Subtle background pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-cyan-400 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:py-12 lg:px-8">
          {/* Top Bar */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-300">
                Smart Campus Hub
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Smart Campus Operations Hub
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                University Operations Platform
              </span>

              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Streamline campus
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  bookings, maintenance, and operations
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                A modern platform for managing campus resources, booking
                workflows, maintenance incidents, technician updates, and
                operational notifications through a secure and professional web
                experience.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Access Portal
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xl font-bold text-white">{item.value}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={Img1}
                    alt="Smart Campus Operations"
                    className="h-[340px] lg:h-[400px] w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <div className="max-w-lg rounded-xl border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-md">
                      <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                        Smart Campus Experience
                      </p>
                      <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold leading-tight text-white">
                        Manage university operations from one connected platform
                      </h3>

                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                        {highlights.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/15 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-slate-100"
                          >
                            <CheckCircle2 size={14} className="scale-90 sm:scale-100" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-white/10 bg-white/10 p-3 text-xs sm:text-sm text-white shadow-xl backdrop-blur-md lg:block">
                Secure access with OAuth and role-based control
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Features */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              About the Platform
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for smarter campus resource and service management
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Smart Campus Operations Hub centralizes day-to-day university
              operations into one modern system. It supports resource discovery,
              booking management, maintenance reporting, technician updates, and
              operational communication with a clean and professional user
              experience.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The platform combines usability, secure access, and workflow
              visibility for both end users and administrators.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Workflows */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Core Workflows
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Professional workflows for modern campus operations
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The platform supports the main processes required for campus
              resource management, booking approvals, maintenance handling, and
              role-based operations in a structured and user-friendly way.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;

              return (
                <div
                  key={workflow.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex rounded-xl bg-blue-600 p-3 text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Workflow
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-slate-900">
                    {workflow.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {workflow.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <span>Operational support</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl bg-slate-900 px-8 py-14 text-white shadow-2xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Secure Access Control
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Role-based experience for every type of user
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Different user roles can access the system according to their
                responsibilities, helping the platform stay secure, organized,
                and easy to manage.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {roleCards.map((role, index) => (
                <div
                  key={role.title}
                  className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm ${
                    index === 2 ? "sm:col-span-2" : ""
                  }`}
                >
                  <h3 className="text-lg font-semibold">{role.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
            Start Your Journey
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Experience a smarter way to manage campus operations
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-blue-100">
            Access bookings, report incidents, follow maintenance progress, and
            manage campus resources through one centralized platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-md transition-all duration-200 hover:bg-slate-100 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Smart Campus Hub
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A professional campus operations platform for resource booking,
                maintenance management, notifications, and secure workflow
                handling.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Quick Links
              </h4>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <Link to="/" className="transition-colors hover:text-blue-600">
                  Home
                </Link>
                <Link to="/login" className="transition-colors hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="transition-colors hover:text-blue-600">
                  Register
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Platform Scope
              </h4>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Resource discovery, booking workflows, maintenance ticketing,
                notifications, and role-based operational management.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            © 2026 Smart Campus Operations Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;