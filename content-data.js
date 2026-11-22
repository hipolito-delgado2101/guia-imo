/* Catálogo de consulta limitado. No determina la clasificación de una mercancía real.
 * Revisado el 21 de noviembre de 2026 contra las fuentes primarias enlazadas.
 * Las referencias ADR/OSHA se utilizan solo para conceptos generales, no para
 * imponer requisitos marítimos o nacionales fuera de su jurisdicción.
 */
globalThis.IMO_DATA = {
  version: 'IMDG 2024 · Enmienda 42-24',
  reviewedAt: '2026-11-21',
  scope: 'Orientación para mercancías peligrosas en bultos por vía marítima. No sustituye la clasificación del expedidor, la FDS del producto ni la revisión del IMDG vigente por personal competente.',
  sources: [
    { id: 'imo-current', title: 'IMO · Edición vigente del Código IMDG', url: 'https://www.imo.org/es/publications/pages/imdg%20code.aspx' },
    { id: 'imo-42-24', title: 'IMO · Resolución MSC.556(108), enmienda 42-24', url: 'https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/MSCResolutions/MSC.556(108).pdf' },
    { id: 'mca-documents', title: 'MCA · Declaración y certificado de arrumazón', url: 'https://www.gov.uk/guidance/mca-guidance-for-container-packing-certificated-on-dangerous-goods-notes' },
    { id: 'ilo-ethanol', title: 'OIT / OMS · Ficha ICSC 0044, etanol anhidro', url: 'https://chemicalsafety.ilo.org/dyn/icsc/showcard.display?p_lang=es&p_card_id=0044&p_version=2' },
    { id: 'ilo-acetone', title: 'OIT / OMS · Ficha ICSC 0087, acetona', url: 'https://chemicalsafety.ilo.org/dyn/icsc/showcard.display?p_lang=es&p_card_id=0087&p_version=2' },
    { id: 'sds-structure', title: 'OSHA · Estructura de la ficha de datos de seguridad', url: 'https://www.osha.gov/sites/default/files/appendix_d.pdf' },
    { id: 'hazard-classes', title: 'Gobierno del Reino Unido · Clases de mercancías peligrosas', url: 'https://www.gov.uk/moving-dangerous-goods/what-are-dangerous-goods' }
  ],
  cargoCatalog: [
    {
      un: '1170',
      name: 'Etanol o etanol en solución',
      aliases: ['etanol', 'alcohol etílico', 'alcohol etilico', 'ethanol', 'ethyl alcohol'],
      imoClass: '3',
      packingGroup: 'II o III · por confirmar',
      risks: ['Líquido inflamable', 'Los vapores pueden formar mezclas explosivas con el aire', 'Posible irritación ocular'],
      labels: ['Clase 3 · líquidos inflamables'],
      notes: 'La entrada admite grupos II y III. La concentración y las propiedades de la solución afectan su clasificación; no se deduce del nombre comercial.',
      safety: ['Evitar llamas, chispas y fuentes de ignición.', 'Mantener ventilación adecuada y revisar incompatibilidades con oxidantes fuertes.', 'Seleccionar protección ocular y guantes según la FDS del producto.'],
      sourceIds: ['imo-42-24', 'ilo-ethanol']
    },
    {
      un: '1090',
      name: 'Acetona',
      aliases: ['acetona', 'acetone', 'propanona', '2-propanona', 'dimetil cetona'],
      imoClass: '3',
      packingGroup: 'II',
      risks: ['Líquido muy inflamable', 'Los vapores pueden alcanzar una fuente de ignición distante', 'Irritación ocular y de las vías respiratorias'],
      labels: ['Clase 3 · líquidos inflamables'],
      notes: 'Referencia de la entrada de acetona. Una mezcla que la contenga requiere evaluación propia.',
      safety: ['Controlar fuentes de ignición y asegurar ventilación.', 'Revisar la compatibilidad del envase y las incompatibilidades con oxidantes.', 'Evitar el acceso de derrames a desagües y seguir la FDS para su gestión.'],
      sourceIds: ['imo-42-24', 'ilo-acetone']
    },
    {
      un: '3480',
      name: 'Baterías de ion litio',
      aliases: ['baterías de ion litio', 'baterias de ion litio', 'baterías de litio', 'baterias de litio', 'lithium ion batteries'],
      imoClass: '9',
      packingGroup: 'No asignado',
      risks: ['Incendio por fallo o cortocircuito', 'Las unidades dañadas requieren evaluación específica'],
      labels: ['Etiqueta 9A para bultos, según régimen aplicable'],
      notes: 'UN 3480 corresponde a baterías enviadas solas. Con equipos puede corresponder UN 3481. Revisar estado, capacidad y disposiciones especiales.',
      safety: ['Proteger contra cortocircuitos y movimientos.', 'Revisar ensayos UN 38.3 y embalaje aplicable.'],
      sourceIds: ['imo-42-24']
    },
    {
      un: '3077',
      name: 'Sustancia sólida peligrosa para el medio ambiente, n.e.p.',
      aliases: ['sustancia peligrosa para el medio ambiente sólida', 'sustancia peligrosa para el medio ambiente solida', 'environmentally hazardous substance solid'],
      imoClass: '9',
      packingGroup: 'III',
      risks: ['Peligro para el medio acuático'],
      labels: ['Clase 9', 'Marca de contaminante del mar, cuando corresponda'],
      notes: 'Entrada genérica: confirmar criterios, nombre técnico y excepciones aplicables.',
      safety: ['Prevenir liberaciones al ambiente y revisar las condiciones de contención.'],
      sourceIds: ['imo-42-24']
    }
  ],
  genericSafety: [
    { title: 'Manipulación', description: 'Revisar las secciones 7 y 8 de la FDS: método de trabajo, ventilación y equipo de protección adecuado al producto.' },
    { title: 'Almacenamiento', description: 'Consultar las condiciones de almacenamiento y las incompatibilidades en las secciones 7 y 10 de la FDS.' },
    { title: 'Etiquetado y embalaje', description: 'Pedir al responsable competente que verifique envases, cierres, marcas y etiquetas para la expedición concreta.' },
    { title: 'Segregación', description: 'Verificar la compatibilidad de todas las mercancías del contenedor antes de cargarlas; una clase de peligro por sí sola no permite resolverla.' },
    { title: 'Condiciones de transporte', description: 'Confirmar las condiciones especiales de la entrada ONU, el modo de transporte y la aceptación de la naviera.' }
  ],
  guideClasses: [
    { id: '1', name: 'Explosivos', description: 'Sustancias y objetos explosivos; divisiones 1.1 a 1.6.' },
    { id: '2', name: 'Gases', description: '2.1 inflamables; 2.2 no inflamables ni tóxicos; 2.3 tóxicos.' },
    { id: '3', name: 'Líquidos inflamables', description: 'Líquidos que presentan peligro de inflamación.' },
    { id: '4', name: 'Sólidos y sustancias reactivas', description: '4.1 sólidos inflamables; 4.2 combustión espontánea; 4.3 gases inflamables al contacto con agua.' },
    { id: '5', name: 'Comburentes y peróxidos', description: '5.1 sustancias comburentes; 5.2 peróxidos orgánicos.' },
    { id: '6', name: 'Tóxicos e infecciosos', description: '6.1 sustancias tóxicas; 6.2 sustancias infecciosas.' },
    { id: '7', name: 'Material radiactivo', description: 'Materiales sujetos a requisitos de protección radiológica.' },
    { id: '8', name: 'Corrosivos', description: 'Sustancias corrosivas.' },
    { id: '9', name: 'Peligros diversos', description: 'Otras sustancias y objetos peligrosos, incluidas determinadas baterías y contaminantes.' }
  ],
  documentGuide: [
    { id: 'fds', title: 'Ficha de datos de seguridad (FDS)', description: 'Solicitar al proveedor la versión del producto. Revisar identidad, composición y sección 14. Es información de apoyo; no reemplaza la documentación de transporte.', appliesTo: 'Referencia del producto', sourceIds: ['sds-structure'] },
    { id: 'dgd', title: 'Declaración de mercancías peligrosas (DGD)', description: 'Revisar la información y declaración del expedidor exigidas para la expedición marítima. La persona responsable debe firmar y fechar cuando proceda.', appliesTo: 'Mercancía peligrosa sujeta al régimen de documentación', sourceIds: ['mca-documents'] },
    { id: 'packing', title: 'Certificado de arrumazón del contenedor / vehículo', description: 'Verificar su aplicación a la unidad cargada. Puede integrarse con la declaración de mercancías peligrosas, con la certificación correspondiente.', appliesTo: 'Carga en contenedor o vehículo, según régimen', sourceIds: ['mca-documents'] },
    { id: 'transport', title: 'Documentos comerciales y de transporte', description: 'Confirmar con el operador y agente de aduanas el conocimiento de embarque, factura, lista de empaque y trámites de la operación.', appliesTo: 'Según operación, transportista y destino', sourceIds: [] },
    { id: 'permits', title: 'Permisos y autorizaciones aplicables', description: 'Confirmar con las autoridades de origen, tránsito y destino los permisos de la mercancía y del régimen aduanero. Esta aplicación no determina su exigibilidad.', appliesTo: 'Revisión específica por país y producto', sourceIds: [] },
    { id: 'battery', title: 'Información de ensayos y condiciones de la batería', description: 'Consultar con fabricante y especialista los documentos exigibles para la batería concreta, incluidos los relativos a UN 38.3.', appliesTo: 'Baterías de litio, según tipo y condiciones', sourceIds: ['imo-42-24'] }
  ],
  dateNote: 'Las fechas de revisión o vencimiento son las indicadas por el emisor o por tu control interno. No se asigna un vencimiento universal a una FDS o DGD.',
  unknownCargoNote: 'Sin coincidencia en este catálogo limitado. Esto no significa que la mercancía sea no peligrosa. Solicita la clasificación marítima al proveedor o a un especialista.'
};
