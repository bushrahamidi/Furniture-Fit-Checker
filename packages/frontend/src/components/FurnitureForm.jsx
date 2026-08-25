import React from 'react';
import './FormFields.css';

function FurnitureForm({ furniture, errors, touched, furnitureTypes, onChange, onBlur }) {
  return (
    <fieldset className="form-section">
      <legend className="form-section__title">Furniture Information</legend>

      <div className="form-field">
        <label className="form-field__label" htmlFor="furniture-name">Furniture Name</label>
        <input
          id="furniture-name"
          className="form-field__control"
          type="text"
          value={furniture.name}
          onChange={(event) => onChange('name', event.target.value)}
          onBlur={() => onBlur('name')}
          aria-invalid={touched.name && Boolean(errors.name)}
          aria-describedby={errors.name ? 'furniture-name-error' : undefined}
        />
        {touched.name && errors.name && (
          <span id="furniture-name-error" className="form-field__error" role="alert">{errors.name}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="furniture-type">Furniture Type</label>
        <select
          id="furniture-type"
          className="form-field__control"
          value={furniture.type}
          onChange={(event) => onChange('type', event.target.value)}
          onBlur={() => onBlur('type')}
          aria-invalid={touched.type && Boolean(errors.type)}
          aria-describedby={errors.type ? 'furniture-type-error' : undefined}
        >
          <option value="" disabled>Select a type</option>
          {furnitureTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {touched.type && errors.type && (
          <span id="furniture-type-error" className="form-field__error" role="alert">{errors.type}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="furniture-width">Width (in)</label>
        <input
          id="furniture-width"
          className="form-field__control"
          type="number"
          inputMode="decimal"
          min="1"
          value={furniture.width}
          onChange={(event) => onChange('width', event.target.value)}
          onBlur={() => onBlur('width')}
          aria-invalid={touched.width && Boolean(errors.width)}
          aria-describedby={errors.width ? 'furniture-width-error' : undefined}
        />
        {touched.width && errors.width && (
          <span id="furniture-width-error" className="form-field__error" role="alert">{errors.width}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="furniture-depth">Depth (in)</label>
        <input
          id="furniture-depth"
          className="form-field__control"
          type="number"
          inputMode="decimal"
          min="1"
          value={furniture.depth}
          onChange={(event) => onChange('depth', event.target.value)}
          onBlur={() => onBlur('depth')}
          aria-invalid={touched.depth && Boolean(errors.depth)}
          aria-describedby={errors.depth ? 'furniture-depth-error' : undefined}
        />
        {touched.depth && errors.depth && (
          <span id="furniture-depth-error" className="form-field__error" role="alert">{errors.depth}</span>
        )}
      </div>
    </fieldset>
  );
}

export default FurnitureForm;
