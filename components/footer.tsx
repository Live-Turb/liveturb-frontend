"use client"

import { useRouter } from "next/navigation"

export default function Footer() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Sobre */}
          <div className="space-y-4">
            <div className="inline-block cursor-pointer" onClick={() => router.push('/')}>
              <div className="h-12 w-40 bg-contain bg-no-repeat bg-left" style={{ backgroundImage: "url('/images/logo_dark.webp')" }}></div>
            </div>
            <p className="text-slate-400 mt-4 max-w-md">
              A LiveTurb oferece as melhores soluções de marketing para e-commerce,
              ajudando você a escalar suas vendas com inteligência e eficiência.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="md:mx-auto">
            <h3 className="text-white text-lg font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#recursos" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#precos" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-blue-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <span 
                  onClick={() => router.push('/privacy-policy')} 
                  className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Política de Privacidade
                </span>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="text-slate-400">
                <span className="text-blue-400">Email:</span> contato@liveturb.com
              </li>
              <li className="text-slate-400">
                <span className="text-blue-400">Website:</span> www.liveturb.com
              </li>
            </ul>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Linha de Separação */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-slate-500 text-sm">
          <p>© {currentYear} LiveTurb. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
