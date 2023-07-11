import Wrapper from "../assets/wrappers/StatItem";

const StatItem = ({ count, title, icon, color, bcg, isFloat = false }) => {
  var value = count;
  if (isFloat) {
    value = parseFloat(count).toFixed(1);
  }
  return (
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className="count">{value}</span>
        <span className="icon">{icon}</span>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
};
export default StatItem;
