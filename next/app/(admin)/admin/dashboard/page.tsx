export default function DashboardPage() {
  const cards = [
    { title: 'Véhicules en ligne', value: '128', delta: '+12 cette semaine' },
    { title: 'Leads à traiter', value: '36', delta: '8 nouveaux aujourd’hui' },
    { title: 'Revenu estimé', value: '€842K', delta: 'prévision 30 jours' },
  ];

  return (
    <section>
      <div className="card-grid">
        {cards.map((card) => (
          <article className="card glass" key={card.title}>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>{card.title}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{card.value}</div>
            <div style={{ marginTop: 6, color: '#7dd3fc', fontSize: 13 }}>{card.delta}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
