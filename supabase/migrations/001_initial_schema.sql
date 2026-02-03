-- Users table (extends Supabase auth)
create table if not exists profiles (
  id uuid references auth.users primary key,
  created_at timestamp with time zone default now(),
  openai_api_key_encrypted text, -- optional stored key
  settings jsonb default '{}'
);

-- Base strategies (preloaded GTO-ish charts)
create table if not exists base_strategies (
  id serial primary key,
  street text not null, -- 'preflop', 'flop', 'turn', 'river'
  position text not null,
  hand_category text not null, -- e.g., "premium", "suited_connectors", "top_pair"
  situation text not null, -- e.g., "RFI", "vs_3bet", "cbet", "facing_cbet"
  board_texture text, -- 'dry', 'wet', 'paired' (for postflop)
  stack_depth_min int,
  stack_depth_max int,
  fold_pct decimal,
  call_pct decimal,
  raise_pct decimal,
  raise_size decimal -- in big blinds or % of pot
);

-- User's learned strategies from YouTube
create table if not exists learned_strategies (
  id serial primary key,
  user_id uuid references profiles(id),
  video_url text not null,
  video_title text,
  extracted_at timestamp with time zone default now(),
  strategy_adjustments jsonb not null,
  -- adjustments format: { position, hand, situation, adjustment }
  is_active boolean default true
);

-- Session history (optional, for tracking)
create table if not exists hand_history (
  id serial primary key,
  user_id uuid references profiles(id),
  created_at timestamp with time zone default now(),
  game_state jsonb not null,
  recommendation jsonb not null,
  action_taken text
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table learned_strategies enable row level security;
alter table hand_history enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Learned strategies policies
create policy "Users can view their own learned strategies"
  on learned_strategies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own learned strategies"
  on learned_strategies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own learned strategies"
  on learned_strategies for update
  using (auth.uid() = user_id);

create policy "Users can delete their own learned strategies"
  on learned_strategies for delete
  using (auth.uid() = user_id);

-- Hand history policies
create policy "Users can view their own hand history"
  on hand_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own hand history"
  on hand_history for insert
  with check (auth.uid() = user_id);

-- Base strategies are public read-only
create policy "Anyone can read base strategies"
  on base_strategies for select
  to anon, authenticated
  using (true);
