import { EmailMessage } from 'cloudflare:email';

interface Env {
  ASSETS: Fetcher;
  QUOTE_FROM?: string;
  QUOTE_EMAIL?: SendEmail;
  TURNSTILE_SECRET_KEY?: string;
}

interface SendEmail {
  send(message: EmailMessage): Promise<void>;
}

const FIELDS = {
  name: { label: 'Name', required: true, max: 120 },
  phone: { label: 'Phone', required: true, max: 40 },
  email: { label: 'Email', required: true, max: 200 },
  city: { label: 'City', required: true, max: 120 },
  service: { label: 'Service', required: true, max: 120 },
  homeSize: { label: 'Approximate home size', required: false, max: 120 },
  timing: { label: 'Preferred timing', required: false, max: 120 },
  details: { label: 'Cleaning details', required: true, max: 4000 },
} as const;

type FieldName = keyof typeof FIELDS;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

// Strip line breaks from header values so form input can't add email headers.
const headerSafe = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

// RFC 2047 encoding keeps non-ASCII names readable in the subject line.
const encodeHeader = (value: string) =>
  /^[\x20-\x7e]*$/.test(value)
    ? value
    : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(value)))}?=`;

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const outcome = (await result.json()) as { success?: boolean };
  return outcome.success === true;
}

async function handleQuote(request: Request, env: Env) {
  if (request.method !== 'POST') return json({ status: 'error', message: 'Use POST.' }, 405);
  if (!env.QUOTE_EMAIL || !env.QUOTE_FROM) {
    // Email sending is not connected yet; the page falls back to an email draft.
    return json({ status: 'unavailable' }, 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ status: 'invalid', message: 'The form could not be read.' }, 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (String(form.get('company') || '').trim()) return json({ status: 'sent' });

  if (env.TURNSTILE_SECRET_KEY) {
    const token = String(form.get('cf-turnstile-response') || '');
    const ok = token && (await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('CF-Connecting-IP')));
    if (!ok) return json({ status: 'invalid', message: 'Please complete the verification and try again.' }, 400);
  }

  const values = {} as Record<FieldName, string>;
  const missing: string[] = [];
  for (const [name, rule] of Object.entries(FIELDS) as [FieldName, (typeof FIELDS)[FieldName]][]) {
    const value = String(form.get(name) || '').trim().slice(0, rule.max);
    values[name] = value;
    if (rule.required && !value) missing.push(rule.label);
  }
  if (missing.length) {
    return json({ status: 'invalid', message: `Please fill in: ${missing.join(', ')}.` }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return json({ status: 'invalid', message: 'Enter an email address like name@example.com.' }, 400);
  }

  const subject = headerSafe(`Sparkclean quote request: ${values.service}, ${values.city}`);
  const text = [
    ...(Object.keys(FIELDS) as FieldName[])
      .filter((name) => name !== 'details')
      .map((name) => `${FIELDS[name].label}: ${values[name] || 'Not provided'}`),
    '',
    'Cleaning details:',
    values.details,
    '',
    'Sent from the quote form on the Sparkclean website. Reply to this email to answer the customer.',
  ].join('\r\n');

  const raw = [
    `From: Sparkclean Website <${env.QUOTE_FROM}>`,
    `To: <companysparkclean@gmail.com>`,
    `Reply-To: ${headerSafe(values.name).replace(/[<>"]/g, '')} <${headerSafe(values.email)}>`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@sparkclean-inc.com>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
  ].join('\r\n');

  try {
    await env.QUOTE_EMAIL.send(new EmailMessage(env.QUOTE_FROM, 'companysparkclean@gmail.com', raw));
  } catch (error) {
    console.error('Quote email failed', error instanceof Error ? error.message : 'unknown error');
    return json({ status: 'failed' }, 502);
  }
  return json({ status: 'sent' });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/quote') return handleQuote(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
