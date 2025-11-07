export const RequestCard = () => {
  const requests = [
    {
      name: "NickWilde",
      event: "Stagger Cafe Trip",
    },
    {
      name: "Bellwether",
      event: "Community Goods Visit",
    },
  ];

  if (requests.length === 0) {
    return <p>No active requests</p>;
  }

  return (
    <div>
      <div>
        {requests.map((req) => (
          <div key={req.name} className="request-card">
            <h4>{req.name}</h4>
            <p>{req.event}</p>
            <div className="btn">
              <button>Accept</button>
              <button>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
