import styles from "./Display.module.css";

function Display({ displayInput, upperDisplayInput }) {
  return (
    <div className={styles.Display}>
      <div className={styles.upperDisplay}>{upperDisplayInput}</div>
      <div id="display" className={styles.bottomDisplay}>
        {displayInput}
      </div>
    </div>
  );
}

export default Display;
