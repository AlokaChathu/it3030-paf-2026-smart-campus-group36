import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, CalendarClock, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { cancelBooking, getMyBookings, getPeakHoursAnalytics } from "../../api/bookingApi";

const badgeClasses = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-200 text-slate-700",
};

const windowOptions = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
  { label: "Last 365 days", value: 365 },
  { label: "All time", value: "" },
];

/** Client-side series from the user's own approved bookings (hour of start). */
const hourlyFromMyApproved = (bookings) =>
  Array.from({ length: 24 }, (_, hour) => {
    let count = 0;
    (bookings || []).forEach((b) => {
      if (b?.status !== "APPROVED" || !b.startTime) return;
      const h = new Date(b.startTime).getHours();
      if (h === hour) count += 1;
    });
    return { hour, count };
  });

const X_AXIS_HOUR_TICKS = [0, 3, 6, 9, 12, 15, 18, 21];

const MyBookingsPage = () => {
  const hasFetched = useRef(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [insightWindow, setInsightWindow] = useState(90);
  const [analytics, setAnalytics] = useState(null);
  const [insightLoading, setInsightLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load your bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = useCallback(async () => {
    try {
      setInsightLoading(true);
      const params = {};
      if (insightWindow !== "" && Number.isFinite(insightWindow)) {
        params.days = insightWindow;
      }
      const { data } = await getPeakHoursAnalytics(params);
      setAnalytics(data);
    } catch (error) {
      setAnalytics(null);
      const msg = error?.response?.data?.message || error?.message || "";
      if (msg) {
        toast.error(msg, { id: "insights-api" });
      } else {
        toast.error("Could not load campus insights; showing your bookings only.", { id: "insights-api" });
      }
    } finally {
      setInsightLoading(false);
    }
  }, [insightWindow]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchBookings();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setActionId(bookingId);
      await cancelBooking(bookingId);
      toast.success("Booking cancelled.");
      await fetchBookings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setActionId(null);
    }
  };

  const chartDataCampus =
    analytics?.hourOfDaySeries?.map((b) => ({
      hour: b.hour,
      count: b.count,
    })) ?? [];

  const chartDataLocal = hourlyFromMyApproved(bookings);
  const chartData = analytics ? chartDataCampus : chartDataLocal;
  const chartIsLocal = !analytics;
  const hasAnyBar = chartData.some((d) => d.count > 0);

  const dayHeat =
    analytics?.dayOfWeekSeries?.map((d) => ({
      label: d.dayLabel?.slice(0, 3) ?? "—",
      count: d.count,
    })) ?? [];
  const dayMax = Math.max(1, ...dayHeat.map((d) => d.count));

  return (
    <DashboardLayout title="My Bookings">
      <div className="mb-8 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 shadow-sm">
        <div className="border-b border-indigo-100/80 bg-white/60 px-5 py-4 backdrop-blur-sm sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                <BarChart3 className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-900">Booking insights</h2>
                <p className="text-sm text-slate-600">
                  Campus-wide trends from <strong>approved</strong> bookings — pick quieter slots and reduce
                  conflicts.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="insight-range" className="text-xs font-medium text-slate-500">
                Range
              </label>
              <select
                id="insight-range"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm outline-none ring-indigo-500/30 focus:ring-2"
                value={insightWindow}
                onChange={(e) => {
                  const v = e.target.value;
                  setInsightWindow(v === "" ? "" : Number(v));
                }}
              >
                {windowOptions.map((o) => (
                  <option key={o.label} value={o.value === "" ? "" : o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {insightLoading ? (
            <p className="text-sm text-slate-500">Loading insights…</p>
          ) : (
            <>
              {/* Small bar chart — always show when we have data or a zeros baseline */}
              <div className="mb-5 rounded-xl border border-indigo-200/50 bg-white/90 p-3 shadow-sm sm:p-4">
                <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Bookings by hour</h3>
                    <p className="text-xs text-slate-500">
                      {chartIsLocal
                        ? "Your approved bookings (start time) — campus-wide stats unavailable."
                        : "Campus-wide approved bookings (start time)."}
                    </p>
                  </div>
                </div>
                <div className="h-40 w-full min-w-0 sm:h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 4, right: 8, left: 4, bottom: 32 }}
                      barSize={10}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="hour"
                        type="category"
                        ticks={X_AXIS_HOUR_TICKS}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickFormatter={(h) => String(h)}
                        tickLine={false}
                        axisLine={{ stroke: "#e2e8f0" }}
                        label={{
                          value: "Hour of day (0–23)",
                          position: "insideBottom",
                          offset: -2,
                          style: { fontSize: 11, fill: "#64748b" },
                        }}
                      />
                      <YAxis
                        allowDecimals={false}
                        width={40}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Count",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: 11, fill: "#64748b" },
                        }}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        formatter={(value) => [value, "Count"]}
                        labelFormatter={(_, p) =>
                          p?.payload != null ? `Hour ${p.payload.hour} (0–23)` : ""
                        }
                      />
                      <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={12}>
                        {chartData.map((entry) => (
                          <Cell
                            key={`mini-${entry.hour}`}
                            fill={
                              !hasAnyBar
                                ? "rgb(226 232 240)"
                                : entry.count > 0
                                  ? "rgb(99 102 241)"
                                  : "rgb(241 245 249)"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {!hasAnyBar && !insightLoading && (
                  <p className="mt-1 text-center text-xs text-slate-400">No data in this range yet</p>
                )}
              </div>

              {analytics ? (
            <>
              {analytics.analysisNote && (
                <p className="mb-4 flex items-start gap-2 text-sm text-slate-600">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {analytics.analysisNote}
                </p>
              )}

              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Peak hours
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {analytics.peakHours?.length ? analytics.peakHours.join(" · ") : "—"}
                  </p>
                  {analytics.peakHour && (
                    <p className="mt-1 text-xs text-slate-500" title="Busiest single hour (24h)">
                      Top slot: {analytics.peakHour}
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Low traffic
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {analytics.lowTrafficHours?.length ? analytics.lowTrafficHours.join(" · ") : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Best time (2h)
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-800">{analytics.bestRecommendedTime || "—"}</p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Most busy day</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{analytics.mostBusyDay || "—"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Day-of-week load</h3>
                <p className="mb-3 text-xs text-slate-500">Darker = more approved bookings (same period).</p>
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {dayHeat.map((d) => {
                    const t = d.count / dayMax;
                    return (
                      <div key={d.label} className="flex flex-col items-center text-center">
                        <div
                          className="mb-1 flex w-full min-h-16 items-end justify-center rounded-lg border border-slate-200/60 bg-slate-50 p-1"
                          title={`${d.label}: ${d.count}`}
                        >
                          <div
                            className="w-full min-h-2 rounded transition-all"
                            style={{
                              height: `${8 + t * 88}%`,
                              background: `linear-gradient(to top, rgb(30 64 175 / ${0.3 + t * 0.7}), rgb(129 140 248 / 0.25))`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 sm:text-xs">{d.label}</span>
                        <span className="text-xs font-semibold text-slate-800">{d.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Campus stats unavailable — the chart above uses your approved bookings when possible.
            </p>
          )}
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-gray-200 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">Resource #{booking.resourceId}</p>
                    <p className="mt-1 text-sm text-gray-600">{booking.purpose}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">Attendees: {booking.attendees}</p>
                    {booking.rejectionReason && (
                      <p className="mt-2 text-sm text-red-700">Rejection reason: {booking.rejectionReason}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        badgeClasses[booking.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {booking.status}
                    </span>

                    {booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionId === booking.id}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                      >
                        {actionId === booking.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyBookingsPage;
