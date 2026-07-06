import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface CardRow {
  id: string;
  name: string;
  rarity: string | null;
  image_url: string | null;
  type: string | null;
  artist?: { name_en: string } | { name_en: string }[] | null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const setId = url.searchParams.get('setId') ?? 'sv03.5';

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase server environment variables.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { data, error } = await supabase
    .from('cards')
    .select(`
      id,
      name,
      rarity,
      image_url,
      type,
      artist:artists ( name_en )
    `)
    .eq('set_id', setId)
    .order('id', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const cards = (data as CardRow[]).map((card) => ({
    id: card.id,
    name: card.name,
    rarity: card.rarity ?? 'Common',
    image_url: card.image_url,
    type: card.type,
    artist_name: Array.isArray(card.artist)
      ? card.artist[0]?.name_en ?? 'Unknown Artist'
      : card.artist?.name_en ?? 'Unknown Artist',
  }));

  return NextResponse.json({ cards });
}