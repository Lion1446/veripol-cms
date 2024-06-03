import { InputAdornment, TextField } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { ChangeEvent, ReactElement } from 'react';

interface Props {
  title: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ title, value, onChange }: Props): ReactElement => {
  return (
    <TextField
      id="input-with-icon-textfield"
      size="medium"
      label={title}
      style={{ flex: '1' }}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlinedIcon />
          </InputAdornment>
        )
      }}
      variant="outlined"
    />
  );
};

export default SearchBar;
