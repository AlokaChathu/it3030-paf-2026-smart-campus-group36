import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CalendarCheck, ShieldCheck, ArrowRight, BarChart3, Users, Clock } from 'lucide-react';
import BgImg1 from '../assets/Background1.jpg'; 

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8090/oauth2/authorization/google';
    };

    return (
        /* FIXED: Moved background to the main container and used bg-fixed */
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed text-slate-100 selection:bg-blue-300 relative flex flex-col"
            style={{ backgroundImage: `url(${BgImg1})` }}
        >
            {/* GLOBAL OVERLAY: Ensures text is readable across the whole long page */}
            <div className="fixed inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/30 to-slate-950/30 z-0" aria-hidden="true" />

            {/* --- TOP BAR (NAV) --- */}
            <header className="fixed w-full z-50   backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-600/20">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div className="leading-tight">
                            <div className="text-xl font-semibold tracking-tight text-white">SmartCampus</div>
                            <div className="hidden sm:block text-xs font-medium tracking-wide text-slate-400 mt-0.5">Facilities & access management</div>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="inline-flex items-center gap-3 rounded-full bg-black/40 cursor-pointer px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt=""
                            className="w-5 h-5"
                        />
                        Sign in to Portal
                    </button>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20 lg:pt-56 lg:pb-32 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <section className="lg:col-span-8 max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.15] text-white">
                            Manage university facilities with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 font-bold">
                                intelligent precision.
                            </span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl">
                            The comprehensive platform for resource allocation, dynamic scheduling, and role-based access control. Streamline campus operations with real-time, data-driven decisions.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGoogleLogin}
                                className="inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-slate-900 px-9 py-3.5 rounded-xl text-base font-semibold transition-all shadow-xl shadow-black/20 hover:-translate-y-0.5"
                            >
                                Access the Portal <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 bg-slate-900/40 backdrop-blur hover:bg-slate-800/70 border border-white/15 text-white px-9 py-3.5 rounded-xl text-base font-semibold transition-all">
                                View Documentation
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* --- FEATURES GRID (Transparent background to show the image through) --- */}
            <section className="relative z-10 bg-slate-950/45 backdrop-blur-sm border-y border-white/10 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">Built for Modern Institutions</h2>
                        <p className="text-slate-300 text-lg">One unified platform to replace legacy systems and manual spreadsheets.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <FeatureCard 
                            icon={<Building2 />} 
                            title="Resource Catalogue" 
                            desc="Organize lecture halls, laboratories, and specialized equipment with real-time inventory." 
                            color="blue"
                        />
                        <FeatureCard 
                            icon={<CalendarCheck />} 
                            title="Smart Scheduling" 
                            desc="Prevent double-bookings and conflicts with automated availability tracking." 
                            color="indigo"
                        />
                        <FeatureCard 
                            icon={<ShieldCheck />} 
                            title="Role-Based Access" 
                            desc="Secure access control that aligns with student, lecturer, and admin permissions." 
                            color="purple"
                        />
                        <FeatureCard 
                            icon={<Clock />} 
                            title="Maintenance Status" 
                            desc="Instantly mark facilities as 'Under Maintenance' to halt bookings and alert teams." 
                            color="emerald"
                        />
                        <FeatureCard 
                            icon={<Users />} 
                            title="User Management" 
                            desc="Seamlessly manage student and staff roles, permissions, and records from one panel." 
                            color="amber"
                        />
                        <FeatureCard 
                            icon={<BarChart3 />} 
                            title="Usage Analytics" 
                            desc="Track facility utilization rates to make data-driven decisions on expansion." 
                            color="rose"
                        />
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="relative z-10 bg-slate-950/90 text-slate-400 py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-blue-600 p-2 rounded text-white shadow-lg">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-semibold tracking-tight text-white">SmartCampus</span>
                        </div>
                        <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-sm">
                            Empowering modern universities with intelligent, real-time facility and resource management solutions.
                        </p>
                        <div className="text-xs text-slate-500 uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} SmartCampus Hub Inc.
                        </div>
                    </div>
                    <FooterColumn title="Product" links={["Resource Catalogue", "Scheduling", "API & Integrations", "User Roles"]} />
                    <FooterColumn title="Resources" links={["Documentation", "API Reference", "Help Center", "System Status"]} />
                    <FooterColumn title="Company" links={["About Us", "Careers", "Privacy Policy", "Terms of Service"]} />
                </div>
            </footer>
        </div>
    );
};

// Helper Components for cleaner code
const FeatureCard = ({ icon, title, desc, color }) => {
    const toneStyles = {
        blue: 'bg-blue-500/10 text-blue-300 ring-blue-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/20',
        purple: 'bg-purple-500/10 text-purple-300 ring-purple-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
        rose: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',
    };
    const tone = toneStyles[color] || toneStyles.blue;

    return (
        <div className="bg-slate-900/45 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
            <div className={`w-12 h-12 ${tone} rounded-xl flex items-center justify-center mb-6 ring-1 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
        </div>
    );
};

const FooterColumn = ({ title, links }) => (
    <div>
        <h4 className="text-white font-semibold mb-6 text-xs tracking-[0.25em] uppercase">{title}</h4>
        <ul className="space-y-3 text-sm">
            {links.map(link => (
                <li key={link}><a href="#" className="hover:text-blue-400 transition-colors">{link}</a></li>
            ))}
        </ul>
    </div>
);

export default Login;