'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../geo.js');
test('port matching accepts normalized city names and leaves unknown destinations unmapped', () => {
  assert.equal(G.resolvePort(' Perú · Callao ').id,'callao');
  assert.equal(G.resolvePort('VALPARAISO').id,'valparaiso');
  assert.equal(G.resolvePort('Puerto desconocido'),null);
  assert.equal(G.resolvePort('España'),null);
  assert.equal(G.resolvePort('Colombia · Valencia'),null);
  assert.equal(G.route({origin:'Callao',destination:'España'}).mapped,false);
});
test('port projection stays inside the map and route wrapping takes the Pacific edge', () => {
  for(const port of G.ports){const p=G.project(port);assert.ok(p.x>=0&&p.x<=1000&&p.y>=0&&p.y<=440);}
  assert.equal(G.connection(G.resolvePort('Callao'),G.resolvePort('Valencia')).length,1);
  assert.equal(G.connection(G.resolvePort('Callao'),G.resolvePort('Shanghai')).length,2);
  assert.equal(G.connection(G.resolvePort('Shanghai'),G.resolvePort('Callao')).length,2);
});
