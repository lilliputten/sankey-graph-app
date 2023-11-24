import { TGojsData, TGojsLinkDataArray, TGojsNodeDataArray } from 'src/core/types/gojs';

export function getGojsSampleData(): TGojsData {
  // prettier-ignore
  const nodeDataArray: TGojsNodeDataArray = [
    { key: 'Coal reserves', text: 'Coal reserves', color: '#9d75c2' },
    { key: 'Coal imports', text: 'Coal imports', color: '#9d75c2' },
    { key: 'Oil reserves', text: 'Oil\nreserves', color: '#9d75c2' },
    { key: 'Oil imports', text: 'Oil imports', color: '#9d75c2' },
    { key: 'Gas reserves', text: 'Gas reserves', color: '#a1e194' },
    { key: 'Gas imports', text: 'Gas imports', color: '#a1e194' },
    { key: 'UK land based bioenergy', text: 'UK land based bioenergy', color: '#f6bcd5' },
    { key: 'Marine algae', text: 'Marine algae', color: '#681313' },
    { key: "Agricultural 'waste'", text: "Agricultural 'waste'", color: '#3483ba' },
    { key: 'Other waste', text: 'Other waste', color: '#c9b7d8' },
    { key: 'Biomass imports', text: 'Biomass imports', color: '#fea19f' },
    { key: 'Biofuel imports', text: 'Biofuel imports', color: '#d93c3c' },
    { key: 'Coal', text: 'Coal', color: '#9d75c2' },
    { key: 'Oil', text: 'Oil', color: '#9d75c2' },
    { key: 'Natural gas', text: 'Natural\ngas', color: '#a6dce6' },
    { key: 'Solar', text: 'Solar', color: '#c9a59d' },
    { key: 'Solar PV', text: 'Solar PV', color: '#c9a59d' },
    { key: 'Bio-conversion', text: 'Bio-conversion', color: '#b5cbe9' },
    { key: 'Solid', text: 'Solid', color: '#40a840' },
    { key: 'Liquid', text: 'Liquid', color: '#fe8b25' },
    { key: 'Gas', text: 'Gas', color: '#a1e194' },
    { key: 'Nuclear', text: 'Nuclear', color: '#fea19f' },
    { key: 'Thermal generation', text: 'Thermal\ngeneration', color: '#3483ba' },
    { key: 'CHP', text: 'CHP', color: 'yellow' },
    { key: 'Electricity imports', text: 'Electricity imports', color: 'yellow' },
    { key: 'Wind', text: 'Wind', color: '#cbcbcb' },
    { key: 'Tidal', text: 'Tidal', color: '#6f3a5f' },
    { key: 'Wave', text: 'Wave', color: '#8b8b8b' },
    { key: 'Geothermal', text: 'Geothermal', color: '#556171' },
    { key: 'Hydro', text: 'Hydro', color: '#7c3e06' },
    { key: 'Electricity grid', text: 'Electricity grid', color: '#e483c7' },
    { key: 'H2 conversion', text: 'H2 conversion', color: '#868686' },
    { key: 'Solar Thermal', text: 'Solar Thermal', color: '#c9a59d' },
    { key: 'H2', text: 'H2', color: '#868686' },
    { key: 'Pumped heat', text: 'Pumped heat', color: '#96665c' },
    { key: 'District heating', text: 'District heating', color: '#c9b7d8' },
    { key: 'Losses', ltext: 'Losses', color: '#fec184' },
    { key: 'Over generation / exports', ltext: 'Over generation / exports', color: '#f6bcd5' },
    { key: 'Heating and cooling - homes', ltext: 'Heating and cooling - homes', color: '#c7a39b' },
    { key: 'Road transport', ltext: 'Road transport', color: '#cbcbcb' },
    { key: 'Heating and cooling - commercial', ltext: 'Heating and cooling - commercial', color: '#c9a59d' },
    { key: 'Industry', ltext: 'Industry', color: '#96665c' },
    { key: 'Lighting &amp; appliances - homes', ltext: 'Lighting &amp; appliances - homes', color: '#2dc3d2' },
    { key: 'Lighting &amp; appliances - commercial', ltext: 'Lighting &amp; appliances - commercial', color: '#2dc3d2' },
    { key: 'Agriculture', ltext: 'Agriculture', color: '#5c5c10' },
    { key: 'Rail transport', ltext: 'Rail transport', color: '#6b6b45' },
    { key: 'Domestic aviation', ltext: 'Domestic aviation', color: '#40a840' },
    { key: 'National navigation', ltext: 'National navigation', color: '#a1e194' },
    { key: 'International aviation', ltext: 'International aviation', color: '#fec184' },
    { key: 'International shipping', ltext: 'International shipping', color: '#fec184' },
    { key: 'Geosequestration', ltext: 'Geosequestration', color: '#fec184' },
  ];
  const linkDataArray: TGojsLinkDataArray = [
    { from: 'Coal reserves', to: 'Coal', width: 31 },
    { from: 'Coal imports', to: 'Coal', width: 86 },
    { from: 'Oil reserves', to: 'Oil', width: 244 },
    { from: 'Oil imports', to: 'Oil', width: 1 },
    { from: 'Gas reserves', to: 'Natural gas', width: 182 },
    { from: 'Gas imports', to: 'Natural gas', width: 61 },
    { from: 'UK land based bioenergy', to: 'Bio-conversion', width: 1 },
    { from: 'Marine algae', to: 'Bio-conversion', width: 1 },
    { from: "Agricultural 'waste'", to: 'Bio-conversion', width: 1 },
    { from: 'Other waste', to: 'Bio-conversion', width: 8 },
    { from: 'Other waste', to: 'Solid', width: 1 },
    { from: 'Biomass imports', to: 'Solid', width: 1 },
    { from: 'Biofuel imports', to: 'Liquid', width: 1 },
    { from: 'Coal', to: 'Solid', width: 117 },
    { from: 'Oil', to: 'Liquid', width: 244 },
    { from: 'Natural gas', to: 'Gas', width: 244 },
    { from: 'Solar', to: 'Solar PV', width: 1 },
    { from: 'Solar PV', to: 'Electricity grid', width: 1 },
    { from: 'Solar', to: 'Solar Thermal', width: 1 },
    { from: 'Bio-conversion', to: 'Solid', width: 3 },
    { from: 'Bio-conversion', to: 'Liquid', width: 1 },
    { from: 'Bio-conversion', to: 'Gas', width: 5 },
    { from: 'Bio-conversion', to: 'Losses', width: 1 },
    { from: 'Solid', to: 'Over generation / exports', width: 1 },
    { from: 'Liquid', to: 'Over generation / exports', width: 18 },
    { from: 'Gas', to: 'Over generation / exports', width: 1 },
    { from: 'Solid', to: 'Thermal generation', width: 106 },
    { from: 'Liquid', to: 'Thermal generation', width: 2 },
    { from: 'Gas', to: 'Thermal generation', width: 87 },
    { from: 'Nuclear', to: 'Thermal generation', width: 41 },
    { from: 'Thermal generation', to: 'District heating', width: 2 },
    { from: 'Thermal generation', to: 'Electricity grid', width: 92 },
    { from: 'Thermal generation', to: 'Losses', width: 142 },
    { from: 'Solid', to: 'CHP', width: 1 },
    { from: 'Liquid', to: 'CHP', width: 1 },
    { from: 'Gas', to: 'CHP', width: 1 },
    { from: 'CHP', to: 'Electricity grid', width: 1 },
    { from: 'CHP', to: 'Losses', width: 1 },
    { from: 'Electricity imports', to: 'Electricity grid', width: 1 },
    { from: 'Wind', to: 'Electricity grid', width: 1 },
    { from: 'Tidal', to: 'Electricity grid', width: 1 },
    { from: 'Wave', to: 'Electricity grid', width: 1 },
    { from: 'Geothermal', to: 'Electricity grid', width: 1 },
    { from: 'Hydro', to: 'Electricity grid', width: 1 },
    { from: 'Electricity grid', to: 'H2 conversion', width: 1 },
    { from: 'Electricity grid', to: 'Over generation / exports', width: 1 },
    { from: 'Electricity grid', to: 'Losses', width: 6 },
    { from: 'Gas', to: 'H2 conversion', width: 1 },
    { from: 'H2 conversion', to: 'H2', width: 1 },
    { from: 'H2 conversion', to: 'Losses', width: 1 },
    { from: 'Solar Thermal', to: 'Heating and cooling - homes', width: 1 },
    { from: 'H2', to: 'Road transport', width: 1 },
    { from: 'Pumped heat', to: 'Heating and cooling - homes', width: 1 },
    { from: 'Pumped heat', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'CHP', to: 'Heating and cooling - homes', width: 1 },
    { from: 'CHP', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'District heating', to: 'Heating and cooling - homes', width: 1 },
    { from: 'District heating', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'District heating', to: 'Industry', width: 2 },
    { from: 'Electricity grid', to: 'Heating and cooling - homes', width: 7 },
    { from: 'Solid', to: 'Heating and cooling - homes', width: 3 },
    { from: 'Liquid', to: 'Heating and cooling - homes', width: 3 },
    { from: 'Gas', to: 'Heating and cooling - homes', width: 81 },
    { from: 'Electricity grid', to: 'Heating and cooling - commercial', width: 7 },
    { from: 'Solid', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'Liquid', to: 'Heating and cooling - commercial', width: 2 },
    { from: 'Gas', to: 'Heating and cooling - commercial', width: 19 },
    { from: 'Electricity grid', to: 'Lighting &amp; appliances - homes', width: 21 },
    { from: 'Gas', to: 'Lighting &amp; appliances - homes', width: 2 },
    { from: 'Electricity grid', to: 'Lighting &amp; appliances - commercial', width: 18 },
    { from: 'Gas', to: 'Lighting &amp; appliances - commercial', width: 2 },
    { from: 'Electricity grid', to: 'Industry', width: 30 },
    { from: 'Solid', to: 'Industry', width: 13 },
    { from: 'Liquid', to: 'Industry', width: 34 },
    { from: 'Gas', to: 'Industry', width: 54 },
    { from: 'Electricity grid', to: 'Agriculture', width: 1 },
    { from: 'Solid', to: 'Agriculture', width: 1 },
    { from: 'Liquid', to: 'Agriculture', width: 1 },
    { from: 'Gas', to: 'Agriculture', width: 1 },
    { from: 'Electricity grid', to: 'Road transport', width: 1 },
    { from: 'Liquid', to: 'Road transport', width: 122 },
    { from: 'Electricity grid', to: 'Rail transport', width: 2 },
    { from: 'Liquid', to: 'Rail transport', width: 1 },
    { from: 'Liquid', to: 'Domestic aviation', width: 2 },
    { from: 'Liquid', to: 'National navigation', width: 4 },
    { from: 'Liquid', to: 'International aviation', width: 38 },
    { from: 'Liquid', to: 'International shipping', width: 13 },
    { from: 'Electricity grid', to: 'Geosequestration', width: 1 },
    { from: 'Gas', to: 'Losses', width: 2 },
  ];
  const gojsData: TGojsData = {
    // class: 'go.GraphLinksModel',
    nodeDataArray,
    linkDataArray,
  };
  // // TODO?
  // const modelData = go.Model.fromJson(gojsData);
  return gojsData;
}

export function getGojsSampleMinimalData(): TGojsData {
  // prettier-ignore
  const nodeDataArray: TGojsNodeDataArray = [
    { key: 20, text: 'Twenty', color: '#9d75c2' },
    { key: 40, text: 'Forty', color: '#fe8b25' },
    { key: 60, text: 'Sixty', color: '#2dc3d2' },
  ];
  const linkDataArray: TGojsLinkDataArray = [
    { from: 20, to: 60, width: 20 },
    { from: 40, to: 60, width: 40 },
    { from: 60, to: 100, width: 60 },
  ];
  const gojsData: TGojsData = {
    // class: 'go.GraphLinksModel',
    nodeDataArray,
    linkDataArray,
  };
  // // TODO?
  // const modelData = go.Model.fromJson(gojsData);
  return gojsData;
}