/* Approximate port-city locations, used only for a schematic overview. */
(function(root){
  'use strict';
  const ports=[
    ['callao','Perú · Callao',-77.15,-12.05,['callao']],
    ['paita','Perú · Paita',-81.11,-5.09,['paita']],
    ['chancay','Perú · Chancay',-77.27,-11.56,['chancay']],
    ['san-antonio','Chile · San Antonio',-71.62,-33.59,['san antonio']],
    ['valparaiso','Chile · Valparaíso',-71.63,-33.04,['valparaiso']],
    ['guayaquil','Ecuador · Guayaquil',-79.9,-2.2,['guayaquil']],
    ['cartagena','Colombia · Cartagena',-75.53,10.39,['cartagena']],
    ['santos','Brasil · Santos',-46.33,-23.96,['santos']],
    ['buenos-aires','Argentina · Buenos Aires',-58.38,-34.6,['buenos aires']],
    ['manzanillo','México · Manzanillo',-104.32,19.05,['manzanillo']],
    ['los-angeles','Estados Unidos · Los Ángeles',-118.25,33.74,['los angeles']],
    ['miami','Estados Unidos · Miami',-80.18,25.78,['miami']],
    ['new-york','Estados Unidos · Nueva York',-74.05,40.68,['nueva york','new york']],
    ['valencia','España · Valencia',-.32,39.45,['valencia']],
    ['barcelona','España · Barcelona',2.17,41.35,['barcelona']],
    ['algeciras','España · Algeciras',-5.44,36.13,['algeciras']],
    ['rotterdam','Países Bajos · Róterdam',4.3,51.9,['roterdam','rotterdam']],
    ['hamburg','Alemania · Hamburgo',9.98,53.54,['hamburgo','hamburg']],
    ['shanghai','China · Shanghái',121.5,31.23,['shanghai']],
    ['singapore','Singapur',103.85,1.27,['singapur','singapore']],
    ['yokohama','Japón · Yokohama',139.65,35.45,['yokohama']],
    ['sydney','Australia · Sídney',151.21,-33.86,['sidney','sydney']]
  ].map(([id,label,lon,lat,aliases])=>({id,label,lon,lat,aliases}));
  const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  function resolvePort(value){
    const query=normalize(value);
    return ports.find(port=>normalize(port.label)===query||port.aliases.includes(query))||null;
  }
  function project(port){return {x:(port.lon+180)/360*1000,y:(85-port.lat)/145*440};}
  function route(row){const origin=resolvePort(row.origin),destination=resolvePort(row.destination);return {row,origin,destination,mapped:!!(origin&&destination)};}
  // Duplicate wrapped segments at the map edge so Pacific routes don't cross the globe.
  function connection(origin,destination){
    const a=project(origin),b=project(destination);
    if(b.x-a.x>500)b.x-=1000;
    if(a.x-b.x>500)b.x+=1000;
    const control={x:(a.x+b.x)/2,y:Math.max(18,Math.min(a.y,b.y)-Math.min(80,Math.abs(b.x-a.x)*.18))};
    const shifts=b.x<0?[0,1000]:b.x>1000?[0,-1000]:[0];
    return shifts.map(shift=>({path:`M${a.x+shift},${a.y} Q${control.x+shift},${control.y} ${b.x+shift},${b.y}`,mid:{x:(a.x+2*control.x+b.x)/4+shift,y:(a.y+2*control.y+b.y)/4}}));
  }
  const api={ports,resolvePort,project,route,connection};root.IMO_GEO=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
