import React from "react";

type ButtonProps = {
    text: String,
    disabled?: boolean,
}

const Button: React.FC<ButtonProps> = ({ text, disabled = false }) => {
    return (<button disabled={disabled}>{text}</button>);
}

export default Button;
