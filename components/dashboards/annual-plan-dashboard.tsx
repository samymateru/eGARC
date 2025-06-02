export const AnnuaPlanDashboard = () => {
  return <DetailCard title="Total" value="120" />;
};

interface DetailCardProp {
  title: string;
  value: string;
}

const DetailCard = ({ title, value }: DetailCardProp) => {
  return (
    <section className="flex flex-col">
      <header>{title}</header>
      <main>{value}</main>
    </section>
  );
};
