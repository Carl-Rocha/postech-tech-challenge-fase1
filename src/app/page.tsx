import CardExtrato from "../components/cardExtrato";
import CardSaldo from "../components/cardSaldo";

export default function Home() {
  return (
    <div className="d-flex flex-column flex-md-row gap-3 mt-3">
      <div className="col-md-8">
        <CardSaldo></CardSaldo>
      </div>
      <div className="col-md-4">
        <CardExtrato></CardExtrato>
      </div>
    </div>
  );
}
