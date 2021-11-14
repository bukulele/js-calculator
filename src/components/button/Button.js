import styles from "./Button.module.css";

function Button({ id, content, style, handleClick }) {
  let styleClass = id;
  let className =
    (content >= 0 && content <= 9) || content === "."
      ? `${styles.button} ${styles.digit}`
      : `${styles.button} ${styles[styleClass]}`;
  return (
    <button
      id={id}
      className={className}
      style={style}
      onClick={handleClick}
      value={content}
    >
      {content}
    </button>
  );
}

export default Button;
