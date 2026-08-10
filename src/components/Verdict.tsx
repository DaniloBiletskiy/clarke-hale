import { useState } from 'react';
import { siteConfig } from '../siteConfig';

type FormValues = {
  name: string;
  contact: string;
  matter: string;
  message: string;
};

const initialValues: FormValues = { name: '', contact: '', matter: '', message: '' };

function validate(v: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (v.name.trim().length < 2) errors.name = 'Please enter your name.';
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.contact.trim());
  const phone = /^[+()\-.\s\d]{7,}$/.test(v.contact.trim());
  if (!email && !phone) errors.contact = 'Enter a valid email or phone.';
  if (!v.matter) errors.matter = 'Please choose a matter.';
  if (v.message.trim().length < 10) errors.message = 'A few words about the matter (min. 10 characters).';
  return errors;
}

export function Verdict() {
  const c = siteConfig;
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate(values);
    if (Object.keys(er).length > 0) {
      setErrors(er);
      return;
    }
    setSent(true);
  };

  return (
    <section className="verdict" id="contact" aria-label="Contact">
      <div className="vd-head">
        <p className="sc-kicker light">{c.verdict.kicker}</p>
        <h2 className="vd-title">
          {c.verdict.titleA} <em>{c.verdict.titleEm}</em>
          <br />
          {c.verdict.titleB}
        </h2>
        <p className="vd-sub">{c.verdict.sub}</p>
      </div>

      <div className="vd-sheet">
        <div className="vd-contacts">
          <p className="vd-sheet-kicker">Clarke &amp; Hale — direct line</p>
          <dl>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${c.contact.phone.replace(/[\s]/g, '')}`}>{c.contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Office</dt>
              <dd>{c.contact.office}</dd>
            </div>
          </dl>
          <p className="vd-note">
            First consultations are confidential and without obligation.
          </p>
        </div>

        {sent ? (
          <div className="vd-success" role="status">
            <p className="vd-success-title">{c.contact.successTitle}</p>
            <p className="vd-success-ref">{c.contact.successRef}</p>
            <p className="vd-success-note">{c.contact.successNote}</p>
          </div>
        ) : (
          <form className="vd-form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="f-name">Name</label>
              <input
                id="f-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={set('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-contact">Email or phone</label>
              <input
                id="f-contact"
                type="text"
                autoComplete="email"
                value={values.contact}
                onChange={set('contact')}
                aria-invalid={!!errors.contact}
              />
              {errors.contact && <p className="field-error">{errors.contact}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-matter">Matter</label>
              <select id="f-matter" value={values.matter} onChange={set('matter')} aria-invalid={!!errors.matter}>
                <option value="">Select…</option>
                {c.contact.matters.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.matter && <p className="field-error">{errors.matter}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-message">Message</label>
              <textarea id="f-message" rows={4} value={values.message} onChange={set('message')} aria-invalid={!!errors.message} />
              {errors.message && <p className="field-error">{errors.message}</p>}
            </div>
            <button className="btn" type="submit">
              {c.verdict.cta}
            </button>
          </form>
        )}
      </div>

      <footer className="site-footer">
        <span>{c.footer.note}</span>
        <span>
          {c.brand.name} — {c.brand.tag}
        </span>
      </footer>
    </section>
  );
}
