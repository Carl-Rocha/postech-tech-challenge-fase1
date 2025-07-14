import CardSaldo from "@/components/CardSaldo";

export default function Transacao() {
  return (
    <div className="row justify-content-md-center">
        <div className="col-md-6">
            <CardSaldo></CardSaldo>
        </div>
        <div className="col-md-3">
            <p>extrato</p>
        </div>
    </div>
  );
}