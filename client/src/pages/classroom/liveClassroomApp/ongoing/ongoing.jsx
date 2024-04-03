import CallList from "../../components/CallList";

const Ongoing = () => {
    return (<section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Ongoing Meeting</h1>

      <CallList type="ongoing"/>
    </section>);
};
export default Ongoing;
