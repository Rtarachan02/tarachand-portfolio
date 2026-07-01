import { type FormEvent, useState } from "react";
import { useContactForm } from "@/hooks/useContactForm";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const { mutate, isPending, isSuccess, isError } = useContactForm();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate(form, {
      onSuccess: () => setForm({ name: "", email: "", subject: "", message: "" }),
    });
  }

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in Touch</h1>
        <p className="text-muted">
          Have a role, project, or question in mind? Send a message and I'll get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          required
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <textarea
          required
          rows={5}
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Sending…" : "Send message"}
        </button>

        {isSuccess && <p className="text-sm text-primary">Message sent — thank you!</p>}
        {isError && (
          <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
}
