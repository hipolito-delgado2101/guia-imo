/* Pure domain functions shared by the browser and the Node test suite. */
(function (root) {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const normalizeUN = value => String(value || '').trim().replace(/^(UN|ONU)\s*/i, '');
  function findCargo(un, catalog) { const code = normalizeUN(un); return /^\d{4}$/.test(code) ? catalog.find(item => item.un === code) || null : null; }
  function suggestCargo(name, catalog) { const query = normalize(name); return query.length < 3 ? [] : catalog.filter(item => [item.name, ...item.aliases].some(alias => normalize(alias).includes(query) || query.includes(normalize(alias)))); }
  function dateDays(date, now = new Date()) {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !(now instanceof Date) || !Number.isFinite(now.getTime())) return null;
    const [y,m,d] = date.split('-').map(Number);
    if (y < 1) return null;
    const parsed = new Date(0);
    parsed.setUTCFullYear(y, m - 1, d);
    if (parsed.getUTCFullYear() !== y || parsed.getUTCMonth() !== m - 1 || parsed.getUTCDate() !== d) return null;
    return Math.round((parsed.getTime() - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
  }
  function documents(state) {
    const rows = [
      {id:'fds',name:'Ficha de datos de seguridad',short:'FDS',detail:'Solicita la versión vigente al proveedor y revisa la sección 14. Su actualización no tiene un plazo universal.',tag:'Identificación'},
      {id:'dgd',name:'Declaración de mercancías peligrosas',short:'DGD',detail:'Si la carga está regulada, prepara la declaración conforme al IMDG y valida los datos con personal capacitado.',tag:'Por confirmar'},
      {id:'transport',name:'Documento de transporte',short:'B/L',detail:'Coordina los datos del conocimiento de embarque y las instrucciones con tu transportista.',tag:'Transporte'},
      {id:'customs',name:state.operation === 'import'?'Documentación de importación':state.operation === 'transit'?'Documentación de tránsito':'Documentación de exportación',short:'ADUANA',detail:state.operation === 'transit'?`Confirma con tu agente el régimen y los documentos de tránsito aplicables a la ruta hacia ${state.destination || 'el destino seleccionado'}.`:`Confirma factura, lista de empaque y declaración aduanera con tu agente para ${state.destination || 'el destino seleccionado'}.`,tag:'Según operación'},
      {id:'permits',name:'Permisos y autorizaciones',short:'PERMISOS',detail:`Consulta a la autoridad competente del país de origen y de ${state.destination || 'destino'}. No se han verificado permisos locales automáticamente.`,tag:'Validación local'}
    ];
    if(state.containerized !== false) rows.splice(3,0,{id:'packing',name:'Certificado de arrumazón del contenedor',short:'CTU',detail:'Cuando corresponda a la unidad de transporte y operación, confirma el certificado de arrumazón. Puede integrarse con la DGD.',tag:'Contenedor'});
    if(normalizeUN(state.un) === '3480') rows.push({id:'battery',name:'Resumen de ensayos UN 38.3',short:'UN 38.3',detail:'Solicita al fabricante el resumen de ensayos aplicable a las baterías; revisa las condiciones del embarque y del transportista.',tag:'Baterías de litio'});
    return rows.map(row => {
      const saved = state.docs?.[row.id] || {};
      return {...row, done:saved.done === true, date:typeof saved.date === 'string'?saved.date:'', note:typeof saved.note === 'string'?saved.note:''};
    });
  }
  function isDocumentComplete(doc, now = new Date()) {
    if (doc.done !== true) return false;
    if (!doc.date) return true;
    const days = dateDays(doc.date, now);
    return days !== null && days >= 0;
  }
  function progress(state, now = new Date()) { const docs=documents(state); const done=docs.filter(x=>isDocumentComplete(x,now)).length; return {done,total:docs.length,percent:Math.round(done/docs.length*100)}; }
  function alerts(state, now = new Date()) {
    const result=[];
    for(const doc of documents(state)) { const days=dateDays(doc.date,now);
      if(days!==null && days<0) result.push({id:`expired-${doc.id}`,level:'danger',title:`${doc.name}: fecha vencida`,body:'La fecha que registraste ya pasó. Confirma la vigencia con el emisor.',view:'documents'});
      else if(days!==null && days<=30) result.push({id:`soon-${doc.id}`,level:'warning',title:`${doc.name}: ${days===0?'vence hoy':`vence en ${days} días`}`,body:'Revisa si corresponde renovar o actualizar el documento.',view:'documents'});
    }
    const pending=documents(state).filter(x=>!isDocumentComplete(x,now)).length;
    if(pending) result.push({id:'pending',level:'warning',title:`${pending} documentos por revisar`,body:'Completa tu checklist y confirma qué requisitos aplican a esta operación.',view:'checklist'});
    if(!state.reviewed) result.push({id:'review',level:'info',title:'Clasificación pendiente de revisión',body:'Contrasta el número ONU con la sección 14 de la FDS y con un especialista.',view:'classification'});
    const departure=dateDays(state.departure,now);
    if(departure!==null && departure<=7 && departure>=0 && pending) result.push({id:'departure',level:'danger',title:`Operación ${departure===0?'prevista para hoy':`en ${departure} días`}`,body:'Hay requisitos pendientes. Coordina su revisión antes del embarque.',view:'checklist'});
    if(departure!==null && departure<0) result.push({id:'departure-past',level:'warning',title:'La fecha prevista de operación ya pasó',body:'Actualiza la fecha o conserva el expediente como registro de la operación.',view:'identification'});
    return result;
  }
  function hasCargo(state) { return Boolean(state.name?.trim() || state.un?.trim() || state.components?.trim() || state.attachment); }
  function restoreWorkspace(saved, create) {
    const valid = row => row && typeof row.id === 'string' && row.docs && typeof row.docs === 'object' && !Array.isArray(row.docs);
    const source = saved?.version === 2 && Array.isArray(saved.operations) ? saved.operations : saved?.version === 1 ? [saved] : [];
    const ids = new Set();
    const operations = source.filter(row => { if (!valid(row) || ids.has(row.id)) return false; ids.add(row.id); return true; }).map(row => ({...create(), ...row}));
    if (!operations.length) operations.push(create());
    return {version:2, activeId:operations.some(row => row.id === saved?.activeId) ? saved.activeId : operations[0].id, operations};
  }
  function summarize(operations, now = new Date()) {
    const rows = operations.filter(hasCargo);
    const totals = rows.reduce((sum, row) => { const p = progress(row, now); sum.done += p.done; sum.total += p.total; if (p.percent === 100) sum.complete++; return sum; }, {done:0,total:0,complete:0});
    return {...totals, count:rows.length, pending:totals.total-totals.done, percent:totals.total ? Math.round(totals.done/totals.total*100) : 0};
  }
  const api={normalize,normalizeUN,findCargo,suggestCargo,dateDays,documents,isDocumentComplete,progress,alerts,hasCargo,restoreWorkspace,summarize};
  root.IMO_DOMAIN=api;
  if(typeof module!=='undefined' && module.exports) module.exports=api;
})(globalThis);
