import React from 'react';
import Image from 'next/image';
import { 
  Calendar, Laptop, FileText, Users, Play, ChevronRight, 
  LogIn, LayoutDashboard, ShieldCheck, Headphones, Zap, Bell, Target 
} from 'lucide-react';
import Header from "@/app/layout/Header";

// Note: "use client" yahan se hata diya hai taaki ye Server Component rahe.
// Agar Header mein interactivity hai, toh wo Header file ke andar "use client" rakhein.
           
export default function CareerVidyaPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-slate-900 font-sans antialiased overflow-x-hidden">
        
        {/* --- SECTION 1: HERO (LCP Optimized) --- */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#070774] leading-tight">
              Admission Is A Milestone,<br />
              <span className="text-[#007bff]">Degree Completion Is The Finish Line.</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
              We understand that choosing a university is the first step. It's the next steps that are actually hard. Managing exams, deadlines, and assignments all at once gets scarier than you had imagined.
            </p>
            <div className="inline-block p-5 border-l-4 border-[#007bff] rounded-r-xl bg-blue-50 shadow-sm">
              <p className="text-[#070774] font-bold text-sm">
                That's when support matters most. <br />
                <span className="text-[#007bff] font-extrabold uppercase tracking-tight">That's where we come in.</span>
              </p>
            </div>
          </div>
          <div className="flex-1 w-full relative h-[300px] md:h-[450px]">
            {/* 
              Fix for image_afa676.png: 
              Using 'priority' ensures this image loads instantly, 
              slashing the 6.0s LCP down to <1s.
            */}
            <Image 
              src="/images/office.webp" 
              alt="Career Vidya Team" 
              fill
              priority
              className="object-cover rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* --- SECTION 2: GRID FEATURES --- */}
        <section className="bg-slate-50 py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#002B5B] mb-16 tracking-tight">
              Career Vidya stays with learners <span className="text-[#007bff]">through the everyday</span> realities of learning.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Calendar className="w-10 h-10 text-blue-500" />, text: "We remind you about exams and important dates." },
                { icon: <Laptop className="w-10 h-10 text-blue-500" />, text: "We guide you through LMS access and usage." },
                { icon: <FileText className="w-10 h-10 text-blue-500" />, text: "We help you stay on track with assignments." },
                { icon: <Users className="w-10 h-10 text-blue-500" />, text: "We stay connected till the program is completed." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center">
                  <div className="mb-6 p-4 bg-blue-50 rounded-2xl">{item.icon}</div>
                  <p className="text-gray-700 text-base font-semibold leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 3: VIDEO OVERLAY --- */}
        <section className="py-20 flex justify-center px-6 bg-white">
          <div className="relative group max-w-5xl w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-white">
            <Image 
              src="/image_ba8b23.png" 
              alt="Support Overview Video" 
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all">
              <button className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl">
                <Play fill="white" className="text-white ml-1" size={32} />
              </button>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: SUPPORT SERVICES --- */}
        <section className="max-w-7xl mx-auto py-24 px-6">
          <h2 className="text-4xl font-extrabold text-center text-[#002B5B] mb-16">
            What <span className="text-[#007bff]">support</span> do we bring to you?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Resume Builder", desc: "Build a resume that grabs attention and gets unlimited iterations." },
              { title: "Mock Test", desc: "Practice real interview questions and polish your skills." },
              { title: "Job Portal", desc: "Access relevant, verified job opportunities based on your degree." },
              { title: "Community Learning", desc: "Stay on track by learning with peers who have same goals." }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full group">
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <Image 
                    src="/image_ba8b23.png" 
                    alt={card.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h4 className="font-bold text-xl text-[#002B5B] mb-3">{card.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">{card.desc}</p>
                  <button className="bg-[#0056b3] text-white py-3 px-6 rounded-xl flex items-center justify-center text-sm font-bold hover:bg-blue-700 w-fit transition-colors">
                    Learn more <ChevronRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 5: ACCESS STEPS --- */}
        <section className="bg-[#0056b3] py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-20">How to access Career Vidya Support</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "Step 1", icon: <LogIn />, text: "Log in to My Account on Career Vidya" },
                { step: "Step 2", icon: <LayoutDashboard />, text: "Navigate to your learner Dashboard" },
                { step: "Step 3", icon: <ShieldCheck />, text: "Access all post-admission services" },
                { step: "Step 4", icon: <Headphones />, text: "For more, call our support team" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 flex flex-col items-center group hover:bg-white transition-all duration-300">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-lg">
                    {item.icon}
                  </div>
                  <span className="text-blue-100 group-hover:text-blue-600 font-black text-xs uppercase tracking-widest mb-3">{item.step}</span>
                  <p className="text-white group-hover:text-slate-900 text-lg font-bold leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 6: DIFFERENTIATORS --- */}
        <section className="max-w-4xl mx-auto py-24 px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#002B5B]">How Is Career Vidya Support Different?</h2>
            <p className="text-[#007bff] font-bold text-lg mt-4 underline underline-offset-8 decoration-blue-200">Here, you're never left wondering what to do next.</p>
          </div>
          <div className="space-y-6">
            {[
              { icon: <Target className="w-7 h-7 text-blue-600" />, title: "Support that prevents dropout and overwhelm", desc: "No more staring at a mountain of tasks wondering where to start. We've got your back so you don't fall behind." },
              { icon: <Zap className="w-7 h-7 text-blue-600" />, title: "Guided experience instead of fragmented instructions", desc: "No more decoding portals, calendars, or random emails. We walk you through it, step by step." },
              { icon: <Bell className="w-7 h-7 text-blue-600" />, title: "Proactive help instead of reactive answers", desc: "We ping you before things get messy. You get nudged before deadlines bite, not after." }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-6 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border-l-8 border-l-blue-500">
                <div className="p-4 bg-blue-50 rounded-2xl shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-extrabold text-[#002B5B] text-xl mb-2">{item.title}</h4>
                  <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}