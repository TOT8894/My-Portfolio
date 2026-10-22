import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { portfolioService } from '../../services/api';
import ScrollReveal from '../common/ScrollReveal';

export default function Contact() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};
  const announcement = portfolioData?.announcement || {
    badge: "Transmission Delivered",
    title: "Thank You! Your Message is Received",
    message: "Your inquiry has been successfully delivered to Shanbel's direct dashboard and notification stream. An automated confirmation receipt has also been dispatched to your email address.",
    followUpNote: "Shanbel personally reviews every project proposal, microservices inquiry, and network architecture request. Expect a tailored response within 24 hours.",
    urgencyText: "Need urgent consultation? Feel free to reach out directly via Phone Call or Telegram."
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName || 'Visitor';
    const payload = {
      name: fullName,
      email: formData.email,
      phone: formData.phone || '',
      subject: `Inquiry from ${fullName}`,
      message: formData.message,
    };

    try {
      const res = await portfolioService.sendMessage(payload);
      if (res.data?.success) {
        setSubmitSuccess(true);
        setSubmitError(null);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        setSubmitSuccess(false);
        setSubmitError(
          res.data?.message || 'Message could not be delivered to Shanbel Dires email at this moment. Please click Send Again.'
        );
      }
    } catch (err) {
      console.error("Backend contact error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Message could not be delivered to Shanbel Dires email at this moment. Please click Send Again.';
      // NEVER show success text if email was not delivered
      setSubmitSuccess(false);
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneValue = profile.phone || '+251 98 894 6528';
  const emailValue = profile.email || 'shanbeldires8@gmail.com';
  const addressValue = profile.location || 'Addis Ababa, Ethiopia';

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#EBF1F6] dark:bg-black transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Side-by-Side 2-Card Layout Matching Screenshot with Green Brand Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ==========================================================
             LEFT CARD: "Let's Work Together"
             ========================================================== */}
          <ScrollReveal animation="fade-right">
            <div className="bg-[#E2EAF1]/70 dark:bg-neutral-950 p-7 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-neutral-900 shadow-sm flex flex-col justify-between h-full">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Let's Work Together
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-2 mb-8 leading-relaxed">
                  Have a project in mind or want to discuss potential opportunities? Feel free to reach out.
                </p>

                {/* 3 Elevated Info Cards */}
                <div className="space-y-4">
                  
                  {/* 1. Phone Card */}
                  <a
                    href={`tel:${phoneValue.replace(/\s+/g, '')}`}
                    className="p-4 sm:p-5 bg-white dark:bg-black rounded-2xl shadow-sm border border-slate-200/60 dark:border-neutral-800 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-neutral-400 font-medium">Phone</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">{phoneValue}</p>
                    </div>
                  </a>

                  {/* 2. Email Card */}
                  <a
                    href={`mailto:${emailValue}`}
                    className="p-4 sm:p-5 bg-white dark:bg-black rounded-2xl shadow-sm border border-slate-200/60 dark:border-neutral-800 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 dark:text-neutral-400 font-medium">Email</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{emailValue}</p>
                    </div>
                  </a>

                  {/* 3. Address Card */}
                  <div className="p-4 sm:p-5 bg-white dark:bg-black rounded-2xl shadow-sm border border-slate-200/60 dark:border-neutral-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-neutral-400 font-medium">Address</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{addressValue}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ==========================================================
             RIGHT CARD: "Contact Me!" Form OR Announcement Card
             ========================================================== */}
          <ScrollReveal animation="fade-left">
            {submitSuccess ? (
              
              /* Announcement Card Replacement after Submission */
              <div className="bg-[#E2EAF1]/70 dark:bg-neutral-950 p-7 sm:p-10 rounded-3xl border-2 border-emerald-500/40 shadow-xl space-y-6 animate-slideUp h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        {announcement.badge || "Transmission Delivered"}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {announcement.title || "Thank You! Your Message is Received"}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 text-slate-700 dark:text-neutral-300 text-sm leading-relaxed bg-white dark:bg-black p-5 rounded-2xl border border-slate-200/80 dark:border-neutral-900 mt-6 shadow-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {announcement.message}
                    </p>
                    {announcement.followUpNote && (
                      <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                        {announcement.followUpNote}
                      </p>
                    )}
                  </div>

                  {announcement.urgencyText && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mt-4">
                      <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{announcement.urgencyText}</span>
                    </div>
                  )}
                </div>

                {/* GREEN BUTTON WITH WHITE HOVER */}
                <div className="pt-6">
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setSubmitError(null);
                    }}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-white hover:text-black text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-transparent hover:border-black dark:hover:border-white active:scale-98"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Back to Contact Form (Send Another Message)</span>
                  </button>
                </div>
              </div>

            ) : (

              /* Exact Form Card Layout from Screenshot with Green Accent */
              <div className="bg-[#E2EAF1]/70 dark:bg-neutral-950 p-7 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-neutral-900 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Contact <span className="text-emerald-600 dark:text-emerald-500">Me!</span>
                  </h3>
                  {/* Green Accent Underline */}
                  <div className="w-12 h-1 bg-emerald-600 rounded-full mb-6 mt-1.5"></div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="First Name"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black text-slate-900 dark:text-white text-sm border border-slate-200/80 dark:border-neutral-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition"
                      />
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Last Name"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black text-slate-900 dark:text-white text-sm border border-slate-200/80 dark:border-neutral-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition"
                      />
                    </div>

                    {/* Row 2: Email & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black text-slate-900 dark:text-white text-sm border border-slate-200/80 dark:border-neutral-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition"
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black text-slate-900 dark:text-white text-sm border border-slate-200/80 dark:border-neutral-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition"
                      />
                    </div>

                    {/* Row 3: Your Message Textarea */}
                    <div>
                      <textarea
                        rows="4"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Your Message"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black text-slate-900 dark:text-white text-sm border border-slate-200/80 dark:border-neutral-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition resize-none"
                      ></textarea>
                    </div>

                    {/* GREEN BUTTON WITH WHITE HOVER */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-white hover:text-black text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm border border-transparent hover:border-black dark:hover:border-white active:scale-98"
                    >
                      {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    </button>

                    {submitError && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/50 border-2 border-red-500/40 rounded-2xl text-xs space-y-3 animate-shake">
                        <div className="flex items-start gap-2.5 text-red-800 dark:text-red-300">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-sm text-red-900 dark:text-red-200">Email Delivery Failed</p>
                            <p className="text-slate-700 dark:text-neutral-300 leading-relaxed">
                              {submitError}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-red-200 dark:border-red-900/60">
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold border border-transparent hover:border-black transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Sending Again...' : 'Click Here to Send Again'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

            )}
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}
