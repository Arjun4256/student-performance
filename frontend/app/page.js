import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  LineChart, 
  Target, 
  PieChart, 
  BarChart3, 
  CheckCircle2, 
  Filter, 
  Cpu,
  Database,
  Globe,
  TerminalSquare,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Lightbulb,
  ShieldCheck,
  Send,
  ArrowRight
} from "lucide-react";

const features = [
  { title: "Performance Tracking", icon: <LineChart className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />, desc: "Track assignments, test scores, and monitor precise academic progress across multiple subjects in real-time." },
  { title: "Placement Prediction", icon: <Target className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />, desc: "Leverage machine learning algorithms to evaluate academic history and identify potential career matches and readiness." },
  { title: "Academic Dashboard", icon: <PieChart className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />, desc: "Access a central hub with intuitive visual charts, showcasing comprehensive metrics for students, faculty, and administration." },
  { title: "CGPA Analysis", icon: <BarChart3 className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />, desc: "Visualize historical grade trends and individual subject metrics to pinpoint precise areas for scholastic improvement." },
  { title: "Skill Assessment", icon: <CheckCircle2 className="w-8 h-8 text-teal-500 group-hover:scale-110 transition-transform" />, desc: "Evaluate both technical and soft-skill proficiencies through structured testing frameworks for holistic development." },
  { title: "Company Filter", icon: <Filter className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform" />, desc: "Automated pre-screening algorithm matching candidate competencies against specialized corporate requirements." },
];

const benefits = [
  { title: "Data-Driven Decisions", icon: <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />, desc: "Empowers institutions to make choices based on concrete academic data rather than intuition." },
  { title: "Early Intervention", icon: <Lightbulb className="w-6 h-6 text-amber-500 dark:text-amber-400" />, desc: "Identifies struggling students early, allowing for timely academic support and counseling." },
  { title: "Secure & Reliable", icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, desc: "Maintains strict data privacy and security protocols for sensitive student and faculty information." }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans flex flex-col scroll-smooth selection:bg-[#10B981]/30">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative flex flex-col items-center justify-center pt-32 pb-40 px-4 overflow-hidden min-h-[90vh]">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#10B981]/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0D9488]/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        
        <div className="w-full max-w-6xl text-center z-10 relative">
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-[#0F172A]">
            Unlock Potential With <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#0D9488] to-[#34D399] animate-gradient-x p-2">
               Smart Analytics
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#64748B] max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            The intelligent platform bridging the gap between academic progress and successful career placement. Transform raw data into actionable insights.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="#features" className="group px-8 py-4 rounded-2xl bg-[#0F172A] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#0F172A]/20 w-full sm:w-auto flex items-center justify-center gap-2">
              Explore Features
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#contact" className="px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-md border border-[#E2E8F0] hover:border-[#10B981] text-[#0F172A] font-bold transition-all hover:bg-white hover:shadow-lg w-full sm:w-auto">
              Contact 
            </Link>
          </div>

        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[#10B981] font-black tracking-widest uppercase mb-4 text-sm flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-[#10B981]"></span>
               Platform Capabilities
              <span className="w-8 h-[2px] bg-[#10B981]"></span>
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0F172A] leading-tight">
              Powerful Tools Built For <br/> Modern Education
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="absolute -inset-0.5 rounded-[1.6rem] bg-gradient-to-r from-[#10B981] to-[#34D399] opacity-0 blur transition duration-500 group-hover:opacity-20 animate-pulse pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full bg-white rounded-2xl p-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-8 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white">
                    {/* Note: In a real refactor, features array icons would be updated, 
                        but we rely on CSS inheritance via className overrides or generic color logic here. 
                        We simply render the icon. The group-hover classes will affect the stroke depending on how the icons are implemented. */}
                     {feature.icon}
                  </div>
                  
                  <h4 className="text-2xl font-black tracking-tight text-[#0F172A] mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-[#64748B] font-medium leading-relaxed flex-1">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us & Problem Solving */}
      <section id="about" className="py-32 px-4 relative overflow-hidden bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div>
              <h2 className="text-[#10B981] font-black tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#10B981]"></span>
                The CampusTrack Edge
              </h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0F172A] mb-8 leading-tight">
                Transforming Data Into Student Success
              </h3>
              <p className="text-lg text-[#64748B] font-medium mb-6 leading-relaxed">
                Modern educational institutions face a critical challenge: a massive disconnect between academic scoring and actual employability. Students often lack visibility into how their current performance translates to industry readiness.
              </p>
              <p className="text-lg text-[#64748B] font-medium mb-10 leading-relaxed">
                <strong>CampusTrackAnalytics</strong> acts as an intelligent layer over raw institutional data. By tracking continuous performance metrics and aligning them with industry demands, we help institutions mentor students proactively rather than reactively.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-6 p-6 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#10B981] transition-all duration-300">
                  <div className="flex shrink-0 items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-100 placeholder-inherit">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight text-[#0F172A] mb-2">{benefit.title}</h4>
                    <p className="text-[#64748B] font-medium leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-32 px-4 relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
             <h2 className="text-[#10B981] font-black tracking-widest uppercase mb-4 text-sm flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-[#10B981]"></span>
              Connect With Us
              <span className="w-8 h-[2px] bg-[#10B981]"></span>
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0F172A]">
              Ready to Upgrade Your Campus?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden p-4 sm:p-8">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 bg-[#0F172A] text-white p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-inner">
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#10B981]/30 rounded-full blur-[80px]" />
              
              <div className="relative z-10">
                <h4 className="text-3xl font-black tracking-tight mb-4">Get in Touch</h4>
                <p className="text-[#94A3B8] font-medium leading-relaxed mb-12">
                  Interested in deploying CampusTrackAnalytics? Reach out to our team for a personalized demo.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-3 bg-[#1E293B] rounded-xl text-[#10B981] group-hover:scale-110 group-hover:bg-[#10B981] group-hover:text-white transition-all">
                       <Mail className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-[#E2E8F0] group-hover:text-white transition-colors">support@campustrack.edu</p>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-3 bg-[#1E293B] rounded-xl text-[#0D9488] group-hover:scale-110 group-hover:bg-[#0D9488] group-hover:text-white transition-all">
                        <Phone className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-[#E2E8F0] group-hover:text-white transition-colors">+914557568</p>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="p-3 bg-[#1E293B] rounded-xl text-[#34D399] group-hover:scale-110 group-hover:bg-[#34D399] group-hover:text-white transition-all">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-[#E2E8F0] group-hover:text-white transition-colors">Arumbakkam, Chennai</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 p-4 sm:p-10">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#334155]">First Name</label>
                    <input 
                      type="text" 
                      className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all focus:border-[#10B981] focus:bg-white focus:ring-4 focus:ring-[#10B981]/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#334155]">Last Name</label>
                    <input 
                      type="text" 
                      className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all focus:border-[#10B981] focus:bg-white focus:ring-4 focus:ring-[#10B981]/10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#334155]">Email Address</label>
                  <input 
                    type="email" 
                    className="block w-full rounded-xl border border-[#E2E8F0] bg-white/50 px-4 py-3 text-[#0F172A] text-sm font-medium placeholder-[#94A3B8] outline-none transition-all focus:border-[#10B981] focus:bg-white focus:ring-4 focus:ring-[#10B981]/10"
                  />
                </div>
                <button 
                  type="button"
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#0D9488] py-4 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-300/50"
                >
                  Send Message
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-[#E2E8F0] bg-white text-center">
        <div className="text-2xl font-black tracking-tighter flex items-center justify-center gap-2 text-[#0F172A] mb-4">
           CampusTrack<span className="text-[#10B981]">Analytics</span>
        </div>
        <p className="text-[#64748B] text-sm font-bold">
          © {new Date().getFullYear()} Student Performance & Placement Analytics System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
