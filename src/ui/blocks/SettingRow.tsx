import { useState } from "react";
import { Settings } from "../../types/Settings";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";

type SettingRowProps = {
  setting: Settings[number];
  changeSettings: Function;
};

const SettingRow: React.FC<SettingRowProps> = ({ setting, changeSettings }) => {
  const [{ id, name, value, componentType, possibleValues }, setSetting] =
    useState(setting);

  const onChange = (e: any) => {
    const isCheckbox = componentType === "checkbox";
    const checkboxValue = isCheckbox && e.target.checked ? "on" : "off";

    setSetting({
      ...setting,
      value: isCheckbox ? checkboxValue : e.target.value,
    });
    changeSettings({
      ...setting,
      value: isCheckbox ? checkboxValue : e.target.value,
    });
  };

  switch (componentType) {
    case "select":
      return (
        <div key={id} className="flex items-center">
          <InputLabel id={name}>{name}</InputLabel>
          <Select size="small" labelId={name} value={value} onChange={onChange}>
            {possibleValues?.split(",")?.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </div>
      );
    case "input":
      return (
        <TextField
          key={id}
          size="small"
          label={name}
          value={value}
          onChange={onChange}
        />
      );
    case "checkbox":
      return (
        <FormControlLabel
          key={id}
          control={
            <Checkbox
              size="small"
              checked={value === "on"}
              onChange={onChange}
            />
          }
          label={name}
        />
      );
    default:
      return null;
  }
};

export default SettingRow;
