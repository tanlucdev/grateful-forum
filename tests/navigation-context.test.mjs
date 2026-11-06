// node --conditions=react-server --experimental-strip-types tests/navigation-context.test.mjs
import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToReadableStream } from 'next/dist/compiled/react-server-dom-webpack/server.node.js';
const state=new AsyncLocalStorage(), root=new URL('../',import.meta.url);
const source=text=>({url:`data:text/javascript,${encodeURIComponent(text)}`,shortCircuit:true});
globalThis.__contextFixture={
 cookies:async()=>({getAll:()=>[],set:()=>{}}),
 createClient:()=>{const s=state.getStore();s.clients++;return {auth:{
  getUser:async()=>{s.authCalls++;await s.authGate;return {data:{user:s.user},error:s.authError};},
  getSession:async()=>({data:{session:s.session?{}:null},error:null}),
 },rpc:async(name,args)=>{s.calls.push({name,args});await s.dataGate;return {data:{userId:s.contextId??s.user?.id,profile:{id:s.user?.id},statistics:args.include_statistics?{total:3,streak:2}:null,quota:null},error:s.rpcError};}};},
};
const hooks=registerHooks({resolve(specifier,context,next){
 if(specifier==='@supabase/ssr')return source('export const createServerClient=globalThis.__contextFixture.createClient;');
 if(specifier==='next/headers')return source('export const cookies=globalThis.__contextFixture.cookies;');
 if(specifier.startsWith('@/'))return next(new URL(specifier.slice(2)+'.ts',root).href,context);
 if(specifier.startsWith('.')&&context.parentURL?.startsWith(root.href+'lib/')){
  const candidate=new URL(specifier+'.ts',context.parentURL);
  if(existsSync(fileURLToPath(candidate)))return next(candidate.href,context);
 }
 return next(specifier,context);
}});
const oldUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,oldKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
process.env.NEXT_PUBLIC_SUPABASE_URL='http://localhost:54321';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='fixture-only';
try {
 const {loadJournalContext,loadJournalShellContext}=await import('../lib/profile/load-journal-context.ts');
 async function check(user,extra={}) {
  let releaseAuth,releaseData;
  const request={user,session:true,clients:0,authCalls:0,calls:[],authGate:new Promise(r=>{releaseAuth=r;}),dataGate:new Promise(r=>{releaseData=r;}),...extra};
  await state.run(request,async()=>{
   async function Page(){
    const reads=Promise.allSettled([loadJournalContext(),loadJournalContext(),loadJournalShellContext()]);
    let completed=false;reads.then(()=>{completed=true;});
    await new Promise(r=>setImmediate(r));
    assert.equal(request.authCalls,1);assert.equal(request.calls.length,request.session?2:0);
    releaseData();await new Promise(r=>setImmediate(r));
    assert.equal(completed,false,'No profile or quota may escape before getUser verifies the identity');
    releaseAuth();
    const results=await reads;
    if(extra.rpcError||extra.contextId){
     assert.ok(results.every(r=>r.status==='rejected'));
    }else{
     assert.ok(results.every(r=>r.status==='fulfilled'));
     if(!user||extra.authError)assert.ok(results.every(r=>r.value===null),'Discard DB data when verification fails');
     else {
      assert.equal(results[0].value.user.id,user.id);assert.equal(results[1].value.statistics.total,3);
      assert.equal(results[2].value.statistics,null,'Shell must not wait for statistics');
     }
    }
    return 'context-ok';
   }
   const stream=await renderToReadableStream(React.createElement(Page),{},{onError:e=>{throw e;}});
   assert.ok((await new Response(stream).text()).includes('context-ok'));
  });
  assert.equal(request.clients,1);
 }
 await Promise.all([check({id:'account-a'}),check({id:'account-b'})]);
 await check({id:'guest',is_anonymous:true});
 await check(null,{session:false});
 await check({id:'forged'},{authError:{message:'invalid JWT'}});
 await check({id:'account-a'},{contextId:'account-b'});
 await check({id:'account-a'},{rpcError:{message:'database unavailable'}});
 console.log('navigation context checks passed: parallel verified auth/read, two-account isolation, request cache, rejected JWT, identity mismatch, guest, signed-out and DB failure');
}finally{
 hooks.deregister();delete globalThis.__contextFixture;
 if(oldUrl===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_URL;else process.env.NEXT_PUBLIC_SUPABASE_URL=oldUrl;
 if(oldKey===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=oldKey;
}
