-- Table: folders
create table if not exists folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references folders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  folder_id uuid references folders(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  type text,
  date text,
  tags text[],
  size integer,
  storage_path text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: tasks (To-Do)
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  done boolean default false,
  context_id uuid,
  context_type text check (context_type in ('folder', 'document')),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable storage for documents
-- In Supabase dashboard, create a bucket named 'documents' (public: false)
