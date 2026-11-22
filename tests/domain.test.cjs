'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const D = require('../domain.js');
require('../content-data.js');
const catalog = globalThis.IMO_DATA.cargoCatalog;
const today = new Date(2026, 10, 21, 14, 30);
const operation = overrides => ({ operation:'export', containerized:true, destination:'Chile', un:'', docs:{}, reviewed:false, ...overrides });
function reviewedOperation(overrides = {}) {
  const state = operation(overrides);
  state.docs = Object.fromEntries(D.documents(state).map(row => [row.id,{done:true}]));
  return state;
}

test('ONU normalization accepts a known prefix but preserves four-digit identifiers', () => {
  assert.equal(D.normalizeUN(' ONU 1170 '), '1170');
  assert.equal(D.normalizeUN('un1090'), '1090');
  assert.equal(D.normalizeUN('UN 0004'), '0004');
  assert.equal(D.normalizeUN(undefined), '');
  assert.equal(D.findCargo(' ONU 1170 ', catalog)?.un, '1170');
  for (const value of ['117', '11700', '11.70', '-1170', 'UN 1170 extra', 'etanol', '']) {
    assert.equal(D.findCargo(value, catalog), null, value);
  }
});

test('an unknown ONU or ingredient name never becomes a confirmed catalog entry', () => {
  assert.equal(D.findCargo('9999', catalog), null);
  assert.equal(D.findCargo('etanol', catalog), null);
  assert.equal(D.findCargo('3481', catalog), null);
  assert.match(globalThis.IMO_DATA.unknownCargoNote, /no significa.*no peligrosa/i);
});

test('accent-insensitive aliases suggest references without mutating a classification', () => {
  assert.deepEqual(D.suggestCargo('ALCOHOL ETÍLICO', catalog).map(x=>x.un), ['1170']);
  assert.deepEqual(D.suggestCargo('Solución con acetona', catalog).map(x=>x.un), ['1090']);
  assert.deepEqual(D.suggestCargo('a', catalog), []);
  assert.deepEqual(D.suggestCargo('producto desconocido', catalog), []);
  assert.match(D.findCargo('1170', catalog).packingGroup, /II o III/);
  assert.equal(D.findCargo('3480', catalog).packingGroup, 'No asignado');
});

test('documents follow container, import, transit and battery context', () => {
  assert.ok(D.documents(operation()).some(x=>x.id==='packing'));
  assert.ok(!D.documents(operation({containerized:false})).some(x=>x.id==='packing'));
  assert.match(D.documents(operation({operation:'import'})).find(x=>x.id==='customs').name,/importación/);
  const transit = D.documents(operation({operation:'transit',destination:'Ecuador'})).find(x=>x.id==='customs');
  assert.match(transit.name,/tránsito/);
  assert.match(transit.detail,/tránsito.*Ecuador/);
  assert.ok(D.documents(operation({un:'UN 3480'})).some(x=>x.id==='battery'));
  assert.ok(!D.documents(operation({un:'1170'})).some(x=>x.id==='battery'));
  assert.ok(!D.documents(operation({un:'9999'})).some(x=>x.id==='battery'));
});

test('saved progress cannot replace authoritative document names or identifiers', () => {
  const state = operation({docs:{fds:{done:true,note:'Verificar versión',date:'2026-12-01',id:'other',name:'Cumplimiento certificado',detail:'malicious override'}}});
  const fds = D.documents(state).find(x=>x.id==='fds');
  assert.equal(fds.name,'Ficha de datos de seguridad');
  assert.equal(fds.note,'Verificar versión');
  assert.equal(fds.done,true);
  assert.notEqual(fds.detail,'malicious override');
});

