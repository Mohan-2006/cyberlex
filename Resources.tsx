import React from 'react';

const Resources: React.FC = () => {
  const links = [
    { title: "NIST Cybersecurity Framework", desc: "Standards, guidelines, and best practices to manage cybersecurity risk.", url: "https://www.nist.gov/cyberframework" },
    { title: "GDPR Official Text", desc: "Regulation (EU) 2016/679 on the protection of natural persons regarding personal data.", url: "https://gdpr.eu/" },
    { title: "CCPA (California Consumer Privacy Act)", desc: "State statute intended to enhance privacy rights and consumer protection for residents of California.", url: "https://oag.ca.gov/privacy/ccpa" },
    { title: "CISA Shield's Up", desc: "CISA's guidance for organizations to protect themselves during heightened threat activity.", url: "https://www.cisa.gov/shields-up" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-cyber-darker/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Legal Resources & Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              className="glass-panel p-6 rounded-xl border border-slate-700 hover:border-cyber-accent/50 hover:bg-slate-800/80 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-accent transition-colors">{link.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{link.desc}</p>
              <span className="text-xs font-mono text-cyber-dim group-hover:text-white flex items-center gap-1">
                ACCESS RESOURCE 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;