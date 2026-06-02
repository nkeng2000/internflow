import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase';

type WithId = { id: number };
type Setter<T> = React.Dispatch<React.SetStateAction<T[]>>;

interface Options<T> {
  // Map a DB row -> app object (e.g. is_read -> read)
  fromDb?: (row: any) => T;
  // Map an app object -> DB row (e.g. read -> is_read)
  toDb?: (obj: T) => any;
}

// Broadcast a Supabase error so the UI can show it (see Toaster).
function emitError(table: string, op: string, message: string) {
  console.error(`[Supabase] ${op} "${table}" failed:`, message);
  window.dispatchEvent(new CustomEvent('supabase-error', {
    detail: `${op} ${table}: ${message}`,
  }));
}

// ====================================================================
// useSupabaseTable
// Loads a table from Supabase once, returns a useState-style setter that
// auto-syncs every add / update / delete back to Supabase.
// ====================================================================
export function useSupabaseTable<T extends WithId>(
  table: string,
  options: Options<T> = {},
): [T[], Setter<T>, boolean] {
  const { fromDb, toDb } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<T[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: rows, error } = await supabase.from(table).select('*');
      if (!active) return;
      if (error) {
        emitError(table, 'load', error.message);
      } else if (rows) {
        const mapped = (fromDb ? rows.map(fromDb) : (rows as T[]));
        ref.current = mapped;
        setData(mapped);
      }
      setLoading(false);
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const persist = useCallback((prev: T[], next: T[]) => {
    // Deletions
    const removed = prev.filter(p => !next.some(n => n.id === p.id)).map(p => p.id);
    if (removed.length) {
      supabase.from(table).delete().in('id', removed).then(({ error }) => {
        if (error) emitError(table, 'delete', error.message);
      });
    }
    // Inserts + updates
    const changed = next.filter(n => {
      const old = prev.find(p => p.id === n.id);
      return !old || JSON.stringify(old) !== JSON.stringify(n);
    });
    if (changed.length) {
      const payload = toDb ? changed.map(toDb) : changed;
      supabase.from(table).upsert(payload).then(({ error }) => {
        if (error) emitError(table, 'save', error.message);
      });
    }
  }, [table, toDb]);

  const setAndSync = useCallback<Setter<T>>((updater) => {
    const prev = ref.current;
    const next = typeof updater === 'function'
      ? (updater as (p: T[]) => T[])(prev)
      : updater;
    ref.current = next;
    setData(next);
    persist(prev, next);
  }, [persist]);

  return [data, setAndSync, loading];
}
