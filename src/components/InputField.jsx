import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, required = false, name }) => {
  return (
    <div className="input-field">
      <label className="input-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="input"
        required={required}
        name={name}
      />
    </div>
  );
};

export default InputField;