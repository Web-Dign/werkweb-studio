/* WERKWEB Studio – fiktive Kalkulationsregeln V2.
   Publikationen auf GitHub Pages sind öffentlich: NIE Echtdaten in diesem Tool verwenden.
   2026-10 – Kein Kundenpreis, keine freigegebenen Leistungstarife.
*/
(function(root,factory) {
  const api=factory();
  if (typeof module === "object" && module.exports) module.exports=api;
  else root.WerkwebPricing=api;
})(typeof globalThis !== "undefined" ? globalThis : this,function(){
  "use strict";
  const VERSION="2.0.0-demo";
  const PACKAGES=Object.freeze({
    starter:{label:"Website Starter",hours:8},
    plus:{label:"Website Plus",hours:12},
    premium:{label:"Website Premium",hours:18}
  });
  const TRADES=Object.freeze({
    elektro:{label:"Elektrik",design:"Voltwerk – Elektro",hours:2},
    shk:{label:"Sanitär / Heizung",design:"Wasserwerk – SHK",hours:3},
    dach:{label:"Dachdecker",design:"Dachkante – Dachdecker",hours:3},
    maler:{label:"Maler",design:"Farbraum° – Maler",hours:2},
    anderes:{label:"Sonstiges Handwerk",design:"Individuell",hours:4}
  });
  const EXTRAS=Object.freeze({
    kontakt:{label:"Kontaktformular (nach rechtlicher Freigabe)",hours:2,eur:0},
    galerie:{label:"Projektgalerie",hours:3,eur:0},
    termin:{label:"Terminbuchung (externer Dienst gesondert prüfen)",hours:6,eur:30},
    lokalseo:{label:"Lokale SEO-Grundstruktur",hours:3,eur:0},
    sprachen:{label:"Zweite Sprachversion",hours:6,eur:0},
    texte:{label:"Textentwürfe",hours:4,eur:0},
    statistik:{label:"Besucherstatistik (Datenschutz prüfen)",hours:2,eur:0},
    hosting:{label:"Hosting-/Domain-Einrichtung (laufende Kosten offen)",hours:2,eur:20}
  });
  function ensureNumber(value,name,min,max){
    if(value==="" || value===null || value===undefined)throw new Error(name+" fehlt.");
    const n=Number(value);
    if(!Number.isFinite(n)||n<min||n>max)throw new Error(name+" außerhalb des gültigen Bereichs.");
    return n;
  }
  function ensureKey(obj,k,name){if(typeof k!=="string"||!Object.prototype.hasOwnProperty.call(obj,k))throw new Error("Ungültige Auswahl: "+name);return obj[k];}
  function validateText(value,name){
    if(typeof value!=="string"||!value.trim()||value.length>400)throw new Error(name+" muss 1–400 Zeichen enthalten.");
    return value.trim();
  }
  function calculate(input){
    if(!input || typeof input!=="object" || Array.isArray(input))throw new Error("Ungültige Projektdaten.");
    const pack=ensureKey(PACKAGES,input.package,"Paket");
    const trade=ensureKey(TRADES,input.trade,"Gewerk");
    const pages=ensureNumber(input.pages,"Seitenzahl",1,30);
    if(!Number.isInteger(pages))throw new Error("Seitenzahl muss eine ganze Zahl sein.");
    const hourlyRate=ensureNumber(input.hourlyRate,"Stundensatz",1,1000);
    const costs=ensureNumber(input.extraCost,"Zusatzkosten",0,100000);
    const buffer=ensureNumber(input.riskPercent,"Risikopuffer",0,100);
    if(!Array.isArray(input.addons)||new Set(input.addons).size!==input.addons.length)throw new Error("Zusatzleistungen müssen eindeutig sein.");
    const selected=input.addons.map(k=>({id:k,...ensureKey(EXTRAS,k,"Zusatzleistung")}));
    const extraPageHours=Math.max(0,pages-4)*2;
    const hours=pack.hours+trade.hours+extraPageHours+selected.reduce((sum,e)=>sum+e.hours,0);
    const addonEuros=selected.reduce((sum,e)=>sum+e.eur,0);
    const labor=hours*hourlyRate;
    const directCosts=costs+addonEuros;
    const subtotal=labor+directCosts;
    const bufferValue=subtotal*buffer/100;
    const total=subtotal+bufferValue;
    function cents(x){return Math.round((x+Number.EPSILON)*100)/100;}
    return {
      schema:VERSION,package:input.package,trade:input.trade,pages,
      packageLabel:pack.label,tradeLabel:trade.label,design:trade.design,
      addons:selected.map(e=>({id:e.id,label:e.label,hours:e.hours,eur:e.eur})),
      hours,costHours:{package:pack.hours,trade:trade.hours,extraPages:extraPageHours,addons:selected.reduce((sum,e)=>sum+e.hours,0)},
      hourlyRate,extraCost:costs,addonOneOff:addonEuros,riskPercent:buffer,
      labor:cents(labor),directCosts:cents(directCosts),subtotal:cents(subtotal),
      bufferAmount:cents(bufferValue),internalBasis:cents(total),
      note:"Ausschließlich interne DEMO-Kostenbasis; kein Verkaufspreis, keine vollständige Selbstkostenrechnung."
    };
  }
  function money(n){return new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n);}
  function draft(input,result){
    const company=validateText(input.company,"Firmenname");
    const contact=validateText(input.contact,"Ansprechpartner");
    const wishes=validateText(input.wishes,"Projektwünsche");
    const addonLine=result.addons.length?result.addons.map(a=>"- "+a.label).join("\n"):"- Keine zusätzlichen Module";
    return [
      "FIKTIVER TEST – INTERNER ANGEBOTSENTWURF – NICHT VERSENDEN","",
      "Betreff: Unverbindlicher Website-Vorschlag für "+company,"",
      "Guten Tag "+contact+",","",
      "vielen Dank für Ihre Anfrage. Für Ihren fiktiven "+result.tradeLabel+"-Betrieb schlagen wir einen vorläufigen Website-Aufbau vor:",
      "Paket: "+result.packageLabel,
      "Designrichtung: "+result.design,
      "Umfang: "+result.pages+" Inhaltsseiten/Bereiche",
      "Zusatzleistungen:",addonLine,"",
      "Projektwünsche (unverifiziert): "+wishes,"",
      "Mögliche Bestandteile nach Abstimmung: responsive Gestaltung, Leistungsübersicht, Über-uns-Bereich, Kontaktmöglichkeiten und SEO-Basis.",
      "Vor einem Angebot klären: Logo, Texte, Bilder und Nutzungsrechte; Domain/Hosting; Barrierefreiheit; Rechtstexte; Zeitpunkt, Abnahme und Korrekturschleifen.",
      "Kundenpreis: [NACH PRÜFUNG UND FREIGABE EINTRAGEN]",
      "Umsatzsteuerstatus: [PRÜFEN]",
      "Termine und Vertragsbedingungen: [ABSTIMMEN]","",
      "Freundliche Grüße","WERKWEB Studio – DEMO","",
      "====== NUR INTERN – NICHT AN KUNDEN VERSENDEN ======",
      "Rechenmodell "+result.schema+" | "+result.hours+" h (Paket "+result.costHours.package+" h + Gewerk "+result.costHours.trade+" h + zusätzliche Seiten "+result.costHours.extraPages+" h + Module "+result.costHours.addons+" h)",
      "Arbeitskosten: "+result.hours+" h × "+money(result.hourlyRate)+" = "+money(result.labor),
      "Sonstige einmalige Kosten: "+money(result.directCosts)+" (davon Module "+money(result.addonOneOff)+")",
      "Zwischensumme: "+money(result.subtotal),
      "Risikopuffer "+result.riskPercent+" %: "+money(result.bufferAmount),
      "Interne DEMO-Kostenbasis: "+money(result.internalBasis),
      "Dies ist kein freigegebener Verkaufspreis. Fixkosten, Akquise, Steuern, Gewinn, Hosting und Verträge sind nicht vollständig abgedeckt.",
      "KEINE echte Anfrage. KEINE E-Mail automatisch versenden."
    ].join("\n");
  }
  return Object.freeze({VERSION,PACKAGES,TRADES,EXTRAS,calculate,money,draft});
});