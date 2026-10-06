import { TYPE_COLORS } from "../utils.js";

function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ background: TYPE_COLORS[type] || "#777" }}>
      {type}
    </span>
  );
}
export default TypeBadge;
