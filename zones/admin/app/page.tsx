import Link from "next/link";

const quickLinks = [
  {
    title: "Gestão de Usuários",
    description:
      "Controle perfis, permissões e status de clientes e operadores da plataforma.",
    href: "/usuarios",
  },
  {
    title: "Análises de Risco",
    description:
      "Monitore alertas em tempo real e acompanhe indicadores críticos do negócio.",
    href: "/riscos",
  },
  {
    title: "Parametrizações",
    description:
      "Configure limites operacionais, produtos habilitados e integrações externas.",
    href: "/parametros",
  },
];

export default function AdminHome() {
  return (
    <div>
      <section>
        <h1>Bem-vinda à central administrativa</h1>
        <p>
          Esta aplicação roda em uma <strong>zona independente</strong> e é
          exposta pelo app principal via reescritas. Isso permite evoluir cada
          domínio do produto de forma autônoma sem abrir mão de uma experiência
          integrada para quem utiliza a plataforma.
        </p>
      </section>

      <section className="admin-grid">
        {quickLinks.map((link) => (
          <article key={link.title} className="admin-card">
            <span className="admin-card__title">{link.title}</span>
            <p className="admin-card__description">{link.description}</p>
            <Link className="admin-card__link" href={link.href} prefetch={false}>
              Acessar módulo
            </Link>
          </article>
        ))}
      </section>

      <footer className="admin-footer">
        <p>
          Você pode retornar à experiência tradicional acessando a área
          financeira em <strong>/</strong> no aplicativo principal.
        </p>
      </footer>
    </div>
  );
}
