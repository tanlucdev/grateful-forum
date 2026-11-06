// node --conditions=react-server --experimental-strip-types tests/navigation-calendar.test.mjs
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToReadableStream } from 'next/dist/compiled/react-server-dom-webpack/server.node.js';
const root=new URL('../',import.meta.url);
const source=text=>({url:`data:text/javascript,${encodeURIComponent(text)}`,shortCircuit:true});
const hooks=registerHooks({resolve(specifier,context,next){
 if(specifier.includes('load-journal-context'))return source('export const loadJournalContext=()=>globalThis.__calendarContext();');
 if(specifier==='@/lib/supabase/server')return source('export const createSupabaseServerClient=async()=>globalThis.__calendarClient;');
 if(specifier==='@/lib/supabase/env')return source('export const hasSupabaseEnv=()=>true;');
 if(specifier.startsWith('@/'))return next(new URL(specifier.slice(2)+'.ts',root).href,context);
 if(specifier.startsWith('.')&&context.parentURL?.startsWith(root.href+'lib/')){
  const candidate=new URL(specifier+'.ts',context.parentURL);
  if(existsSync(fileURLToPath(candidate)))return next(candidate.href,context);
 }
 return next(specifier,context);
}});
try{
 const {loadCalendarOverview}=await import('../lib/calendar/service.ts');
 const {queryJournalStatistics}=await import('../lib/profile/queries.ts');
 for(const scenario of ['default','filtered','timezone-fallback']){
  const filtered=scenario==='filtered',fallback=scenario==='timezone-fallback';
  let releaseContext,releaseStats;
  const contextGate=new Promise(r=>{releaseContext=r;}),statsGate=new Promise(r=>{releaseStats=r;});
  const calls=[],bounds={};
  const statistics={timezone:fallback?'UTC+3':'America/New_York',total:4,publicTotal:2,streak:1,currentStreak:1,longestStreak:3,yearBuckets:{},weekBuckets:{},monthEntries:2,activeDaysThisMonth:1,currentMonthActiveDays:1,previous:1};
  globalThis.__calendarContext=async()=>{await contextGate;return {user:{id:'owner'},profile:{timezone:statistics.timezone,calendar_tour_seen_at:null},statistics,quota:null};};
  const client={rpc:async(name,args)=>{calls.push({name,args});await statsGate;return {data:{...statistics,timezone:args.zone},error:null};},from:table=>{
   assert.equal(table,'entries','No duplicate profile query');
   const query={select:()=>query,eq:()=>query,is:()=>query,order:()=>query,gte:(_column,v)=>{bounds.start=v;return query;},lt:(_column,v)=>{bounds.end=v;return query;},limit:async()=>({data:[],error:null})};return query;
  }};
  globalThis.__calendarClient=client;
  async function Page(){
   const overview=loadCalendarOverview(filtered?{view:'month',year:2026,month:11,date:'2026-11-01'}:{view:'year'});
   const shell=queryJournalStatistics(client);
   await new Promise(r=>setImmediate(r));assert.equal(bounds.start,undefined,'Entries await verified context');
   releaseContext();await new Promise(r=>setImmediate(r));
   assert.ok(bounds.start,'Selected entries must not wait for filtered statistics');
   assert.equal(calls.length,filtered||fallback?1:0,'Default calendar and shell reuse context statistics');
   if(calls.length)assert.equal(calls[0].args.zone,fallback?'Asia/Ho_Chi_Minh':'America/New_York');
   releaseStats();const result=await overview;await shell;
   assert.equal(result.stats.totalEntries,4);
   assert.equal(result.timezone,fallback?'Asia/Ho_Chi_Minh':statistics.timezone);
   if(filtered){assert.equal(bounds.start,'2026-11-01T04:00:00.000Z');assert.equal(bounds.end,'2026-11-02T05:00:00.000Z');}
   return 'calendar-ok';
  }
  const stream=await renderToReadableStream(React.createElement(Page),{},{onError:e=>{throw e;}});
  assert.ok((await new Response(stream).text()).includes('calendar-ok'));
 }
 console.log('navigation calendar checks passed: verified context, no duplicate queries, parallel filtered reads, DST and timezone fallback');
}finally{hooks.deregister();delete globalThis.__calendarClient;delete globalThis.__calendarContext;}
