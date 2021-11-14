import Button from "../button/Button";
import styles from "./Container.module.css";

function Container({ calcElements, handleClick }) {
  let buttonsArray = [];
  buttonsArray = Object.entries(calcElements).map((entry) => {
    return (
      <Button
        id={entry[0]}
        key={entry[0]}
        content={entry[1]}
        style={{ gridArea: entry[0] }}
        handleClick={handleClick}
      />
    );
  });
  return <div className={styles.Container}>{buttonsArray}</div>;
}

export default Container;