test('dates validate real calendar days and treat today as still current', () => {
  assert.equal(D.dateDays('2026-11-21', today),0);
  assert.equal(D.dateDays('2026-11-20', today),-1);
  assert.equal(D.dateDays('2026-11-22', today),1);
  assert.equal(D.dateDays('2028-02-29',new Date(2028,1,28,23,59)),1);
  for(const value of ['',null,undefined,'2026-02-29','2026-04-31','2026-13-01','2026-00-10','2026-11-00','2026-1-01','2026-11-21T00:00:00Z','0000-01-01']) {
    assert.equal(D.dateDays(value,today),null,String(value));
  }
  assert.equal(D.dateDays('2026-11-21',new Date('invalid')),null);
  assert.ok(Number.isFinite(D.dateDays('0099-01-01',today)));
});

test('date comparisons use the local calendar, including UTC rollover and DST', () => {
  const domainPath = require.resolve('../domain.js');
  const run = (timezone,script) => {
    const result = spawnSync(process.execPath,['-e',`const d=require(${JSON.stringify(domainPath)});${script}`],{env:{...process.env,TZ:timezone},encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    return JSON.parse(result.stdout);
  };
  assert.equal(run('America/Lima',"process.stdout.write(JSON.stringify(d.dateDays('2026-11-21',new Date('2026-11-22T01:00:00Z'))));"),0);
  assert.equal(run('Pacific/Auckland',"process.stdout.write(JSON.stringify(d.dateDays('2026-11-22',new Date('2026-11-21T12:30:00Z'))));"),0);
  assert.equal(run('America/New_York',"process.stdout.write(JSON.stringify(d.dateDays('2026-03-09',new Date('2026-03-08T00:30:00-05:00'))));"),1);
});

test('only applicable, reviewed and current documents count toward progress', () => {
  const state = reviewedOperation({containerized:false,un:'1090'});
  state.docs.packing={done:true};
  state.docs.battery={done:true};
  state.docs.unknown={done:true};
  assert.deepEqual(D.progress(state,today),{done:5,total:5,percent:100});
  state.docs.fds.date='2026-11-20';
  assert.deepEqual(D.progress(state,today),{done:4,total:5,percent:80});
  state.docs.fds.date='2026-11-21';
  assert.equal(D.progress(state,today).percent,100);
  state.docs.fds.date='2026-02-30';
  assert.equal(D.progress(state,today).done,4);
  state.docs.fds.date='';
  assert.equal(D.progress(state,today).done,5);
});

test('expiry alerts respect the 30-day boundary and ignore stale document records', () => {
  const state = reviewedOperation({containerized:false,reviewed:true});
  state.docs.fds.date='2026-11-20';
  state.docs.dgd.date='2026-11-21';
  state.docs.transport.date='2026-12-21';
  state.docs.customs.date='2026-12-22';
  state.docs.packing={done:true,date:'2026-11-01'};
  const alerts=D.alerts(state,today);
  assert.equal(alerts.find(x=>x.id==='expired-fds').level,'danger');
  assert.match(alerts.find(x=>x.id==='soon-dgd').title,/vence hoy/);
  assert.match(alerts.find(x=>x.id==='soon-transport').title,/30 días/);
  assert.ok(!alerts.some(x=>x.id==='soon-customs'));
  assert.ok(!alerts.some(x=>x.id==='expired-packing'));
  assert.ok(!alerts.some(x=>x.id==='review'));
});

test('an expired checked document stays pending and triggers the pre-departure warning', () => {
  const state=reviewedOperation({departure:'2026-11-28',reviewed:true});
  state.docs.fds.date='2026-11-20';
  const alerts=D.alerts(state,today);
  assert.match(alerts.find(x=>x.id==='pending').title,/1 documentos/);
  assert.ok(alerts.some(x=>x.id==='departure'));
  assert.ok(!D.alerts({...state,departure:'2026-11-29'},today).some(x=>x.id==='departure'));
  assert.match(D.alerts({...state,departure:'2026-11-21'},today).find(x=>x.id==='departure').title,/hoy/);
  assert.ok(D.alerts({...state,departure:'2026-11-20'},today).some(x=>x.id==='departure-past'));
  state.docs.fds.date='2026-12-30';
  assert.ok(!D.alerts(state,today).some(x=>['pending','departure'].includes(x.id)));
});
