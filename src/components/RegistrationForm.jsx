import { useState } from "react";

const FIELDS = [
  { key: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
  { key: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
  { key: "phone", label: "Phone Number", type: "tel", placeholder: "+1 555 123 4567" },
  { key: "age", label: "Age", type: "number", placeholder: "25" },
];

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = "Full name is required.";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email.";
  }

  if (!values.phone.trim()) errors.phone = "Phone number is required.";
  else if (!/^\+?[\d\s\-().]{7,15}$/.test(values.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.age) errors.age = "Age is required.";
  else if (Number(values.age) < 1 || Number(values.age) > 120) {
    errors.age = "Age must be between 1 and 120.";
  }

  return errors;
}

export default function RegistrationForm() {
  const emptyState = { name: "", email: "", phone: "", age: "" };
  const [values, setValues] = useState(emptyState);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    if (touched[name]) {
      const nextErrors = validate(nextValues);
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
    }
  };

  const onBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const allTouched = { name: true, email: true, phone: true, age: true };
    setTouched(allTouched);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setValues(emptyState);
        setTouched({});
        setErrors({});
        setIsSuccess(false);
      }, 2000);
    }, 700);
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Registration Form</h1>
        <p className="subtitle">Please enter your details below.</p>

        <form onSubmit={onSubmit} noValidate>
          {FIELDS.map(({ key, label, type, placeholder }) => {
            const hasError = touched[key] && errors[key];
            return (
              <div className="field" key={key}>
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  name={key}
                  type={type}
                  value={values[key]}
                  placeholder={placeholder}
                  onChange={onChange}
                  onBlur={onBlur}
                  className={hasError ? "error-input" : ""}
                  min={type === "number" ? 1 : undefined}
                  max={type === "number" ? 120 : undefined}
                />
                {hasError && <small className="error-text">{errors[key]}</small>}
              </div>
            );
          })}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Account"}
          </button>

          {isSuccess && <p className="success-text">Registration successful.</p>}
        </form>
      </section>
    </main>
  );
}
