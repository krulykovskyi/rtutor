import { MouseEventHandler } from "react";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  text?: string;
  type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
  onClick = (e) => {
    console.log(e);
  },
  text = "Button",
  type = "button",
}) => (
  <button type={type} onClick={onClick}>
    {text}
  </button>
);
export default Button;
