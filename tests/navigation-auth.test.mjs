// Run: node --conditions=react-server --experimental-strip-types tests/navigation-auth.test.mjs
// Real React RSC cache/renderer and application modules; Supabase verification is stubbed.
import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToReadableStream } from 'next/dist/compiled/react-server-dom-webpack/server.node.js';
import { NextRequest, NextResponse } from 'next/server.js';

const state = new AsyncLocalStorage();
const root = new URL('../',import.meta.url);
const moduleUrl = source => `data:text/javascript,${encodeURIComponent(source)}`;
const fixture = {
 cookies: async () => ({ getAll: () => [], set: () => {} }),
 createClient: (_url,_key,options) => {
  const request=state.getStore(); request.clients++;
  return { auth: { getUser: async () => {
   request.authCalls++;
   await Promise.resolve();
   if(request.refresh) options.cookies.setAll([{name:'sb-test-auth-token',value:'refreshed-test-cookie',options:{httpOnly:true,path:'/'}}]);
   return { data:{ user: request.user }, error: request.error??null };
  }, getSession: async () => {
   request.sessionCalls = (request.sessionCalls ?? 0) + 1;
   if(request.refresh) options.cookies.setAll([{name:'sb-test-auth-token',value:'refreshed-test-cookie',options:{httpOnly:true,path:'/'}}]);
   return {data:{session:request.user?{user:request.user}:null},error:request.error??null};
  } } };
 },
 middleware: request => {
  const response=NextResponse.rewrite(new URL('/vi/profile',request.url));
  response.headers.set('x-middleware-override-headers','accept-language');
  response.headers.set('x-middleware-request-accept-language','vi');
  return response;
 },
};
globalThis.__navigationAuthFixture=fixture;
const hooks=registerHooks({ resolve(specifier,context,next) {
 if(specifier==='@supabase/ssr')return {url:moduleUrl('export const createServerClient = globalThis.__navigationAuthFixture.createClient;'),shortCircuit:true};
 if(specifier==='next/headers')return {url:moduleUrl('export const cookies = globalThis.__navigationAuthFixture.cookies;'),shortCircuit:true};
 if(specifier==='next/server')return next('next/server.js',context);
 if(specifier==='next-intl/middleware')return {url:moduleUrl('export default () => (request) => globalThis.__navigationAuthFixture.middleware(request);'),shortCircuit:true};
 if(specifier.startsWith('@/'))return next(new URL(`${specifier.slice(2)}.ts`,root).href,context);
 if(specifier.startsWith('.')&&context.parentURL?.startsWith(root.href+'lib/')) {
  const candidate=new URL(specifier+'.ts',context.parentURL);
  if(existsSync(fileURLToPath(candidate)))return next(candidate.href,context);
 }
 return next(specifier,context);
}});
const oldEnv={url:process.env.NEXT_PUBLIC_SUPABASE_URL,key:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY};
process.env.NEXT_PUBLIC_SUPABASE_URL='http://localhost:54321';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='fixture-only';
try {
 const {getCurrentUser,getVerifiedUser}=await import('../lib/auth/current-user.ts');
 const {createSupabaseServerClient}=await import('../lib/supabase/server.ts');
 async function render(user,error) {
  const request={user,error,clients:0,authCalls:0};
  await state.run(request,async()=>{
   async function Page() {
    const [a,b,c]=await Promise.all([getCurrentUser(),getCurrentUser(),getCurrentUser()]);
    assert.equal(a,b);assert.equal(b,c);
    assert.equal(a?.id??null,error||user?.is_anonymous?null:user?.id??null);
    assert.equal((await getVerifiedUser())?.id??null,error?null:user?.id??null);
    assert.equal(await createSupabaseServerClient(),await createSupabaseServerClient());
    return a?.id??'signed-out';
   }
   const stream=await renderToReadableStream(React.createElement(Page),{}, {onError:error=>{throw error;}});
   const result=await new Response(stream).text();
   assert.ok(result.includes(error||user?.is_anonymous||!user?'signed-out':user.id));
  });
  assert.equal(request.clients,1);assert.equal(request.authCalls,1);
 }
 await Promise.all([render({id:'account-a'}),render({id:'account-b'})]);
 await render(null); await render({id:'expired'},{message:'expired'}); await render({id:'guest',is_anonymous:true});
 const {proxy}=await import('../proxy.ts');
 const request=new NextRequest('http://localhost/vi/profile',{headers:{cookie:'sb-test-auth-token=old-test-cookie','accept-language':'vi'}});
 const proxyState={user:{id:'account-a'},clients:0,authCalls:0,refresh:true};
 const response=await state.run(proxyState,()=>proxy(request));
 assert.equal(proxyState.authCalls,0,'Proxy refresh must not repeat server identity verification');
 assert.equal(proxyState.sessionCalls,1);
 assert.equal(request.cookies.get('sb-test-auth-token').value,'refreshed-test-cookie');
 assert.ok(response.headers.get('x-middleware-request-cookie').includes('sb-test-auth-token=refreshed-test-cookie'));
 assert.ok(response.headers.get('set-cookie').includes('sb-test-auth-token=refreshed-test-cookie'));
 assert.equal(response.headers.get('x-middleware-request-accept-language'),'vi');
 assert.equal(response.headers.get('x-middleware-override-headers'),'accept-language,cookie');
 assert.equal(response.headers.get('x-middleware-rewrite'),'http://localhost/vi/profile');
 fixture.middleware = request => NextResponse.rewrite(new URL('/vi/profile',request.url));
 const rscRequest=new NextRequest('http://localhost/vi/profile',{headers:{cookie:'sb-test-auth-token=old-test-cookie',rsc:'1','next-router-state-tree':'fixture-router-tree'}});
 const rscResponse=await state.run({user:{id:'account-a'},clients:0,authCalls:0,refresh:true},()=>proxy(rscRequest));
 assert.ok(rscResponse.headers.get('x-middleware-override-headers').split(',').includes('rsc'));
 assert.equal(rscResponse.headers.get('x-middleware-request-rsc'),'1');
 assert.equal(rscResponse.headers.get('x-middleware-request-next-router-state-tree'),'fixture-router-tree');
 console.log('navigation auth checks passed: real RSC cache, concurrent accounts, signed-out/expired/anonymous, proxy cookie forwarding; auth backend stubbed');
} finally {
 hooks.deregister();delete globalThis.__navigationAuthFixture;
 if(oldEnv.url===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_URL;else process.env.NEXT_PUBLIC_SUPABASE_URL=oldEnv.url;
 if(oldEnv.key===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=oldEnv.key;
}
