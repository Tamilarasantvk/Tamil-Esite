import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { sanitizeUrl } from '../utils/security';
import { Mail, Linkedin, Github, Send, CheckCircle2, MapPin, Phone, Edit3 } from 'lucide-react';

interface ContactSectionProps {
  onOpenCMS: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenCMS }) => {
  const { profile, showToast, isAdminLoggedIn, isEditModeActive } = usePortfolio();
  const { contact } = profile;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Cybersecurity / SOC Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Message delivery failed.');
      setLoading(false);
      setSubmitted(true);
      showToast('Message transmitted successfully! Tamilarasan will reply soon.', 'success');
      setFormData({ name: '', email: '', subject: 'Cybersecurity / SOC Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setLoading(false);
      showToast(error instanceof Error ? error.message : 'Message delivery failed.', 'error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#050B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
            08 — CONTACT
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-3">
            {profile.siteSettings?.contactTitle || "Let's Connect"}
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            {profile.siteSettings?.contactSubtitle || "I'm actively seeking cybersecurity internships, SOC Analyst entry roles, technical collaborations and blue team learning opportunities."}
          </p>

          {isAdminLoggedIn && isEditModeActive && (
            <button
              onClick={onOpenCMS}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-[#0B1628]/50 border border-[#1E3A5F]/40 rounded-lg hover:bg-[#00A8FF]/50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Contact Info</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-5">
              <h3 className="font-heading text-lg font-bold text-[#F8FAFC] border-b border-[#1E3A5F] pb-3">
                Direct Channels
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F] text-slate-300 hover:text-[#F8FAFC] hover:border-[#00A8FF] transition-all group"
                >
                  <div className="p-2 rounded-md bg-[#00A8FF]/10 text-[#F8FAFC] group-hover:bg-[#00A8FF] group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider block">Email</span>
                    <span className="text-xs font-mono text-slate-200 truncate block">{contact.email}</span>
                  </div>
                </a>

                <a
                  href={sanitizeUrl(contact.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F] text-slate-300 hover:text-[#F8FAFC] hover:border-[#00A8FF] transition-all group"
                >
                  <div className="p-2 rounded-md bg-[#00A8FF]/10 text-[#F8FAFC] group-hover:bg-[#00A8FF] group-hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider block">LinkedIn</span>
                    <span className="text-xs font-mono text-slate-200">tamilarasan-purushothaman</span>
                  </div>
                </a>

                <a
                  href={sanitizeUrl(contact.github)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F] text-slate-300 hover:text-[#F8FAFC] hover:border-[#00A8FF] transition-all group"
                >
                  <div className="p-2 rounded-md bg-[#00A8FF]/10 text-[#F8FAFC] group-hover:bg-[#00A8FF] group-hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider block">GitHub</span>
                    <span className="text-xs font-mono text-slate-200">tamilarasanpt31</span>
                  </div>
                </a>

                {contact.location && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F] text-slate-300">
                    <div className="p-2 rounded-md bg-[#00A8FF]/10 text-[#F8FAFC]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider block">Location</span>
                      <span className="text-xs font-mono text-slate-200">{contact.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Message Box */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] shadow-xl">
              <h3 className="font-heading text-lg font-bold text-[#F8FAFC] mb-2">
                Send Direct Message
              </h3>
              <p className="text-xs text-[#94A3B8] mb-6 font-mono">
                Encrypted dispatch payload to Tamilarasan's inbox
              </p>

              {submitted ? (
                <div className="p-6 rounded-lg bg-[#00A8FF]/10 border border-[#00A8FF]/40 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#F8FAFC] mx-auto animate-bounce" />
                  <h4 className="font-heading font-bold text-[#F8FAFC] text-base">Message Sent!</h4>
                  <p className="text-xs text-slate-300">
                    Thank you for reaching out. Your inquiry has been queued for review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#94A3B8] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#00A8FF]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#94A3B8] mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#00A8FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#94A3B8] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#00A8FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#94A3B8] mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Tamilarasan, I would like to discuss an opportunity or project..."
                      className="w-full px-3.5 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-[#00A8FF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-[#00A8FF] hover:bg-[#38BDF8] disabled:opacity-50 text-[#F8FAFC] font-semibold text-xs font-mono tracking-wider uppercase rounded-lg transition-all shadow-lg shadow-[#00A8FF]/25 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-pulse">Transmitting Packet...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
