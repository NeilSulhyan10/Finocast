# Supabase setup: Finocast enquiries

The application reuses the Supabase project configured by the existing public environment variables. It does not create a project, and it does not require public database writes.

## Environment

Set these in the project-root `.env` file for local development and in the deployment environment for production. Next.js loads `.env` files from the project root; keep `.env` out of Git. `.env.example` contains placeholders only.

- `NEXT_PUBLIC_SUPABASE_URL` — the existing project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the project's publishable key. This is the key name already present in the local environment and is safe for browser use with RLS. The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` name is also supported as a fallback.
- `SUPABASE_SERVICE_ROLE_KEY` — the project service role/secret key. Server only; never prefix it with `NEXT_PUBLIC_`, include it in client code, or commit its value.
- `CRON_SECRET` — required when enabling quote attachments. Set a long random value and schedule `POST /api/cron/quote-upload-cleanup` with `Authorization: Bearer <value>`.

Email notification variables are optional to database persistence. The public form response is successful only after its database transaction succeeds. If notification delivery fails, the enquiry remains saved and the server logs the notification failure.

## Apply the database and storage migration

Apply `supabase/migrations/202610100001_finocast_admin_enquiries.sql` to the existing project using the Supabase SQL editor or the Supabase CLI linked to that project. It creates enquiries, quote details, admin membership, expiring upload batches, attachment metadata, indexes, constraints, RLS and the private `quote-attachments` bucket. Review and apply the migration once per project. The migration does not create an admin login.

Public users have no table read/write policies. Public forms call validated server routes that use the server-only service role after validation. All `/api/admin/*` handlers verify the Supabase Auth user and membership in `public.admin_users` before reading or changing records. The browser never receives the service key. Storage is private; admins can access objects under Storage RLS, and the download route issues a one-minute signed link only after an admin membership check.

## Create the first administrator

1. In Supabase Dashboard, invite or create the intended administrator under Authentication → Users. Keep public sign-up disabled.
2. Copy that user's UUID from the dashboard.
3. In the SQL editor, run the following with the actual UUID:

   ```sql
   insert into public.admin_users (user_id)
   values ('00000000-0000-0000-0000-000000000000');
   ```

4. Visit `/admin/login` and sign in with that Supabase Auth account.

Do not add a default password, expose an admin registration route, or grant admin membership to a public role. Remove membership by deleting that user's row from `public.admin_users`.

## Attachments and cleanup

The quote form accepts PDF, DWG, DXF, STEP/STP, IGES/IGS, JPG/JPEG, PNG, WEBP and TIFF: at most 5 files, each at most 10 MiB, combined at most 25 MiB. Each upload session expires in 30 minutes. Metadata is reserved before upload and linked to a quote only after the server verifies every stored object. Failed client submissions delete the staged objects. Before enabling attachment uploads in production, set `CRON_SECRET` and schedule `POST /api/cron/quote-upload-cleanup` at least daily to remove abandoned sessions and their files. The endpoint processes up to 100 expired batches per call; repeat it until it reports zero when backlogs are possible.

The bucket name is fixed to `quote-attachments` and has a 10 MiB per-object limit. Storage policies do not grant anonymous listing, reading or deletion. Never change the bucket to public or add anonymous `SELECT` policies for enquiries or storage.

## Operations and limitations

- Verify the migration is applied and the bucket is private before accepting production enquiries.
- Add the service role key only to server-side environment configuration. A configured environment variable does not by itself prove the database is reachable; verify database, attachment, and administrator operations against the target project before deployment.
- Public form rate limiting currently uses per-process memory. For multi-instance or high-volume deployment, configure an edge/platform rate limit before public launch.
- The app sends optional email notifications after persistence. Configure the existing email provider separately if notifications are required.
